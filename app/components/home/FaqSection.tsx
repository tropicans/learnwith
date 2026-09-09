import { IconChevronDown } from './Icons'

interface FaqItem {
  question: string
  answer: string
}

const FAQ_DATA: FaqItem[] = [
  {
    question: 'Apakah peserta perlu memiliki latar belakang pemrograman untuk mengikuti workshop AI?',
    answer:
      'Tidak. Modul disusun dengan pendekatan praktikum langkah-demi-langkah. Seluruh perintah terminal telah disediakan dengan tombol 1-klik salin dan didampingi skrip verifikasi otomatis untuk memastikan konfigurasi Anda tepat.',
  },
  {
    question: 'Apa saja spesifikasi perangkat dan sistem operasi yang dibutuhkan?',
    answer:
      'Komputer dengan sistem operasi Windows 10 atau 11 (64-bit), memori RAM minimal 4 GB, hak akses Administrator lokal untuk menjalankan PowerShell, koneksi internet stabil untuk pengunduhan dependensi, serta Microsoft Word 2016 atau yang lebih baru untuk modul dokumen kedinasan.',
  },
  {
    question: 'Mengapa jalur Pengolahan Kata Tingkat Lanjut membutuhkan kode sandi?',
    answer:
      'Jalur ini dirancang khusus untuk program standardisasi dokumen kedinasan ASN yang memuat evaluasi berstandar BPSDM dan penerbitan bukti kelulusan formal. Kode sandi akses diberikan langsung oleh penyelenggara pelatihan saat sesi dibuka.',
  },
  {
    question: 'Bagaimana cara kerja verifikasi checkpoint otomatis?',
    answer:
      'Pada setiap tahapan kunci (seperti pengaktifan proxy 9Router port 20128 atau integrasi token bot), peserta menjalankan skrip checkpoint di terminal. Skrip memindai ketersediaan servis secara lokal dan mencatat status kelulusan langsung ke tampilan modul browser Anda.',
  },
  {
    question: 'Apakah kredensial atau token API saya disimpan di server LearnWith?',
    answer:
      'Tidak sama sekali. LearnWith mengusung prinsip privasi penuh: seluruh kredensial, token bot, dan progress pembelajaran Anda hanya tersimpan di memori browser dan komputer lokal Anda. Tidak ada data rahasia yang dikirimkan ke server eksternal.',
  },
]

export function FaqSection() {
  return (
    <section className="home-section faq-section" id="faq" aria-label="Pertanyaan yang Sering Diajukan">
      <div className="section-header text-center">
        <span className="section-eyebrow">INFORMASI &amp; KESIAPAN</span>
        <h2 className="section-title">Pertanyaan yang Sering Diajukan</h2>
        <p className="section-subtitle">
          Hal-hal mendasar seputar spesifikasi teknis, mekanisme verifikasi, dan privasi data di LearnWith.
        </p>
      </div>

      <div className="faq-container">
        {FAQ_DATA.map((item, index) => (
          <details key={index} className="faq-item">
            <summary className="faq-summary">
              <span className="faq-question">{item.question}</span>
              <IconChevronDown className="faq-icon" width={18} height={18} />
            </summary>
            <div className="faq-answer">
              <p>{item.answer}</p>
            </div>
          </details>
        ))}
      </div>
    </section>
  )
}
