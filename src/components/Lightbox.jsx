const HTML = `<!-- LIGHTBOX -->
<div class="lightbox" id="lightbox"><button class="lb-close" id="lbClose" aria-label="Luk"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button><img id="lbImg" src="" alt=""></div>`;
export default function Lightbox() {
  return <div dangerouslySetInnerHTML={{ __html: HTML }} />;
}
