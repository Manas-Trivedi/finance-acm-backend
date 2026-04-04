import prisma from "../utils/prisma.js";

export const getUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
              id: true,
              email: true,
              role: true,
              status: true,
              createdAt: true
            }
        });
        res.json(users);
    } catch(err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateUserRole = async (req, res) => {
    try {
    const userId = Number(req.params.id);
    const { role } = req.body;

    if (!["VIEWER", "ANALYST", "ADMIN"].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
    }

    const updated = await prisma.user.update({
        where: { id: userId },
        data: { role }
    });

    res.json(updated);
    } catch(err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateUserStatus = async (req, res) => {
    try {
        const userId = Number(req.params.id);
        const { status } = req.body;
        if (!["ACTIVE", "INACTIVE"].includes(status)) {
          return res.status(400).json({ message: "Invalid status" });
        }
        const updated = await prisma.user.update({
          where: { id: userId },
          data: { status }
        });
        res.json(updated);
    } catch(err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};