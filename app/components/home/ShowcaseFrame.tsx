import { useEffect, useRef } from 'react'
import { IconTerminal, IconCheckCircle, IconShield, IconActivity } from './Icons'

interface ShowcaseFrameProps {
  videoSrc?: string
  posterSrc?: string
}

export function ShowcaseFrame({ videoSrc, posterSrc }: ShowcaseFrameProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video || !videoSrc) return

    // IntersectionObserver to pause/resume playback and save CPU/GPU cycles
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {
              // Autoplay might be restricted; gracefully handled
            })
          } else {
            video.pause()
          }
        })
      },
      { threshold: 0.25 }
    )

    observer.observe(video)
    return () => observer.disconnect()
  }, [videoSrc])

  return (
    <div className="showcase-frame" aria-label="Visualisasi Alur Validasi Checkpoint LearnWith">
      {/* Window Titlebar */}
      <div className="showcase-titlebar" aria-hidden="true">
        <div className="showcase-window-controls">
          <span className="control-dot"></span>
          <span className="control-dot"></span>
          <span className="control-dot"></span>
        </div>
        <div className="showcase-window-title">
          <IconTerminal width={14} height={14} />
          <span>learnwith-studio — alur validasi checkpoint</span>
        </div>
        <div className="showcase-window-actions">
          <span className="showcase-tag">LIVE VERIFICATION</span>
        </div>
      </div>

      {/* Media Architecture Contract: Video layer (optional future source) */}
      {videoSrc ? (
        <video
          ref={videoRef}
          className="showcase-video"
          poster={posterSrc}
          preload="none"
          muted
          loop
          playsInline
          aria-label="Demonstrasi alur kerja checkpoint interaktif"
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      ) : (
        /* Conceptual Product & Terminal Mechanism Visualization (Zero fake screenshot) */
        <div className="showcase-stage" role="img" aria-label="Visualisasi konsep validasi checkpoint: perintah terminal dan status otomatis">
          <div className="showcase-terminal-body">
            <div className="terminal-line terminal-prompt">
              <span className="prompt-path">PS C:\learnwith\workspace&gt;</span>
              <span className="prompt-cmd"> .\checkpoints\verify-step.ps1 -Module 02 -Target 9Router</span>
            </div>

            <div className="terminal-line terminal-output text-muted">
              <span>[1/3] Memeriksa instalasi runtime Node.js v22 LTS ... </span>
              <span className="text-success font-semibold">VALID</span>
            </div>

            <div className="terminal-line terminal-output text-muted">
              <span>[2/3] Memindai gateway proxy http://127.0.0.1:20128 ... </span>
              <span className="text-success font-semibold">ONLINE (PORT AKTIF)</span>
            </div>

            <div className="terminal-line terminal-output text-muted">
              <span>[3/3] Melakukan uji routing model AI &amp; token allowance ... </span>
              <span className="text-success font-semibold">TERHUBUNG</span>
            </div>

            <div className="terminal-checkpoint-card">
              <div className="checkpoint-card-header">
                <div className="checkpoint-card-title">
                  <IconCheckCircle className="text-success" width={18} height={18} />
                  <span>Checkpoint CP-02: 9Router Gateway Online</span>
                </div>
                <span className="checkpoint-pill verified">TERVERIFIKASI OTOMATIS</span>
              </div>
              <p className="checkpoint-card-desc">
                Gateway lokal merespons pada port 20128. Token credential disensor secara otomatis di memory client tanpa kebocoran secret.
              </p>
              <div className="checkpoint-card-meta">
                <span className="meta-badge">
                  <IconShield width={13} height={13} /> Sensor Token Aktif
                </span>
                <span className="meta-badge">
                  <IconActivity width={13} height={13} /> Latensi 14ms
                </span>
              </div>
            </div>
          </div>

          <div className="showcase-caption-bar">
            <span>Visualisasi Konseptual: Alur Eksekusi Terminal &amp; Validasi Checkpoint Otomatis</span>
          </div>
        </div>
      )}
    </div>
  )
}
