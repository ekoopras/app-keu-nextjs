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

// 1. Export Create
export async function createPemasukan(formData: FormData) {
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
    type: "in",
    description,
    amount,
    date,
  });

  if (error) {
    return { error: "Gagal menyimpan data pemasukan." };
  }

  revalidatePath("/dashboard/pemasukan");
  return { success: true };
}

// 2. Export Fetch
export async function getPemasukan(): Promise<Transaction[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("transactions")
    .select("id, description, amount, date, created_at")
    .eq("type", "in")
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching pemasukan:", error);
    return [];
  }

  return data || [];
}

// 3. Export Delete
export async function deletePemasukan(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("transactions").delete().eq("id", id);

  if (error) {
    return { error: "Gagal menghapus data." };
  }

  revalidatePath("/dashboard/pemasukan");
  return { success: true };
}
