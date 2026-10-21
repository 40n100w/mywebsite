/* Prefer the original, with the already-viewed image as an offline fallback. */
(() => {
  const viewer = document.getElementById('image-viewer');
  const image = document.getElementById('viewer-image');
  const status = document.getElementById('viewer-status');
  const stage = document.querySelector('.viewer-image-stage');
  const zoom = document.getElementById('viewer-zoom');

  window.openArtworkImage = ({src, preview, alt, caption}) => {
    image.onload = image.onerror = null;
    image.removeAttribute('src');
    image.hidden = true;
    image.alt = alt;
    zoom.disabled = true;
    stage.setAttribute('aria-busy', 'true');
    document.getElementById('viewer-caption').textContent = caption;
    status.textContent = 'Loading image…';
    let usingPreview = false;
    image.onload = () => {
      image.hidden = false;
      zoom.disabled = false;
      stage.setAttribute('aria-busy', 'false');
      status.textContent = usingPreview ? 'Full-size image unavailable. Showing the preview.' : '';
    };
    image.onerror = () => {
      if (!usingPreview && preview && new URL(preview, location.href).href !== new URL(src, location.href).href) {
        usingPreview = true;
        image.src = preview;
      } else {
        stage.setAttribute('aria-busy', 'false');
        status.textContent = 'This image is unavailable. Close the viewer and try again when you have a connection.';
      }
    };
    image.src = src;
    if (!viewer.open) viewer.showModal();
  };
  document.getElementById('viewer-close').addEventListener('click', () => viewer.close());
  viewer.addEventListener('click', event => {
    if (event.target !== viewer) return;
    const rect = viewer.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) viewer.close();
  });
  viewer.addEventListener('close', () => {
    if (viewer.open) return;
    image.onload = image.onerror = null;
    image.removeAttribute('src');
    image.hidden = true;
    zoom.disabled = true;
    status.textContent = '';
    stage.setAttribute('aria-busy', 'false');
  });
})();
