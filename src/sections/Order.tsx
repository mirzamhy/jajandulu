import { KONTAK, PESAN_ORDER, waLink } from '../data/kontak'

function IkonWa() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.5 0-3-.4-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.7.3-.2.3-.9.9-.9 2.2s.9 2.5 1 2.7c.1.2 1.8 2.8 4.4 3.9 1.6.7 2.3.8 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z"
      />
    </svg>
  )
}

function IkonIg() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function IkonTiktok() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path
        fill="currentColor"
        d="M16.6 3h-3.1v12.1a2.8 2.8 0 1 1-2-2.7V9.3a5.9 5.9 0 1 0 5.1 5.8V9a7.4 7.4 0 0 0 4.4 1.4V7.3a4.4 4.4 0 0 1-4.4-4.3Z"
      />
    </svg>
  )
}

export const LABEL_ORDER = 'Pre-order via WA'

export function Order() {
  return (
    <section id="order" className="order" aria-labelledby="order-judul">
      <div className="wrap order-grid">
        <div className="order-ajakan" data-reveal>
          <h2 id="order-judul">Jajan dulu, yuk.</h2>
          <p>
            Kirim jumlah kantong yang kamu mau. Kami balas dengan total harga dan jadwal pre-order. Ambil langsung di
            kampus atau saat bazar, atau minta dikirim.
          </p>
          <a className="tombol-wa" href={waLink()} target="_blank" rel="noreferrer">
            <IkonWa />
            {LABEL_ORDER}
          </a>
        </div>

        <figure className="chat" data-reveal>
          <div className="chat-gelembung">
            <p>{PESAN_ORDER}</p>
            <span className="chat-isi">2</span>
          </div>
          <figcaption>pesan ini sudah terisi otomatis, tinggal tulis jumlahnya</figcaption>
        </figure>
      </div>

      <footer className="footer">
        <div className="wrap footer-isi">
          <p className="footer-logo">Jajan Dulu!</p>
          <ul className="footer-sosial">
            <li>
              <a href={KONTAK.instagram} target="_blank" rel="noreferrer">
                <IkonIg />
                <span>{KONTAK.handleInstagram}</span>
              </a>
            </li>
            <li>
              <a href={KONTAK.tiktok} target="_blank" rel="noreferrer">
                <IkonTiktok />
                <span>{KONTAK.handleTiktok}</span>
              </a>
            </li>
          </ul>
          <p className="footer-kecil">Proyek Kewirausahaan 2026. Collect it. Taste the story.</p>
        </div>
      </footer>
    </section>
  )
}
