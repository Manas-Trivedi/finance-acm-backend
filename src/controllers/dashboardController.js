import prisma from "../utils/prisma.js";

export const getDashboardSummary = async (req, res) => {
  try {

    const incomeAggregate = await prisma.financialRecord.aggregate({
        _sum: { amount: true },
        where: {
            type: "INCOME",
            isDeleted: false
        }
    });

    const totalIncome = incomeAggregate._sum.amount || 0;

    const expenseAggregate = await prisma.financialRecord.aggregate({
        _sum: { amount: true },
        where: {
            type: "EXPENSE",
            isDeleted: false
        }
    });

    const totalExpense = expenseAggregate._sum.amount || 0;

    const categoryData = await prisma.financialRecord.groupBy({
      by: ["category", "type"],
      where: { isDeleted: false },
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
      where: { isDeleted: false },
      orderBy: { date: "desc" },
      take: 5
    });

    const netBalance = totalIncome - totalExpense;

    res.status(200).json({
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