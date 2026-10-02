"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  created_at: string;
}

// 1. Create Pengeluaran
export async function createPengeluaran(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Sesi Anda telah berakhir, silakan login kembali." };
  }

  const description = formData.get("description") as string;
  const rawAmount = formData.get("amount") as string;
  const date = formData.get("date") as string;

  const amount = parseInt(rawAmount.replace(/[^0-9]/g, ""), 10);

  if (!description || !amount || !date) {
    return { error: "Semua kolom wajib diisi!" };
  }

  const { error } = await supabase.from("transactions").insert({
    user_id: user.id,
    type: "out",
    description,
    amount,
    date,
  });

  if (error) {
    return { error: "Gagal menyimpan data pengeluaran." };
  }

  revalidatePath("/dashboard/pengeluaran");
  return { success: true };
}

// 2. Fetch Pengeluaran
export async function getPengeluaran(): Promise<Transaction[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("transactions")
    .select("id, description, amount, date, created_at")
    .eq("type", "out")
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching pengeluaran:", error);
    return [];
  }

  return data || [];
}

// 3. Delete Pengeluaran
export async function deletePengeluaran(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("transactions").delete().eq("id", id);

  if (error) {
    return { error: "Gagal menghapus data pengeluaran." };
  }

  revalidatePath("/dashboard/pengeluaran");
  return { success: true };
}
