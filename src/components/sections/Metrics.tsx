import { content } from '../../lib/content';

export function Metrics() {
  return (
    <section id="metrics" className="metrics">
      <div className="container metrics-inner">
        {content.metrics.map((m, i) => (
          <div className="metric" key={i}>
            <strong className="m-num">
              {( 'prefix' in m ? (m as any).prefix : '')}{m.value}{m.suffix}
            </strong>
            <span className="m-label">{m.label}</span>
            <div className="m-bar-host">
              {/* TODO(3D): Replace or augment these bars with synced 3D geometry in Leaks3D */}
              <div className="m-bar" style={{ width: i === 2 ? '100%' : `${Math.min(92, 55 + i * 18)}%` }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
