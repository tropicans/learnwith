import { useState } from 'react'
import { PRETRAINING_GLOSSARY_TERMS } from '@/data/pretrainingFoundation'

export function PretrainingGlossarySection() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredTerms = PRETRAINING_GLOSSARY_TERMS.filter(
    (t) =>
      t.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.definition.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <section id="sec-glosarium" className="content-section">
      <div className="section-header">
        <div className="section-title-wrap">
          <div className="section-badge-num">2</div>
          <div>
            <h3 className="section-title">Glosarium Istilah Penting</h3>
            <p className="section-desc">
              Kamus istilah teknis sederhana agar Anda mudah memahami setiap instruksi.
            </p>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '1.25rem' }}>
        <input
          type="search"
          placeholder="🔍 Cari istilah teknis (misal: Token, 9Router, BotFather)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="glossary-search-input"
        />
      </div>

      <div className="card-grid" id="glossary-container">
        {filteredTerms.map((term) => (
          <div key={term.id} className="card card-interactive">
            <h4 className="card-title">
              {term.icon} {term.term}
            </h4>
            <p className="card-body">{term.definition}</p>
          </div>
        ))}
        {filteredTerms.length === 0 && (
          <p className="glossary-empty-msg">
            Tidak ditemukan istilah yang cocok dengan "{searchTerm}".
          </p>
        )}
      </div>
    </section>
  )
}
