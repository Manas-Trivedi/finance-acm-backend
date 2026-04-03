import prisma from "../utils/prisma.js";

export const getRecords = async (req, res) => {
  try {
    const {
      type,
      category,
      minAmount,
      maxAmount,
      startDate,
      endDate,
      page = 1,
      limit = 10
    } = req.query;

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(50, Math.max(1, Number(limit)));

    const where = {
      isDeleted: false
    };

    if (type) {
        if(["INCOME", "EXPENSE"].includes(type)) {
            where.type = type;
        } else {
            return res.status(400).json({ message: "Invalid type filter" });
        }
    }

    if(category) {
        where.category = category;
    }

    if(minAmount !== undefined || maxAmount !== undefined) {
        where.amount = {}
        if(minAmount) {
            if(isNaN(Number(minAmount)))
                return res.status(400).json({ message: "Invalid minAmount" });
            where.amount.gte = Number(minAmount);
        }
        if(maxAmount) {
            if(isNaN(Number(maxAmount)))
                return res.status(400).json({ message: "Invalid maxAmount" });
            where.amount.lte = Number(maxAmount);
        }
    }

    if(startDate || endDate) {
        const dateFilter = {};

        const start = new Date(startDate);
        if (startDate && isNaN(start.getTime()))
            return res.status(400).json({ message: "Invalid startDate" });
        const end = new Date(endDate);
        if (endDate && isNaN(end.getTime()))
            return res.status(400).json({ message: "Invalid endDate" });
        if(startDate) dateFilter.gte = start;
        if(endDate) dateFilter.lte = end;

        if (Object.keys(dateFilter).length > 0) {
            where.date = dateFilter;
        }
    }

    const records = await prisma.financialRecord.findMany({
      where,
      skip: (pageNum - 1) * limitNum,
      take: limitNum,
      orderBy: { date: "desc" }
    });

    const total = await prisma.financialRecord.count({ where });
    const hasNextPage = pageNum * limitNum < total;

    res.status(200).json({
        total,
        page: pageNum,
        limit: limitNum,
        hasNextPage,
        records
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createRecord = async (req, res) => {
  try {
    const { amount, type, category, date, notes } = req.body;


    if(amount === undefined || isNaN(Number(amount))) {
        return res.status(400).json({ message: "Invalid amount" });
    }

    if (Number(amount) <= 0) {
        return res.status(400).json({ message: "Amount must be greater than 0" });
    }

    if(!type || !["INCOME", "EXPENSE"].includes(type)) {
        return res.status(400).json({ message: "Invalid type" });
    }

    if(!category || category.trim() === "") {
        return res.status(400).json({ message: "Category is required" });
    }

    const day = new Date(date);
    if(isNaN(day.getTime())) {
        return res.status(400).json({ message: "Invalid date" });
    }

    const record = await prisma.financialRecord.create({
      data: {
        amount: Number(amount),
        type,
        category,
        date: day,
        notes,
        userId: req.user.userId
      }
    });

    res.status(201).json({
      message: "Record created successfully",
      record
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, type, category, date, notes } = req.body;

    const recordId = Number(id);

    if (isNaN(recordId)) {
        return res.status(400).json({ message: "Invalid record id" });
    }

    const existingRecord = await prisma.financialRecord.findUnique({
      where: { id: recordId }
    });
    if (!existingRecord || existingRecord.isDeleted) {
        return res.status(404).json({ message: "Record not found" });
    }

    const updateData = {};

    if(amount !== undefined) {
        if(isNaN(Number(amount))) {
            return res.status(400).json({ message: "Invalid amount" });
        }

        if (Number(amount) <= 0) {
            return res.status(400).json({ message: "Amount must be greater than 0" });
        }

        updateData.amount = Number(amount);
    }

    if(type !== undefined) {
        if(!["INCOME", "EXPENSE"].includes(type)) {
            return res.status(400).json({ message: "Invalid type" });
        }

        updateData.type = type;
    }

    if(category !== undefined) {
        if(category.trim() === "") {
            return res.status(400).json({ message: "Category is required" });
        }

        updateData.category = category.trim();
    }

    if (date !== undefined) {
      const day = new Date(date);
      if (isNaN(day.getTime())) {
        return res.status(400).json({ message: "Invalid date" });
      }

      updateData.date = day;
    }

    if(notes !== undefined) updateData.notes = notes;

    if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ message: "No fields to update" });
    }

    const updatedRecord = await prisma.financialRecord.update({
      where: { id: recordId },
      data: updateData
    });

    res.status(200).json({
      message: "Record updated successfully",
      updatedRecord
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const deleteRecord = async (req, res) => {
  try {
    const { id } = req.params;

    const recordId = Number(id);
    if (isNaN(recordId)) {
      return res.status(400).json({ message: "Invalid record id" });
    }

    const existingRecord = await prisma.financialRecord.findUnique({
      where: { id: recordId }
    });
    if (!existingRecord || existingRecord.isDeleted) {
      return res.status(404).json({ message: "Record not found" });
    }

    const deletedRecord = await prisma.financialRecord.update({
      where: { id: recordId },
      data: { isDeleted: true }
    });

    res.status(200).json({
      message: "Record deleted successfully",
      deletedRecord
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};