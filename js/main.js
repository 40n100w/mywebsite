const menu = document.getElementById('period-dialog');
const menuButton = document.querySelector('.menu-toggle');
menuButton.addEventListener('click', () => menu.showModal());
document.getElementById('close-menu').addEventListener('click', () => menu.close());
menu.addEventListener('click', event => {
  if (event.target === menu) {
    const rect = menu.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) menu.close();
  }
});
menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => menu.close()));
document.getElementById('year').textContent = new Date().getFullYear();
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js');
