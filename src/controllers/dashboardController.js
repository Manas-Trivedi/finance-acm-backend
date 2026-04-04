import prisma from "../utils/prisma.js";

export const getDashboardSummary = async (req, res) => {
  try {
    const requestedUserId = req.query.userId;
    let targetUserId;
    if (requestedUserId && req.user.role === "ADMIN") {
      if(requestedUserId !== "all" && !isNaN(Number(requestedUserId))) {
        targetUserId = Number(requestedUserId);
      }
      else if(requestedUserId !== "all") {
        return res.status(400).json({ message: "Requested User ID is invalid" });
      }
      // else we take all records (admin access only)
    } else {
      targetUserId = req.user.userId;
    }

    const totalTransactions = await prisma.financialRecord.count({
      where: { userId: targetUserId, isDeleted: false }
    });

    const incomeAggregate = await prisma.financialRecord.aggregate({
        _sum: { amount: true },
        where: {
            type: "INCOME",
            userId: targetUserId,
            isDeleted: false
        }
    });

    const totalIncome = incomeAggregate._sum.amount || 0;

    const expenseAggregate = await prisma.financialRecord.aggregate({
        _sum: { amount: true },
        where: {
            type: "EXPENSE",
            userId: targetUserId,
            isDeleted: false
        }
    });

    const totalExpense = expenseAggregate._sum.amount || 0;

    const categoryData = await prisma.financialRecord.groupBy({
      by: ["category", "type"],
      where: { userId: targetUserId, isDeleted: false },
      _sum: { amount: true }
    });

    const categoryBreakdown = {};

    categoryData.forEach(item => {
      if (!categoryBreakdown[item.category]) {
        categoryBreakdown[item.category] = {
          income: 0,
          expense: 0
        };
      }

      if (item.type === "INCOME") {
        categoryBreakdown[item.category].income = item._sum.amount || 0;
      } else {
        categoryBreakdown[item.category].expense = item._sum.amount || 0;
      }
    });

    const recentTransactions = await prisma.financialRecord.findMany({
      where: { userId: targetUserId, isDeleted: false },
      orderBy: { date: "desc" },
      take: 5
    });

    const netBalance = totalIncome - totalExpense;

    res.status(200).json({
      totalTransactions,
      totalIncome,
      totalExpense,
      netBalance,
      categoryBreakdown,
      recentTransactions
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};