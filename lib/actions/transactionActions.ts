import { Transaction } from "@/database/models/transactionSchema";
import dbConnect from "@/database/dbConfig";
export async function createTransaction(
  userId: string,
  type: "earned_report" | "earned_collect" | "redeemed",
  amount: number,
  description: string
) {
    await dbConnect();
  try {
    const tx = await Transaction.create({
      userId,
      type,
      amount,
      description,
    });
    return tx;
  } catch (err) {
    console.error("createTransaction error:", err);
    return null;
  }
}

export async function getRewardTransactions(userId: string) {
    await dbConnect();
  const transactions = await Transaction.find({ userId }).sort({ date: -1 }).limit(10);
  return transactions.map(t => ({
    ...t.toObject(),
    date: t.date.toISOString().split("T")[0],
  }));
}

export async function getUserBalance(userId: string): Promise<number> {
    await dbConnect();
  const txs = await getRewardTransactions(userId);
  return Math.max(
    txs.reduce((acc, t) => {
      return t.type.startsWith("earned") ? acc + t.amount : acc - t.amount;
    }, 0),
    0
  );
}
