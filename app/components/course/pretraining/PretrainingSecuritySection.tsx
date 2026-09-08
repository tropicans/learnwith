import { PRETRAINING_SECURITY_RULES } from '@/data/pretrainingFoundation'

export function PretrainingSecuritySection() {
  return (
    <section id="sec-security" className="content-section">
      <div className="section-header">
        <div className="section-title-wrap">
          <div className="section-badge-num">3</div>
          <div>
            <h3 className="section-title">Aturan Keamanan & Perlindungan Rahasia</h3>
            <p className="section-desc">
              Patuhi 4 protokol keamanan berikut demi mencegah kebocoran data rahasia.
            </p>
          </div>
        </div>
      </div>

      <div className="card card-glass">
        <div className="checklist-group">
          {PRETRAINING_SECURITY_RULES.map((rule) => (
            <div key={rule.id} className="checklist-item">
              <input
                type="checkbox"
                className="checklist-checkbox"
                id={rule.id}
                checked
                disabled
                readOnly
              />
              <label htmlFor={rule.id} className="checklist-label">
                <strong>{rule.highlight}</strong> {rule.text}
              </label>
            </div>
          ))}
        </div>

        <div className="alert-box alert-warning" style={{ marginTop: '1.25rem' }}>
          <div className="alert-icon">⚠️</div>
          <div className="alert-content">
            <h5>Contoh Sensor Token yang Benar</h5>
            <p>
              API Key Asli: <code>sk-ant-api03-abcdef123456789-rahasia</code>
              <br />
              Yang Dikirim: <code>sk-ant-api03-****-rahasia</code>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
