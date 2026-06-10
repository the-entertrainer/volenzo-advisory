import { content } from '../../lib/content';

export function Problem() {
  return (
    <section id="problem" className="problem">
      <div className="container">
        <h2 className="problem-title">
          Three leaks.<br /><em>One bleeding agency.</em>
        </h2>

        <div className="problem-rows" id="problem-rows">
          {content.problem.leaks.map((leak, index) => (
            <div key={index}>
              <div className="problem-row">
                <span className="row-idx" aria-hidden="true">{leak.idx}</span>
                <div className="row-body">
                  <strong className="row-name">{leak.name}</strong>
                  <p className="row-desc">{leak.desc}</p>
                </div>
                <div className="row-loss">
                  <span className="loss-amt">{leak.loss}</span>
                  <span className="loss-word">{leak.lossWord}</span>
                </div>
              </div>

              {index < content.problem.leaks.length - 1 && (
                <svg 
                  className="row-divider" 
                  viewBox="0 0 1200 2" 
                  preserveAspectRatio="none" 
                  aria-hidden="true"
                >
                  <path d="M0,1 L1200,1" stroke="rgba(0,55,180,0.12)" strokeWidth="1" fill="none" />
                </svg>
              )}

              {/* 
                3D INJECTION POINT (per OVERHAUL_PLAN)
                When Leaks3D is ready, place a synced 3D conduit visualization here or as a sticky companion.
                Scroll depth through each .problem-row will drive particle emission, color lerp, valve state, and camera focus on the corresponding 3D leak.
              */}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
