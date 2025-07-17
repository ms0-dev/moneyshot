"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { moneyshot as moneyshots } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";

export async function deleteMoneyShot(id: string) {
  const user = await auth.api.getSession({ headers: await headers() });
  if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

  const moneyshot = await db.query.moneyshot.findFirst({
    where: and(eq(moneyshots.id, id), eq(moneyshots.userId, user.user.id)),
  });
  if (!moneyshot) return new Response(JSON.stringify({ error: "Not found or unauthorized" }), { status: 404 });

  await db.delete(moneyshots).where(eq(moneyshots.id, id));
}
