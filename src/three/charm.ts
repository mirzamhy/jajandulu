import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import type { CharmId } from '../svg/bodies'
import { teksturFlanel, teksturLapis, teksturTanya } from './tekstur'
import { buatCharmRajut } from './charmRajut'

const HITAM = new THREE.Color('#120C0A')
const HITAM_RING = new THREE.Color('#3A2C26')

export type MatWarna = { m: THREE.MeshPhysicalMaterial | THREE.MeshStandardMaterial; warna: THREE.Color; gelap: THREE.Color; sheen: number }

export type Charm3 = {
  grup: THREE.Group
  /** 0 = siluet hitam, 1 = warna asli. */
  setWarna: (t: number) => void
}

export function acak(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return s / 2147483647
  }
}

function flanel(warna: string, daftar: MatWarna[], opsi: Partial<THREE.MeshPhysicalMaterialParameters> = {}) {
  const felt = teksturFlanel()
  const m = new THREE.MeshPhysicalMaterial({
    color: warna,
    map: felt,
    bumpMap: felt,
    bumpScale: 1.2,
    roughness: 1,
    sheen: 1,
    sheenRoughness: 0.6,
    sheenColor: new THREE.Color(warna).lerp(new THREE.Color('#ffffff'), 0.5),
    ...opsi,
  })
  daftar.push({ m, warna: new THREE.Color(warna), gelap: HITAM, sheen: 1 })
  return m
}

/** Logam bercat mengilap untuk ring pegas. Butuh scene.environment supaya kilapnya terlihat. */
function logam(warna: string, daftar: MatWarna[], kasar = 0.22, metal = 0.25) {
  const m = new THREE.MeshStandardMaterial({ color: warna, roughness: kasar, metalness: metal })
  daftar.push({ m, warna: new THREE.Color(warna), gelap: HITAM_RING, sheen: 0 })
  return m
}

export const R_RING = 0.2
export const TABUNG = 0.045

/**
 * Ring pegas (spring gate ring) bercat sesuai warna varian: sambungan gate di kanan atas,
 * dan bagian engsel yang sedikit lebih tebal dengan paku keling di kiri.
 */
export function buatRing(daftar: MatWarna[], warna: string) {
  const g = new THREE.Group()
  const krom = logam(warna, daftar)
  const gelap = '#' + new THREE.Color(warna).multiplyScalar(0.55).getHexString()
  g.add(new THREE.Mesh(new THREE.TorusGeometry(R_RING, TABUNG, 24, 96), krom))

  // Selubung engsel: busur pendek yang sedikit lebih tebal.
  const awal = THREE.MathUtils.degToRad(168)
  const busur = THREE.MathUtils.degToRad(42)
  const selubung = new THREE.Mesh(new THREE.TorusGeometry(R_RING, TABUNG * 1.18, 24, 24, busur), krom)
  selubung.rotation.z = awal
  g.add(selubung)

  // Paku keling engsel, menonjol di sisi depan dan belakang.
  const sudutPaku = THREE.MathUtils.degToRad(186)
  const paku = new THREE.Mesh(new THREE.CylinderGeometry(0.019, 0.019, TABUNG * 2.7, 20), logam('#c9cad0', daftar, 0.25, 1))
  paku.rotation.x = Math.PI / 2
  paku.position.set(Math.cos(sudutPaku) * R_RING, Math.sin(sudutPaku) * R_RING, 0)
  g.add(paku)

  // Celah gate: irisan tipis gelap yang memotong tabung.
  const celah = (sudut: number) => {
    const s = THREE.MathUtils.degToRad(sudut)
    const m = new THREE.Mesh(
      new THREE.CylinderGeometry(TABUNG * 1.04, TABUNG * 1.04, 0.006, 20),
      logam(gelap, daftar, 0.5),
    )
    m.position.set(Math.cos(s) * R_RING, Math.sin(s) * R_RING, 0)
    m.rotation.z = s
    return m
  }
  g.add(celah(62), celah(awal * (180 / Math.PI) + 42))
  return g
}

function ringDanTab(atasY: number, warna: string, daftar: MatWarna[]) {
  const g = new THREE.Group()
  const ring = buatRing(daftar, warna)
  ring.position.y = atasY + 0.38
  g.add(ring)
  // Pita webbing yang melingkar di bagian bawah ring.
  const tab = new THREE.Mesh(new RoundedBoxGeometry(0.16, 0.26, 0.06, 2, 0.02), flanel(warna, daftar, { sheen: 0.4 }))
  tab.position.y = atasY + 0.1
  g.add(tab)
  return g
}

/** Bola yang tidak sempurna, seperti adonan yang dibulatkan tangan. */
function bolaTakRata(skala: THREE.Vector3, seed: number, amp: number) {
  const geo = new THREE.SphereGeometry(1, 72, 48)
  const pos = geo.attributes.position
  const r = acak(seed)
  const f = [1 + r() * 2, 2 + r() * 2, 3 + r() * 3]
  const fase = [r() * 6, r() * 6, r() * 6]
  const v = new THREE.Vector3()
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i)
    const d =
      1 +
      amp * Math.sin(v.x * f[0] + fase[0]) * Math.cos(v.y * f[1] + fase[1]) +
      amp * 0.6 * Math.sin(v.z * f[2] + fase[2] + v.y * 2)
    v.multiplyScalar(d).multiply(skala)
    pos.setXYZ(i, v.x, v.y, v.z)
  }
  geo.computeVertexNormals()
  return geo
}

/**
 * Taburan padat di permukaan bola (titik Fibonacci yang digeser acak, jadi merata tanpa gumpalan aneh).
 * `peluang` mengatur kerapatan per arah normal, `tegak` seberapa jauh butir boleh mencuat dari permukaan,
 * `warna` memberi variasi warna per butir.
 */
function taburanPadat(opsi: {
  geo: THREE.BufferGeometry
  mat: THREE.Material
  jumlah: number
  skala: THREE.Vector3
  ukuran: THREE.Vector3
  seed: number
  peluang?: (n: THREE.Vector3) => number
  tegak?: number
  angkat?: number
  /** jarak minimum butir dari permukaan bola dasar, untuk mengimbangi badan yang tidak rata */
  dasar?: number
  warna?: string[]
}) {
  const { geo, mat, jumlah, skala, ukuran, seed, peluang = () => 1, tegak = 0, angkat = 0, dasar = 0, warna } = opsi
  const mesh = new THREE.InstancedMesh(geo, mat, jumlah)
  const r = acak(seed)
  const atas = new THREE.Vector3(0, 1, 0)
  const q = new THREE.Quaternion()
  const putar = new THREE.Quaternion()
  const miring = new THREE.Quaternion()
  const m4 = new THREE.Matrix4()
  const c = new THREE.Color()
  const emas = Math.PI * (3 - Math.sqrt(5))
  let i = 0
  // Semua titik kandidat disebar ke seluruh bola dulu, baru disaring dengan `peluang`. Kalau kuota dipakai
  // sambil berjalan dari atas, butir habis sebelum sampai ke bagian bawah.
  for (let k = 0; k < jumlah; k++) {
    // Titik ke-k dari titik Fibonacci, digeser sedikit supaya tidak tampak berpola.
    const y = 1 - ((k + 0.5) / jumlah) * 2
    const rad = Math.sqrt(1 - y * y)
    const a = k * emas + (r() - 0.5) * 0.9
    const n = new THREE.Vector3(Math.cos(a) * rad, y + (r() - 0.5) * 0.04, Math.sin(a) * rad).normalize()
    if (r() > peluang(n)) continue
    const p = n.clone().multiply(skala)
    // Normal pada elipsoid, supaya butir rebah mengikuti permukaan yang dipipihkan.
    const normal = new THREE.Vector3(n.x / skala.x, n.y / skala.y, n.z / skala.z).normalize()
    // Dorong keluar sedikit lebih dari tebal butir: permukaan badan bergelombang sampai beberapa persen.
    p.addScaledVector(normal, ukuran.y * 0.4 + dasar + r() * angkat)
    q.setFromUnitVectors(atas, normal)
    putar.setFromAxisAngle(atas, r() * Math.PI * 2)
    miring.setFromAxisAngle(new THREE.Vector3(1, 0, 0), (r() - 0.5) * 2 * tegak)
    q.multiply(putar).multiply(miring)
    m4.compose(p, q, ukuran.clone().multiply(new THREE.Vector3(0.7 + r() * 0.6, 0.8 + r() * 0.4, 0.8 + r() * 0.4)))
    mesh.setMatrixAt(i, m4)
    if (warna) mesh.setColorAt(i, c.set(warna[Math.floor(r() * warna.length)]))
    i++
  }
  mesh.count = i
  mesh.instanceMatrix.needsUpdate = true
  if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  mesh.castShadow = true
  return mesh
}

function klepon(daftar: MatWarna[]) {
  const g = new THREE.Group()
  const skala = new THREE.Vector3(0.5, 0.47, 0.48)
  // Badan dari flanel hijau pandan, diisi dakron sehingga sedikit tidak bulat sempurna.
  const badan = new THREE.Mesh(bolaTakRata(skala, 4, 0.03), flanel('#74B33E', daftar, { bumpScale: 1.8 }))
  g.add(badan)
  // "Kelapa parut" dari potongan flanel putih yang lebar (desain awal), menumpuk di setengah atas.
  const kelapa = flanel('#FBF8F0', daftar, { sheenColor: new THREE.Color('#ffffff') })
  g.add(
    taburanPadat({
      geo: new RoundedBoxGeometry(1, 1, 1, 2, 0.3),
      mat: kelapa,
      jumlah: 260,
      skala,
      ukuran: new THREE.Vector3(0.13, 0.026, 0.036),
      seed: 11,
      peluang: (n) => (n.y > 0.08 ? 1 : n.y > -0.2 ? 0.35 : 0.05),
      tegak: 0.2,
      dasar: 0.014,
    }),
  )
  g.add(ringDanTab(0.48, '#5E8A3C', daftar))
  return g
}

function ondeOnde(daftar: MatWarna[]) {
  const g = new THREE.Group()
  const skala = new THREE.Vector3(0.5, 0.49, 0.49)
  // Badan dari flanel keemasan.
  const badan = new THREE.Mesh(bolaTakRata(skala, 9, 0.02), flanel('#D2923F', daftar, { bumpScale: 1.6 }))
  g.add(badan)
  // Wijen dari butir flanel krem yang besar dan lonjong (desain awal), tersebar merata.
  g.add(
    taburanPadat({
      geo: new THREE.SphereGeometry(1, 14, 8),
      mat: flanel('#FBF0D8', daftar, { sheen: 0.4 }),
      jumlah: 190,
      skala,
      ukuran: new THREE.Vector3(0.042, 0.014, 0.019),
      seed: 5,
      tegak: 0.1,
      dasar: 0.012,
    }),
  )
  g.add(ringDanTab(0.49, '#D8A82A', daftar))
  return g
}

function lapis(daftar: MatWarna[]) {
  const g = new THREE.Group()
  const m = flanel('#ffffff', daftar, { map: teksturLapis(), sheenColor: new THREE.Color('#ffe9f1'), bumpScale: 1.7 })
  const badan = new THREE.Mesh(new RoundedBoxGeometry(0.96, 0.98, 0.32, 5, 0.1), m)
  g.add(badan)
  g.add(ringDanTab(0.49, '#EC7FA6', daftar))
  return g
}

function lumpur(daftar: MatWarna[]) {
  const g = new THREE.Group()
  const profil = [
    [0, 0.12],
    [0.47, 0.12],
    [0.53, 0.105],
    [0.565, 0.05],
    [0.565, -0.05],
    [0.53, -0.105],
    [0.47, -0.12],
    [0, -0.12],
  ].map(([x, y]) => new THREE.Vector2(x, y))
  // DoubleSide: urutan titik profil membuat sebagian normal lathe menghadap ke dalam.
  const puck = new THREE.Mesh(new THREE.LatheGeometry(profil, 64), flanel('#9A5A2E', daftar, { side: THREE.DoubleSide, bumpScale: 1.7 }))
  puck.rotation.x = Math.PI / 2
  g.add(puck)
  const isi = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.46, 0.04, 64), flanel('#F4CB52', daftar))
  isi.rotation.x = Math.PI / 2
  isi.position.z = 0.11
  g.add(isi)
  const kismis = new THREE.Mesh(
    new THREE.SphereGeometry(1, 24, 16),
    new THREE.MeshStandardMaterial({ color: '#4A2414', roughness: 0.55 }),
  )
  daftar.push({ m: kismis.material, warna: new THREE.Color('#4A2414'), gelap: HITAM, sheen: 0 })
  kismis.scale.set(0.1, 0.07, 0.05)
  kismis.position.z = 0.14
  kismis.rotation.z = -0.15
  g.add(kismis)
  g.add(ringDanTab(0.56, '#9A5A2E', daftar))
  return g
}

function serabi(daftar: MatWarna[]) {
  const g = new THREE.Group()
  const profil = [
    [0, -0.12],
    [0.4, -0.12],
    [0.5, -0.07],
    [0.58, 0.05],
    [0.62, 0.14],
    [0.6, 0.16],
  ].map(([x, y]) => new THREE.Vector2(x, y))
  const geoCup = new THREE.LatheGeometry(profil, 120)
  // Pinggiran cup bergelombang seperti flanel yang dilipat.
  const pos = geoCup.attributes.position
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    const y = pos.getY(i)
    const z = pos.getZ(i)
    const a = Math.atan2(z, x)
    const naik = THREE.MathUtils.clamp((y + 0.05) / 0.21, 0, 1)
    const k = 1 + naik * (0.07 * Math.sin(a * 7) + 0.035 * Math.sin(a * 3 + 1))
    pos.setXYZ(i, x * k, y + naik * 0.03 * Math.sin(a * 7 + 0.6), z * k)
  }
  geoCup.computeVertexNormals()
  const cup = new THREE.Mesh(geoCup, flanel('#D7792B', daftar, { side: THREE.DoubleSide, bumpScale: 1.7 }))
  cup.rotation.x = Math.PI / 2
  g.add(cup)
  const kubah = new THREE.Mesh(new THREE.SphereGeometry(0.46, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2), flanel('#FBFAF6', daftar))
  kubah.scale.y = 0.55
  kubah.rotation.x = Math.PI / 2
  kubah.position.z = -0.02
  g.add(kubah)
  const hijau = flanel('#4E9A3E', daftar, { sheen: 0.5 })
  ;[-1, 1].forEach((s) => {
    const kaki = new THREE.Mesh(new RoundedBoxGeometry(0.2, 0.07, 0.05, 2, 0.02), hijau)
    kaki.position.set(s * 0.065, -0.02, 0.255)
    kaki.rotation.z = -s * 0.75
    g.add(kaki)
  })
  g.add(ringDanTab(0.6, '#5E8A3C', daftar))
  return g
}

function rahasia(daftar: MatWarna[]) {
  const g = new THREE.Group()
  const tanya = teksturTanya()
  const m = new THREE.MeshPhysicalMaterial({
    color: '#120C0A',
    roughness: 0.85,
    sheen: 0.6,
    sheenColor: new THREE.Color('#5a4a40'),
    emissive: new THREE.Color('#F6D77A'),
    emissiveMap: tanya,
    emissiveIntensity: 1,
  })
  const badan = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 40), m)
  badan.scale.set(0.5, 0.49, 0.45)
  g.add(badan)
  // Ring gelap (gunmetal) supaya karakter rahasia tetap misterius.
  const ring = buatRing(daftar, '#3A2C26')
  ring.position.y = 0.87
  g.add(ring)
  const tab = new THREE.Mesh(
    new RoundedBoxGeometry(0.16, 0.26, 0.06, 2, 0.02),
    new THREE.MeshStandardMaterial({ color: '#2A201C', roughness: 0.9 }),
  )
  tab.position.y = 0.59
  g.add(tab)
  return g
}

const PEMBUAT: Record<CharmId, (d: MatWarna[]) => THREE.Group> = {
  klepon,
  'onde-onde': ondeOnde,
  'kue-lapis': lapis,
  'kue-lumpur': lumpur,
  serabi,
  secret: rahasia,
}

/**
 * Model charm 3D. Titik asal grup ada di tengah tinggi total (badan + ring),
 * badan menghadap +Z, tinggi total sekitar 1.2 unit.
 */
export function buatCharm(id: CharmId): Charm3 {
  const daftar: MatWarna[] = []
  // lima varian memakai model rajut/flanel dari lembar desain v2; karakter rahasia tetap model lama
  const isi = id === 'secret' ? PEMBUAT[id](daftar) : buatCharmRajut(id, { daftar })
  isi.position.y = -0.32
  isi.traverse((o) => {
    if ((o as THREE.Mesh).isMesh) {
      o.castShadow = true
    }
  })
  const grup = new THREE.Group()
  grup.add(isi)

  const setWarna = (t: number) => {
    for (const d of daftar) {
      d.m.color.copy(d.gelap).lerp(d.warna, t)
      if ('sheen' in d.m && d.sheen > 0) d.m.sheen = d.sheen * t
    }
  }
  setWarna(1)
  return { grup, setWarna }
}
