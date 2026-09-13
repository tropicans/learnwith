import { useState } from 'react'
import { ShowcaseFrame } from './ShowcaseFrame'
import { IconSparkles, IconArrowRight, IconCheckCircle, IconActivity, IconFileText, IconLayers, IconTerminal } from './Icons'

export function HeroSection() {
  const [activeVariation, setActiveVariation] = useState('Dual-Mode Pretraining')

  return (
    <section className="home-hero-container" id="hero" aria-label="Pengenalan Platform LearnWith">
      <div className="home-hero-shell">
        {/* Atmosphere Background */}
        <div className="home-hero-bg-wrapper" aria-hidden="true">
          <img
            src="/frames/ezgif-frame-001.png"
            alt=""
            className="home-hero-bg-img"
          />
          <div className="home-hero-vignette-v" />
          <div className="home-hero-vignette-h" />
        </div>

        {/* Content Shell */}
        <div className="home-hero-inner">
          {/* Header Bar */}
          <div className="home-hero-top-bar">
            <div className="home-context-pill">
              <IconSparkles className="context-pill-icon" width={15} height={15} />
              <span>Platform Praktik Terstandar</span>
            </div>

            <div className="home-hero-status-tag">
              <span className="telemetry-dot" />
              <span>PORT 20128 // WORKSPACE READY</span>
            </div>
          </div>

          {/* Main 2-Col Split */}
          <div className="home-hero-grid">
            <div className="home-hero-narrative">
              <h1 className="home-hero-headline">
                Bukan Sekadar Teori. <br />
                <span className="text-accent">Buktikan Kompetensi Nyata.</span>
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
                  <IconCheckCircle width={13} height={13} /> Checkpoint Otomatis
                </span>
                <span className="capability-tag">
                  <IconActivity width={13} height={13} /> Dual-Mode Workspace
                </span>
                <span className="capability-tag">
                  <IconFileText width={13} height={13} /> Standardisasi Pergub 14/2020
                </span>
              </div>
            </div>

            <div className="home-hero-showcase">
              <ShowcaseFrame />
            </div>
          </div>

          {/* Bottom 3-Card Grid */}
          <div className="hero-bottom-cards-grid">
            {/* Card 1 */}
            <div className="hero-mini-card">
              <div className="hero-mini-card-header">
                <div>
                  <div className="hero-metric-value">100%</div>
                  <div className="hero-metric-label">Validasi Checkpoint Otomatis</div>
                </div>
                <div className="hero-mini-emblem">
                  <IconCheckCircle width={16} height={16} />
                </div>
              </div>
              <div className="hero-mini-card-footer">
                <span className="hero-status-chip">
                  <span className="telemetry-dot" /> Live Verification Server
                </span>
                <a href="#pilihan-modul" className="hero-card-action-btn" title="Buka Katalog" aria-label="Buka Katalog">
                  <IconArrowRight width={14} height={14} />
                </a>
              </div>
            </div>

            {/* Card 2 */}
            <div className="hero-mini-card hero-mini-card-modes">
              <div className="hero-mini-card-header">
                <div>
                  <h3 className="hero-modes-title">Eksplorasi. Eksekusi. Kuasai.</h3>
                  <p className="hero-modes-desc">Pilih fokus pelatihan Anda: kecerdasan artifisial lokal atau tata naskah dinas kedinasan.</p>
                </div>
                <div className="hero-metric-right">
                  <span className="hero-metric-num">2 Jalur</span>
                  <span className="hero-metric-sub">Kurikulum Lengkap</span>
                </div>
              </div>
              <div className="hero-modes-footer">
                <div className="hero-modes-active-text">
                  <span className="hero-mode-name">{activeVariation}</span>
                  <span className="hero-mode-hint">Selektor mode pembelajaran</span>
                </div>
                <div className="hero-stepped-palette" aria-label="Curriculum mode selector">
                  <button type="button" onClick={() => setActiveVariation('Dual-Mode Pretraining')} className={`palette-dot dot-1 ${activeVariation === 'Dual-Mode Pretraining' ? 'active' : ''}`} title="Dual-Mode Pretraining" aria-label="Dual-Mode Pretraining" />
                  <button type="button" onClick={() => setActiveVariation('Word Office Automation')} className={`palette-dot dot-2 ${activeVariation === 'Word Office Automation' ? 'active' : ''}`} title="Word Office Automation" aria-label="Word Office Automation" />
                  <button type="button" onClick={() => setActiveVariation('PowerShell CLI Scripting')} className={`palette-dot dot-3 ${activeVariation === 'PowerShell CLI Scripting' ? 'active' : ''}`} title="PowerShell CLI Scripting" aria-label="PowerShell CLI Scripting" />
                  <button type="button" onClick={() => setActiveVariation('Telegram Bot Integration')} className={`palette-dot dot-4 ${activeVariation === 'Telegram Bot Integration' ? 'active' : ''}`} title="Telegram Bot Integration" aria-label="Telegram Bot Integration" />
                  <button type="button" onClick={() => setActiveVariation('Pergub 14 Compliance')} className={`palette-dot dot-5 ${activeVariation === 'Pergub 14 Compliance' ? 'active' : ''}`} title="Pergub 14 Compliance" aria-label="Pergub 14 Compliance" />
                  <button type="button" onClick={() => setActiveVariation('Live Class Simulator')} className={`palette-dot dot-6 ${activeVariation === 'Live Class Simulator' ? 'active' : ''}`} title="Live Class Simulator" aria-label="Live Class Simulator" />
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="hero-mini-card hero-mini-card-preview">
              <div className="hero-preview-img-container">
                <img src="/images/card-preview.jpg" alt="Preview" className="hero-preview-img" />
                <div className="hero-preview-top-badges">
                  <span className="hero-preview-tag"><span className="telemetry-dot" /> WORKSPACE</span>
                  <span className="hero-preview-port">PORT 20128</span>
                </div>
                <div className="hero-preview-meta">
                  <span>Ollama Local Pre-training</span>
                  <span className="hero-preview-ver">v1.0</span>
                </div>
              </div>
              <div className="hero-preview-controls">
                <div className="hero-terminal-ready">
                  <IconTerminal width={12} height={12} />
                  <span>Terminal Ready</span>
                </div>
                <a href="#pilihan-modul" className="hero-preview-launch-btn">
                  <span>Buka Modul</span>
                  <IconArrowRight width={12} height={12} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
