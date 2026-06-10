import { content } from '../../lib/content';

interface MarqueeProps {
  items?: readonly string[];
}

export function Marquee({ items = content.marquee }: MarqueeProps) {
  const all = [...items, ...items]; // seamless loop

  return (
    <div id="marquee-strip" className="marquee-strip" aria-hidden="true">
      <div className="marquee-inner">
        {all.map((text, i) => (
          <span key={i}>{text}</span>
        ))}
      </div>
    </div>
  );
}
