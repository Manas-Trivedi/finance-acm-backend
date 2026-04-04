import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const categories = [
  "food",
  "rent",
  "salary",
  "groceries",
  "entertainment",
  "travel",
  "utilities"
];

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

const randomAmount = (type) => {
  if (type === "INCOME") return Math.floor(Math.random() * 5000) + 1000;
  return Math.floor(Math.random() * 2000) + 100;
};

const randomDate = () => {
  const now = new Date();
  const past = new Date();
  past.setMonth(now.getMonth() - 6);

  return new Date(
    past.getTime() + Math.random() * (now.getTime() - past.getTime())
  );
};

async function main() {
  const users = await prisma.user.findMany();

  if (users.length === 0) {
    console.log("No users found. Please seed users first.");
    return;
  }

  const existingCount = await prisma.financialRecord.count();

  if (existingCount > 0) {
    console.log("Records already exist. Skipping seed.");
    return;
  }

  const records = [];

  for (let i = 0; i < 50; i++) {
    const type = Math.random() > 0.5 ? "INCOME" : "EXPENSE";

    records.push({
      amount: randomAmount(type),
      type,
      category: getRandom(categories),
      date: randomDate(),
      notes: "seeded data",
      userId: getRandom(users).id
    });
  }

  await prisma.financialRecord.createMany({
    data: records
  });

  console.log(`Seeded ${records.length} financial records.`);
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });