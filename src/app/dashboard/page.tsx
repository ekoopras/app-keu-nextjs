"use client";

import { useEffect, useState, useCallback } from "react";
import { getDashboardData, DashboardSummary } from "./actions";
import { formatRupiah } from "@/utils/format";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  Loader2,
  ReceiptText,
  PlusCircle,
  MinusCircle,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    const res = await getDashboardData();
    setData(res);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-2 text-xs text-slate-400">
        <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
        <span>Memuat data dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          Dashboard
        </h1>
        <p className="text-xs text-slate-500">
          Ringkasan arus kas & transaksi terbaru Anda.
        </p>
      </div>

      {/* Card Ringkasan Utama (Saldo, Pemasukan, Pengeluaran) */}
      <div className="grid gap-3 sm:grid-cols-3">
        {/* Sisa Saldo */}
        <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-4 text-white shadow-lg shadow-slate-900/10 sm:col-span-3 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-300">
              Total Sisa Saldo
            </span>
            <div className="rounded-full bg-slate-700/50 p-2">
              <Wallet className="h-4 w-4 text-emerald-400" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-black tracking-tight text-white">
            {formatRupiah(data?.sisaSaldo || 0)}
          </p>
        </div>

        {/* Grid 2 Kolom untuk Total Pemasukan & Pengeluaran */}
        <div className="grid grid-cols-2 gap-3">
          {/* Total Pemasukan */}
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-800">
                Total Pemasukan
              </span>
              <div className="rounded-full bg-emerald-100 p-1.5 text-emerald-600">
                <ArrowUpRight className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-1 text-lg sm:text-xl font-bold text-emerald-700">
              {formatRupiah(data?.totalPemasukan || 0)}
            </p>
          </div>

          {/* Total Pengeluaran */}
          <div className="rounded-2xl border border-rose-100 bg-rose-50/50 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-rose-800">
                Total Pengeluaran
              </span>
              <div className="rounded-full bg-rose-100 p-1.5 text-rose-600">
                <ArrowDownLeft className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-1 text-lg sm:text-xl font-bold text-rose-700">
              {formatRupiah(data?.totalPengeluaran || 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Akses Cepat Add Transaction */}
      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/dashboard/pemasukan"
          className="flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-white py-2.5 text-xs font-bold text-emerald-700 shadow-sm transition-all hover:bg-emerald-50 active:scale-95"
        >
          <PlusCircle className="h-4 w-4" />
          <span>+ Pemasukan</span>
        </Link>
        <Link
          href="/dashboard/pengeluaran"
          className="flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-white py-2.5 text-xs font-bold text-rose-700 shadow-sm transition-all hover:bg-rose-50 active:scale-95"
        >
          <MinusCircle className="h-4 w-4" />
          <span>+ Pengeluaran</span>
        </Link>
      </div>

      {/* Tabel / List Transaksi Terbaru */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ReceiptText className="h-4 w-4 text-slate-500" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Transaksi Terbaru
            </h2>
          </div>
          <span className="text-[11px] font-medium text-slate-400">
            10 Terakhir
          </span>
        </div>

        {!data?.recentTransactions || data.recentTransactions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="text-xs text-slate-400">
              Belum ada transaksi yang tercatat.
            </p>
          </div>
        ) : (
          <div className="grid gap-2.5">
            {data.recentTransactions.map((item) => {
              const isIn = item.type === "in";
              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-3.5 shadow-sm transition-all hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        isIn
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-rose-50 text-rose-600"
                      }`}
                    >
                      {isIn ? (
                        <ArrowUpRight className="h-5 w-5" />
                      ) : (
                        <ArrowDownLeft className="h-5 w-5" />
                      )}
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-slate-800 line-clamp-1">
                        {item.description}
                      </p>
                      <span className="flex items-center gap-1 text-[10px] text-slate-400">
                        <Calendar className="h-3 w-3" />
                        {new Date(item.date).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-xs font-extrabold ${
                      isIn ? "text-emerald-600" : "text-rose-600"
                    }`}
                  >
                    {isIn ? "+" : "-"}
                    {formatRupiah(item.amount)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
