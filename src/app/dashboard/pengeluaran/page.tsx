"use client";

import { useState, useEffect, useCallback } from "react";
import {
  createPengeluaran,
  getPengeluaran,
  deletePengeluaran,
  Transaction,
} from "./actions";
import { formatRupiah } from "@/utils/format";
import { Modal } from "@/components/ui/dialog";
import {
  Loader2,
  Plus,
  Trash2,
  ArrowDownLeft,
  Calendar,
  Search,
} from "lucide-react";

export default function PengeluaranPage() {
  const [description, setDescription] = useState("");
  const [amountDisplay, setAmountDisplay] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [search, setSearch] = useState("");

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Fetch data pengeluaran dari Supabase
  const loadData = useCallback(async () => {
    setLoadingData(true);
    const data = await getPengeluaran();
    setTransactions(data);
    setLoadingData(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle Input Rupiah
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, "");
    if (rawValue) {
      setAmountDisplay(formatRupiah(rawValue));
    } else {
      setAmountDisplay("");
    }
  };

  // Handle Simpan Data via Modal
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("description", description);
    formData.append("amount", amountDisplay);
    formData.append("date", date);

    const result = await createPengeluaran(formData);

    if (result.error) {
      setMessage({ type: "error", text: result.error });
    } else {
      setDescription("");
      setAmountDisplay("");
      setIsModalOpen(false);
      loadData();
    }

    setSubmitting(false);
  };

  // Handle Hapus Data
  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data pengeluaran ini?"))
      return;
    setDeletingId(id);
    const res = await deletePengeluaran(id);
    if (res.error) {
      alert(res.error);
    } else {
      loadData();
    }
    setDeletingId(null);
  };

  // Filter Search
  const filteredTransactions = transactions.filter((item) =>
    item.description.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPengeluaran = transactions.reduce(
    (acc, curr) => acc + curr.amount,
    0,
  );

  return (
    <div className="space-y-5 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          Pengeluaran
        </h1>
        <p className="text-xs text-slate-500">
          Daftar & riwayat transaksi uang keluar Anda.
        </p>
      </div>

      {/* Summary Card */}
      <div className="rounded-2xl bg-rose-600 p-4 text-white shadow-lg shadow-rose-600/20">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-rose-100">
            Total Pengeluaran
          </span>
          <div className="rounded-full bg-rose-500/30 p-1.5">
            <ArrowDownLeft className="h-4 w-4 text-white" />
          </div>
        </div>
        <p className="mt-1 text-2xl font-extrabold tracking-tight">
          {formatRupiah(totalPengeluaran) || "Rp0"}
        </p>
      </div>

      {/* Data Table Area */}
      <div className="space-y-3">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari transaksi pengeluaran..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 py-2 text-xs focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
          />
        </div>

        {/* List Transaksi Card Grid */}
        <div className="flex items-center justify-between pt-1">
          <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Riwayat Transaksi
          </h2>
          <span className="text-[11px] font-semibold text-slate-400">
            {filteredTransactions.length} Data
          </span>
        </div>

        {loadingData ? (
          <div className="flex py-12 justify-center items-center gap-2 text-xs text-slate-400">
            <Loader2 className="h-4 w-4 animate-spin text-rose-600" />
            <span>Memuat data...</span>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center bg-white shadow-sm">
            <p className="text-xs text-slate-400">
              {search
                ? "Tidak ada transaksi yang cocok."
                : "Belum ada data pengeluaran."}
            </p>
          </div>
        ) : (
          <div className="grid gap-2.5">
            {filteredTransactions.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-3.5 shadow-sm transition-all hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                    <ArrowDownLeft className="h-5 w-5" />
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

                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-extrabold text-rose-600">
                    -{formatRupiah(item.amount)}
                  </span>
                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={deletingId === item.id}
                    className="rounded-lg p-1.5 text-slate-300 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                  >
                    {deletingId === item.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-rose-600" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Fixed Floating Action Button (+) */}
      <button
        onClick={() => {
          setMessage(null);
          setIsModalOpen(true);
        }}
        className="fixed bottom-20 right-4 sm:right-[calc(50%-13rem)] z-40 flex h-12 w-12 items-center justify-center rounded-full bg-rose-600 text-white shadow-xl shadow-rose-600/40 hover:bg-rose-700 active:scale-95 transition-all"
        aria-label="Tambah Pengeluaran"
      >
        <Plus className="h-6 w-6 stroke-[2.5]" />
      </button>

      {/* Modal Dialog Form Input Pengeluaran */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Tambah Pengeluaran Baru"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {message && (
            <div className="rounded-lg p-3 text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
              {message.text}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">
              Tanggal
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">
              Keterangan Pengeluaran
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Belanja Bulanan, Tagihan Listrik, Bensin"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">
              Nominal (Rp)
            </label>
            <input
              type="text"
              required
              placeholder="Rp0"
              value={amountDisplay}
              onChange={handleAmountChange}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold text-rose-600 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-600 py-2.5 text-xs font-semibold text-white transition-all hover:bg-rose-700 active:scale-[0.98] disabled:opacity-50 mt-2"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <span>Simpan Pengeluaran</span>
            )}
          </button>
        </form>
      </Modal>
    </div>
  );
}
