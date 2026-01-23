document.querySelectorAll('.accordion-trigger').forEach(button => {
  button.addEventListener('mousedown', function() {
    const expanded = this.getAttribute('aria-expanded') === 'true';
    this.setAttribute('aria-expanded', !expanded);
  }); 

  button.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' || event.key === 'Space') {
      const panel = document.getElementById(this.getAttribute('aria-controls'));
      event.preventDefault();
      const expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !expanded);
    }
  });
});