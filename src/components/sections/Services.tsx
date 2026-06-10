import { content } from '../../lib/content';

export function Services() {
  return (
    <section id="services" className="services">
      <div className="container">
        <h2 className="services-title">
          Three fixes.<br /><em>One call.</em>
        </h2>

        {/* 
          3D SERVICES HUB INJECTION POINT (highest priority after Hero)
          The Swiper + tilt cards below will be replaced by <Services3D /> 
          - Central elegant 3D hub
          - Three orbiting/focused service nodes
          - GSAP-scrubbed camera that orbits to the active service on scroll or click
          - Side panel (or 3D Html billboard) shows the exact original desc
          - All copy below stays verbatim in the panel
        */}

        <div className="services-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
          {content.services.items.map((svc, i) => (
            <article 
              key={i} 
              className={`svc-card ${svc.featured ? 'svc-card--featured' : ''}`}
            >
              <div className="svc-head">
                <span className="svc-idx">{svc.idx}</span>
                <svg className="svc-icon-svg" width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                  {i === 0 && (
                    <>
                      <circle cx="16" cy="16" r="13" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M16 10V16L20 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </>
                  )}
                  {i === 1 && (
                    <>
                      <path d="M16 4L5 10V18C5 24 10 28.5 16 30C22 28.5 27 24 27 18V10L16 4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                      <path d="M11 16L14.5 19.5L21.5 12.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </>
                  )}
                  {i === 2 && (
                    <>
                      <circle cx="16" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.5"/>
                      <circle cx="6" cy="25" r="3.5" stroke="currentColor" strokeWidth="1.5"/>
                      <circle cx="26" cy="25" r="3.5" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M13 11L8 21.5M19 11L24 21.5M12.5 25H19.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </>
                  )}
                </svg>
              </div>
              <h3 className="svc-name">{svc.name}</h3>
              <p className="svc-desc">{svc.desc}</p>
              <div className="svc-footer">
                <div className="svc-bar-host"><div className="svc-bar" style={{ width: svc.featured ? '82%' : '55%' }} /></div>
              </div>
            </article>
          ))}
        </div>

        <p className="services-note">{content.services.note}</p>

        {/* Placeholder for the real 3D component that will drive this section immersively */}
        {/* <Services3D activeIndex={active} onFocus={(i) => ...} /> */}
      </div>
    </section>
  );
}
