// Ganti nilai placeholder di bawah dengan data asli tim sebelum web dipublikasikan.
export const KONTAK = {
  /** Format internasional tanpa tanda plus, contoh 6281234567890. */
  wa: '62XXXXXXXXXX',
  instagram: 'https://instagram.com/USERNAME_INSTAGRAM',
  tiktok: 'https://tiktok.com/@USERNAME_TIKTOK',
  handleInstagram: '@USERNAME_INSTAGRAM',
  handleTiktok: '@USERNAME_TIKTOK',
}

export type Anggota = {
  nama: string
  peran: string
}

export const ANGGOTA: Anggota[] = [
  { nama: 'NAMA ANGGOTA 1', peran: 'PERAN ANGGOTA 1' },
  { nama: 'NAMA ANGGOTA 2', peran: 'PERAN ANGGOTA 2' },
  { nama: 'NAMA ANGGOTA 3', peran: 'PERAN ANGGOTA 3' },
  { nama: 'NAMA ANGGOTA 4', peran: 'PERAN ANGGOTA 4' },
]

export const HARGA = 40000

export const PESAN_ORDER =
  'Halo Jajan Dulu!, aku mau pre-order blind bag. Jumlah kantong: '

export function waLink(pesan: string = PESAN_ORDER): string {
  return `https://wa.me/${KONTAK.wa}?text=${encodeURIComponent(pesan)}`
}

export function rupiah(n: number): string {
  return 'Rp' + n.toLocaleString('id-ID')
}
