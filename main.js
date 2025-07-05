document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('darkModeToggle');
    const logo = document.getElementById('logo');
    const icon = document.getElementById('darkModeIcon');
  
    toggleButton.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
  
      const isDark = document.body.classList.contains('dark-mode');
      logo.src = isDark ? 'images/equalizerwhite.png' : 'images/equalizer.png';
  
      // Switch icon classes
      icon.className = isDark ? 'bi bi-brightness-high' : 'bi bi-moon-stars-fill';
      toggleButton.title = isDark ? 'Toggle light mode' : 'Toggle dark mode';
    });
  });
  