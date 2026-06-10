import { content } from '../../lib/content';

export function Contact() {
  const f = content.contact.form;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Preserve original behavior intent: honest conversation, no heavy pitch.
    // TODO: Wire to Netlify / Formspree / custom endpoint exactly as original (or keep console for now).
    const form = e.currentTarget;
    const btn = form.querySelector('.btn-submit') as HTMLButtonElement | null;
    if (btn) btn.textContent = 'Thank you — we will reply within 24h';

    // Simple visual confirmation (party-js or confetti can be re-added)
    setTimeout(() => {
      if (btn) btn.textContent = content.contact.form.submit;
      form.reset();
    }, 2600);
  };

  return (
    <section id="contact" className="contact">
      <div className="container">
        <h2 className="contact-title">
          <em>The first call<br />costs nothing.</em>
        </h2>
        <p className="contact-sub">{content.contact.sub}</p>

        <div className="contact-form-wrap">
          <form id="contact-form" className="contact-form" onSubmit={handleSubmit} noValidate>
            <div className="form-row">
              <div className="field">
                <label htmlFor="f-name">{f.name.label}</label>
                <input type="text" id="f-name" name="name" placeholder={f.name.placeholder} required autoComplete="name" />
              </div>
              <div className="field">
                <label htmlFor="f-agency">{f.agency.label}</label>
                <input type="text" id="f-agency" name="agency" placeholder={f.agency.placeholder} required />
              </div>
            </div>

            <div className="field">
              <label htmlFor="f-email">{f.email.label}</label>
              <input type="email" id="f-email" name="email" placeholder={f.email.placeholder} required autoComplete="email" />
            </div>

            <div className="field">
              <label htmlFor="f-challenge">{f.challenge.label}</label>
              <textarea 
                id="f-challenge" 
                name="challenge" 
                rows={3} 
                placeholder={f.challenge.placeholder} 
                required 
              />
            </div>

            <button type="submit" className="btn-submit" id="submit-btn">
              <span className="btn-label">{f.submit}</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <p className="form-note">{content.contact.note}</p>
          </form>
        </div>

        <div className="trust-chips">
          {content.contact.chips.map((chip, i) => (
            <span className="chip" key={i}>{chip}</span>
          ))}
        </div>

        {/* 
          Subtle 3D accent opportunity here:
          A small fixed or in-flow <Contact3D/> (network of recovery nodes or a flying paper-plane that reacts on successful submit)
        */}
      </div>
    </section>
  );
}
