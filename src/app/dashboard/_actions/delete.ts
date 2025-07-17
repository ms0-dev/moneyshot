"use server";

import { db } from "@/lib/db";
import { moneyshot } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function deleteMoneyShot(id: string) {
  await db.delete(moneyshot).where(eq(moneyshot.id, id));
}
