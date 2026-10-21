export type VarianId = 'klepon' | 'onde-onde' | 'kue-lapis' | 'kue-lumpur' | 'serabi'

export type Varian = {
  id: VarianId
  nama: string
  /** Warna latar modal dan aksen kartu. */
  warna: string
  /** Warna teks yang terbaca di atas `warna`. */
  tinta: string
  asal: string
  cerita: string
  bahan: string[]
  langkah: string[]
}

// Resep rumahan umum. Wajib dicek tim sebelum web dipublikasikan.
export const VARIAN: Varian[] = [
  {
    id: 'klepon',
    nama: 'Klepon',
    warna: '#DCEBC8',
    tinta: '#2F4F1F',
    asal: 'Jawa',
    cerita:
      'Bola ketan hijau pandan yang meletus manis di mulut karena isian gula merah cairnya. Klepon biasa dijual di pasar pagi, dibungkus daun pisang dan ditaburi kelapa parut.',
    bahan: [
      '250 g tepung ketan',
      '200 ml air perasan daun suji dan pandan',
      '1/4 sdt garam',
      '100 g gula merah, potong kecil',
      '1/2 butir kelapa setengah tua, parut',
      '2 lembar daun pandan',
    ],
    langkah: [
      'Kukus kelapa parut dengan sejumput garam dan daun pandan selama 10 menit. Sisihkan.',
      'Campur tepung ketan dan garam, tuang air suji sedikit demi sedikit sambil diuleni sampai kalis dan bisa dipulung.',
      'Ambil adonan seukuran kelereng, pipihkan, isi potongan gula merah, lalu bulatkan rapat.',
      'Rebus dalam air mendidih. Angkat setelah klepon mengapung, tunggu sekitar 1 menit.',
      'Tiriskan dan gulingkan di atas kelapa parut kukus.',
    ],
  },
  {
    id: 'onde-onde',
    nama: 'Onde-onde',
    warna: '#F7E0B5',
    tinta: '#6B3F0E',
    asal: 'Mojokerto, Jawa Timur',
    cerita:
      'Bola ketan goreng berbalut wijen dengan isian kacang hijau. Banyak yang menyebut asalnya dari kue ketan Tionghoa, dan kini onde-onde identik dengan Mojokerto yang dijuluki Kota Onde-onde.',
    bahan: [
      '250 g tepung ketan',
      '50 g gula pasir',
      '1 buah kentang kukus, haluskan',
      '150 ml air hangat',
      '150 g kacang hijau kupas, rendam semalam',
      '75 g gula pasir untuk isian',
      '100 g wijen putih',
      'Minyak untuk menggoreng',
    ],
    langkah: [
      'Kukus kacang hijau sampai empuk, haluskan, lalu masak dengan gula dan sejumput garam sampai bisa dipulung. Bentuk bulatan kecil.',
      'Campur tepung ketan, gula, dan kentang halus. Tuang air hangat sedikit demi sedikit sambil diuleni sampai kalis.',
      'Ambil adonan, pipihkan, isi bulatan kacang hijau, lalu bulatkan.',
      'Celupkan sebentar ke air, lalu gulingkan di atas wijen sambil ditekan pelan supaya menempel.',
      'Goreng dalam minyak yang belum terlalu panas dengan api kecil sampai mengembang dan kuning keemasan.',
    ],
  },
  {
    id: 'kue-lapis',
    nama: 'Kue Lapis',
    warna: '#F8D3DD',
    tinta: '#7A2240',
    asal: 'Nusantara',
    cerita:
      'Kue kukus kenyal yang dibuat lapis demi lapis. Serunya ada di cara makannya: dikupas satu lapis demi satu lapis, warna demi warna.',
    bahan: [
      '200 g tepung beras',
      '50 g tepung tapioka',
      '200 g gula pasir',
      '600 ml santan sedang',
      '1/2 sdt garam',
      '2 lembar daun pandan',
      'Pewarna makanan merah muda dan hijau',
    ],
    langkah: [
      'Rebus santan, gula, garam, dan daun pandan sampai gula larut. Dinginkan sampai hangat.',
      'Campur tepung beras dan tapioka, lalu tuang santan sedikit demi sedikit sambil diaduk sampai licin. Saring.',
      'Bagi adonan menjadi tiga. Beri pewarna merah muda dan hijau, sisakan satu putih.',
      'Olesi loyang dengan minyak dan panaskan di kukusan. Tuang satu lapis adonan, kukus 5 menit.',
      'Ulangi lapis demi lapis dengan warna bergantian sampai adonan habis. Kukus lapisan terakhir 20 menit.',
      'Dinginkan sepenuhnya sebelum dipotong supaya lapisannya rapi.',
    ],
  },
  {
    id: 'kue-lumpur',
    nama: 'Kue Lumpur',
    warna: '#FBEAB4',
    tinta: '#6A4A0C',
    asal: 'Nusantara',
    cerita:
      'Kue lembut berbahan kentang dan santan, dipanggang di cetakan bulat dengan satu kismis di tengahnya. Banyak yang menduga kue ini terinspirasi kue custard Portugis, lalu disesuaikan dengan bahan lokal.',
    bahan: [
      '250 g kentang kukus, haluskan',
      '150 g tepung terigu',
      '150 g gula pasir',
      '3 butir telur',
      '400 ml santan',
      '50 g margarin, lelehkan',
      '1/4 sdt garam',
      'Kismis secukupnya',
    ],
    langkah: [
      'Kocok telur dan gula sampai gula larut.',
      'Masukkan kentang halus, aduk rata, lalu tambahkan terigu dan santan bergantian sampai licin.',
      'Tambahkan garam dan margarin leleh. Aduk rata.',
      'Panaskan cetakan kue lumpur, olesi margarin, lalu tuang adonan hingga hampir penuh.',
      'Tutup dan panggang dengan api kecil. Saat setengah matang, letakkan satu kismis di tengah.',
      'Angkat setelah permukaan matang dan pinggirannya kecokelatan.',
    ],
  },
  {
    id: 'serabi',
    nama: 'Serabi',
    warna: '#F3E6D6',
    tinta: '#5C3A1C',
    asal: 'Bandung dan Solo',
    cerita:
      'Kue mirip pancake yang punya dua gaya terkenal. Serabi Solo dari tepung beras dan santan, tipis dengan pinggiran renyah. Serabi Bandung lebih tebal, dimasak di tungku tanah liat, dan dimakan dengan kinca gula merah.',
    bahan: [
      '200 g tepung beras',
      '1 sdm tepung terigu',
      '1/2 sdt ragi instan',
      '1 sdt gula pasir',
      '400 ml santan hangat',
      '1/2 sdt garam',
      '1/4 sdt soda kue',
      'Pasta pandan secukupnya',
    ],
    langkah: [
      'Campur tepung beras, terigu, ragi, gula, dan garam. Tuang santan hangat sedikit demi sedikit sambil diaduk sampai licin.',
      'Diamkan adonan tertutup sekitar 45 menit sampai berbuih.',
      'Tambahkan soda kue. Ambil sedikit adonan dan beri pasta pandan untuk aksen hijau.',
      'Panaskan wajan kecil antilengket. Tuang adonan putih, lalu teteskan sedikit adonan hijau di tengah.',
      'Tutup dan masak dengan api kecil sampai permukaan berlubang-lubang dan matang.',
    ],
  },
]

export const SECRET = {
  nama: 'Secret',
  pesan:
    'Satu karakter di seri ini sengaja tidak kami tunjukkan. Ia hanya bisa ditemukan di dalam kantong. Kalau kamu dapat, jangan bocorkan dulu.',
}

export function cariVarian(id: string): Varian | undefined {
  return VARIAN.find((v) => v.id === id)
}
