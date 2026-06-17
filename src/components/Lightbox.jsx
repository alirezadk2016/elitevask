const HTML = `<!-- LIGHTBOX -->
<div class="lightbox" id="lightbox">
  <button class="lb-close" id="lbClose" aria-label="Luk"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
  <button class="lb-prev" id="lbPrev" aria-label="Forrige"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg></button>
  <img id="lbImg" src="" alt="">
  <button class="lb-next" id="lbNext" aria-label="Næste"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg></button>
</div>`;
export default function Lightbox() {
  return <div dangerouslySetInnerHTML={{ __html: HTML }} />;
}
