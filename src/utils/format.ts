// Mengubah angka murni (cth: 100000) menjadi format tampilan "Rp100.000"
export function formatRupiah(value: number | string): string {
  if (!value) return "";
  const numberValue =
    typeof value === "string"
      ? parseFloat(value.replace(/[^0-9]/g, ""))
      : value;
  if (isNaN(numberValue)) return "";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(numberValue)
    .replace("Rp", "Rp");
}

// Mengubah input terformat "Rp100.000" menjadi angka murni 100000
export function parseRupiahToNumber(value: string): number {
  const cleanString = value.replace(/[^0-9]/g, "");
  return cleanString ? parseInt(cleanString, 10) : 0;
}
