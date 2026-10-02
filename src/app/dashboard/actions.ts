"use server";

import { createClient } from "@/utils/supabase/server";

export interface Transaction {
  id: string;
  type: "in" | "out";
  description: string;
  amount: number;
  date: string;
  created_at: string;
}

export interface DashboardSummary {
  totalPemasukan: number;
  totalPengeluaran: number;
  sisaSaldo: number;
  recentTransactions: Transaction[];
}

export async function getDashboardData(): Promise<DashboardSummary> {
  const supabase = await createClient();

  // 1. Fetch seluruh transaksi untuk hitung kalkulasi
  const { data: allTransactions, error: summaryError } = await supabase
    .from("transactions")
    .select("type, amount");

  if (summaryError) {
    console.error("Error fetching summary:", summaryError);
  }

  let totalPemasukan = 0;
  let totalPengeluaran = 0;

  if (allTransactions) {
    allTransactions.forEach((tx) => {
      if (tx.type === "in") {
        totalPemasukan += Number(tx.amount) || 0;
      } else if (tx.type === "out") {
        totalPengeluaran += Number(tx.amount) || 0;
      }
    });
  }

  const sisaSaldo = totalPemasukan - totalPengeluaran;

  // 2. Fetch 10 transaksi terbaru (pemasukan & pengeluaran)
  const { data: recentTransactions, error: recentError } = await supabase
    .from("transactions")
    .select("id, type, description, amount, date, created_at")
    .order("created_at", { ascending: false })
    .limit(10);

  if (recentError) {
    console.error("Error fetching recent transactions:", recentError);
  }

  return {
    totalPemasukan,
    totalPengeluaran,
    sisaSaldo,
    recentTransactions: (recentTransactions as Transaction[]) || [],
  };
}
