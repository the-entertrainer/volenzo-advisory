import { content } from '../../lib/content';

export function Footer() {
  return (
    <footer id="footer" className="footer">
      <div className="container footer-row">
        <a href="#hero" data-scroll>
          <picture>
            <source srcSet="assets/volenzologo.webp" type="image/webp" />
            <img src="assets/volenzologo.png" alt={content.nav.logoAlt} className="footer-logo" />
          </picture>
        </a>

        <nav className="footer-nav" aria-label="Footer navigation">
          {content.footer.links.map((link) => (
            <a key={link.href} href={link.href} data-scroll>{link.label}</a>
          ))}
        </nav>
      </div>

      <div className="container footer-bottom">
        <p>{content.footer.copyright}</p>
        <p className="footer-credits" dangerouslySetInnerHTML={{ __html: content.footer.credits }} />
      </div>
    </footer>
  );
}
