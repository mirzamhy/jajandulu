import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { buatCharm, type Charm3 } from './charm'
import { buatKantong, buatBayangan, buatSorot, KANTONG } from './kantong'
import type { CharmId } from '../svg/bodies'

export const URUTAN: CharmId[] = ['klepon', 'onde-onde', 'kue-lapis', 'kue-lumpur', 'serabi']

/** Nilai yang digerakkan timeline scroll. Render loop hanya membaca nilai ini. */
export type StatusAdegan = {
  buka: number
  cahaya: number
  kantongY: number
  kantongMiring: number
  charmY: number
  charmSkala: number
  charmPutar: number
  /** -1 = rahasia, 0-4 = indeks URUTAN. */
  tampil: number
  warna: number
}

const lingkunganCache = new WeakMap<THREE.WebGLRenderer, THREE.Texture>()

/** Lampu dan pantulan ruangan. Pantulan dibutuhkan supaya ring krom terlihat seperti logam. */
export function lampuStandar(scene: THREE.Scene, renderer: THREE.WebGLRenderer) {
  let env = lingkunganCache.get(renderer)
  if (!env) {
    const pmrem = new THREE.PMREMGenerator(renderer)
    env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    pmrem.dispose()
    lingkunganCache.set(renderer, env)
  }
  scene.environment = env
  scene.environmentIntensity = 0.45
  scene.add(new THREE.HemisphereLight('#fff1dc', '#3a2418', 0.9))
  const kunci = new THREE.DirectionalLight('#fff4e6', 2.2)
  kunci.position.set(-2.5, 4, 5)
  scene.add(kunci)
  const pinggir = new THREE.DirectionalLight('#ffcf94', 1.6)
  pinggir.position.set(3, 2.5, -4)
  scene.add(pinggir)
}

export function rendererStandar(canvas: HTMLCanvasElement, opsi: Partial<THREE.WebGLRendererParameters> = {}) {
  const r = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, ...opsi })
  r.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  r.toneMapping = THREE.ACESFilmicToneMapping
  r.toneMappingExposure = 1.05
  r.outputColorSpace = THREE.SRGBColorSpace
  return r
}

export function buatAdegan(canvas: HTMLCanvasElement) {
  const renderer = rendererStandar(canvas)
  const scene = new THREE.Scene()
  const kamera = new THREE.PerspectiveCamera(30, 1, 0.1, 60)
  lampuStandar(scene, renderer)

  const kantong = buatKantong()
  const wadahKantong = new THREE.Group()
  wadahKantong.add(kantong.grup)
  scene.add(wadahKantong)
  const sorot = buatSorot(6)
  scene.add(sorot)
  const bayangan = buatBayangan(2.6)
  scene.add(bayangan)

  const charms: Record<string, Charm3> = {}
  const pemutar = new THREE.Group()
  const wadahCharm = new THREE.Group()
  wadahCharm.add(pemutar)
  scene.add(wadahCharm)
  ;[...URUTAN, 'secret' as CharmId].forEach((id) => {
    const c = buatCharm(id)
    c.grup.visible = false
    charms[id] = c
    pemutar.add(c.grup)
  })

  const S: StatusAdegan = {
    buka: 0,
    cahaya: 0,
    kantongY: 0,
    kantongMiring: 0,
    charmY: 0.85,
    charmSkala: 0.82,
    charmPutar: 0,
    tampil: -1,
    warna: 0,
  }

  // Putaran idle kantong dan putaran tangan pengunjung.
  let idle = true
  let putarKantong = 0
  const tangan = { y: 0, x: 0, vy: 0, seret: false }

  const tujuan = new THREE.Vector3(0, 1.45, 0)
  const resize = () => {
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    if (!w || !h) return
    renderer.setSize(w, h, false)
    kamera.aspect = w / h
    // Di layar potret, mundurkan kamera supaya kantong tetap muat secara horizontal.
    const jarak = kamera.aspect < 0.85 ? 8.6 * (0.85 / kamera.aspect) * 0.86 : 8.6
    kamera.position.set(0, 1.45 + jarak * 0.2, jarak)
    kamera.lookAt(tujuan)
    kamera.updateProjectionMatrix()
  }

  // Pergantian charm: charm baru "meletup" dari kecil dengan sedikit memantul, jadi tidak terasa potong langsung.
  let aktifSebelum = ''
  let sejakGanti = 1
  const LAMA_LETUP = 0.6
  const letup = (t: number) => {
    if (t >= LAMA_LETUP) return 1
    const p = t / LAMA_LETUP - 1
    const s = 2.2
    // pergantian terjadi saat charm menghadap samping, jadi letupannya cukup halus
    return 0.88 + 0.12 * (1 + (s + 1) * p * p * p + s * p * p)
  }

  let terakhir = performance.now()
  const render = () => {
    const now = performance.now()
    const dt = Math.min((now - terakhir) / 1000, 0.05)
    terakhir = now

    if (idle) {
      putarKantong += dt * 0.55
    } else {
      const tujuanPutar = Math.round(putarKantong / (Math.PI * 2)) * Math.PI * 2
      putarKantong += (tujuanPutar - putarKantong) * Math.min(1, dt * 5)
    }
    wadahKantong.rotation.y = putarKantong
    wadahKantong.position.y = S.kantongY
    wadahKantong.rotation.z = S.kantongMiring
    kantong.setBuka(S.buka)
    kantong.setCahaya(S.cahaya)
    // Bayangan dan sorotan lantai memudar saat kantong jatuh.
    const sisa = THREE.MathUtils.clamp(1 + (S.kantongY + 0.25) * 0.8, 0, 1)
    ;(bayangan.material as THREE.MeshBasicMaterial).opacity = sisa
    ;(sorot.material as THREE.MeshBasicMaterial).opacity = sisa

    if (!tangan.seret) {
      tangan.y += tangan.vy * dt
      tangan.vy *= Math.pow(0.04, dt)
      tangan.x += (0 - tangan.x) * Math.min(1, dt * 4)
    }

    const idx = Math.round(S.tampil)
    const aktif = idx < 0 ? 'secret' : URUTAN[Math.min(idx, URUTAN.length - 1)]
    if (aktif !== aktifSebelum) {
      // tidak meletup saat halaman baru dibuka, hanya saat berganti karakter
      sejakGanti = aktifSebelum ? 0 : LAMA_LETUP
      aktifSebelum = aktif
    }
    sejakGanti += dt
    for (const [id, c] of Object.entries(charms)) c.grup.visible = id === aktif
    if (aktif !== 'secret') charms[aktif].setWarna(S.warna)

    wadahCharm.position.y = S.charmY
    wadahCharm.scale.setScalar(S.charmSkala)
    // Charm di dalam kantong ikut berputar bersama kantong selama idle.
    pemutar.rotation.y = S.charmPutar + tangan.y + (S.charmY < 1.2 ? putarKantong : 0)
    pemutar.rotation.x = tangan.x
    const k = letup(sejakGanti)
    pemutar.scale.set(k, k * (1 + 0.06 * Math.sin(Math.min(1, sejakGanti / LAMA_LETUP) * Math.PI)), k)

    renderer.render(scene, kamera)
  }

  // Geser horizontal memutar charm, scroll vertikal tetap jalan.
  let x0 = 0
  let y0 = 0
  let t0 = 0
  const turun = (e: PointerEvent) => {
    tangan.seret = true
    x0 = e.clientX
    y0 = e.clientY
    t0 = performance.now()
    tangan.vy = 0
    canvas.setPointerCapture(e.pointerId)
  }
  const gerak = (e: PointerEvent) => {
    if (!tangan.seret) return
    const dx = e.clientX - x0
    const dy = e.clientY - y0
    const now = performance.now()
    const dtl = Math.max((now - t0) / 1000, 0.008)
    tangan.y += dx * 0.012
    tangan.x = THREE.MathUtils.clamp(tangan.x + dy * 0.006, -0.6, 0.6)
    tangan.vy = tangan.vy * 0.5 + ((dx * 0.012) / dtl) * 0.5
    x0 = e.clientX
    y0 = e.clientY
    t0 = now
  }
  const naik = () => {
    tangan.seret = false
  }
  canvas.addEventListener('pointerdown', turun)
  canvas.addEventListener('pointermove', gerak)
  canvas.addEventListener('pointerup', naik)
  canvas.addEventListener('pointercancel', naik)

  const ro = new ResizeObserver(resize)
  ro.observe(canvas)
  resize()

  // Siapkan semua charm di depan: shader dikompilasi dan geometri dikirim ke GPU sekarang, bukan saat charm
  // pertama kali muncul (itu yang membuat pergantian karakter tersendat).
  Object.values(charms).forEach((c) => (c.grup.visible = true))
  renderer.compile(scene, kamera)
  renderer.render(scene, kamera)
  Object.values(charms).forEach((c) => (c.grup.visible = false))

  return {
    S,
    render,
    setIdle: (v: boolean) => {
      idle = v
    },
    dispose: () => {
      ro.disconnect()
      canvas.removeEventListener('pointerdown', turun)
      canvas.removeEventListener('pointermove', gerak)
      canvas.removeEventListener('pointerup', naik)
      canvas.removeEventListener('pointercancel', naik)
      scene.traverse((o) => {
        const m = o as THREE.Mesh
        if (m.isMesh) {
          m.geometry.dispose()
          const mats = Array.isArray(m.material) ? m.material : [m.material]
          mats.forEach((x) => x.dispose())
        }
      })
      renderer.dispose()
    },
    KANTONG,
  }
}

export type Adegan = ReturnType<typeof buatAdegan>
