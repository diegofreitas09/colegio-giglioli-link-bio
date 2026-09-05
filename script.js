document.querySelectorAll('.link-btn').forEach((button) => {
  button.addEventListener('pointerdown', () => button.style.transform = 'scale(.985)');
  const reset = () => button.style.transform = '';
  button.addEventListener('pointerup', reset);
  button.addEventListener('pointercancel', reset);
  button.addEventListener('pointerleave', reset);
});
