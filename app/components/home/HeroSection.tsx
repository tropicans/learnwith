import { ShowcaseFrame } from './ShowcaseFrame'
import { IconSparkles, IconArrowRight, IconCheckCircle, IconActivity, IconFileText, IconLayers } from './Icons'

export function HeroSection() {
  return (
    <section className="home-hero-container" id="hero" aria-label="Pengenalan Platform LearnWith">
      <div className="home-hero-grid">
        {/* Column 1–7: Narrative Authority */}
        <div className="home-hero-narrative">
          <div className="home-context-pill">
            <IconSparkles className="context-pill-icon" width={15} height={15} />
            <span>Platform Praktik Terstandar</span>
          </div>

          <h1 className="home-hero-headline">
            Bukan Sekadar Membaca Teori. <br />
            <span className="text-accent">Buktikan Kompetensi Praktik Nyata.</span>
          </h1>

          <p className="home-hero-lead">
            LearnWith adalah command center pelatihan interaktif yang menjembatani materi teknis dengan eksekusi kerja nyata. Dari otomasi model AI di terminal hingga standardisasi dokumen dinas, setiap keterampilan divalidasi melalui checkpoint terukur.
          </p>

          <div className="home-hero-cta-group">
            <a href="#pilihan-modul" className="btn btn-primary btn-hero-primary" id="btn-hero-explore-tracks">
              <IconLayers width={18} height={18} />
              <span>Pilih Jalur Belajar</span>
              <IconArrowRight width={16} height={16} />
            </a>

            <a href="#standar" className="btn btn-secondary btn-hero-secondary" id="btn-hero-view-standards">
              <span>Pelajari Standar &amp; Metode</span>
            </a>
          </div>

          <div className="home-hero-capability-tags" aria-label="Fitur Unggulan Platform">
            <span className="capability-tag">
              <IconCheckCircle width={14} height={14} /> Checkpoint Otomatis
            </span>
            <span className="capability-tag">
              <IconActivity width={14} height={14} /> Dual-Mode Workspace
            </span>
            <span className="capability-tag">
              <IconFileText width={14} height={14} /> Standardisasi Pergub 14/2020
            </span>
          </div>
        </div>

        {/* Column 8–12: Experience Showcase Frame */}
        <div className="home-hero-showcase">
          <ShowcaseFrame />
        </div>
      </div>
    </section>
  )
}
