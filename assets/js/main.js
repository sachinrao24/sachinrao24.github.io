// Performance tracking for debug mode
const metrics = {
  loadTime: Date.now(),
  navCount: 0,
  startTime: Date.now(),
  currentSection: 'about'
};

// Theme management
function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
  updateThemeIcon();
}

function toggleTheme() {
  const html = document.documentElement;
  const currentTheme = html.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  html.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeIcon();
}

function updateThemeIcon() {
  const theme = document.documentElement.getAttribute('data-theme');
  const icon = document.getElementById('themeIcon');
  if (theme === 'dark') {
    icon.textContent = '☽';
  } else {
    icon.textContent = '☀';
  }
}

// Navigation
function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.content-section');
  
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const target = link.getAttribute('data-target');
      
      // Update nav active state
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      
      // Show target section with flow animation
      sections.forEach(section => {
        if (section.id === target) {
          section.classList.add('active');
          metrics.currentSection = target;
          metrics.navCount++;
          
          // Trigger reveal animations for new section
          setTimeout(() => triggerReveals(), 100);
        } else {
          section.classList.remove('active');
        }
      });
    });
  });
}

// Scroll reveal animations
function triggerReveals() {
  const reveals = document.querySelectorAll('.reveal');
  reveals.forEach((el, index) => {
    setTimeout(() => {
      el.classList.add('visible');
    }, index * 100);
  });
}

// Debug mode easter egg
let debugVisible = false;

function toggleDebug() {
  const panel = document.getElementById('debugPanel');
  debugVisible = !debugVisible;
  
  if (debugVisible) {
    panel.classList.add('visible');
    startDebugTimer();
  } else {
    panel.classList.remove('visible');
  }
}

function updateDebugPanel() {
  const elapsed = Math.floor((Date.now() - metrics.loadTime) / 1000);
  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;
  
  document.getElementById('debugNavCount').textContent = metrics.navCount;
  document.getElementById('debugCurrentSection').textContent = metrics.currentSection;
  document.getElementById('debugTimeOnPage').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function startDebugTimer() {
  setInterval(() => {
    if (debugVisible) {
      updateDebugPanel();
    }
  }, 1000);
}

// Keyboard shortcuts
function initKeyboardShortcuts() {
  // Show keyboard hints - they stay visible
  const hints = document.getElementById('keyboardHints');
  hints.classList.add('visible');
  
  document.addEventListener('keydown', (e) => {
    // Press 'D' to toggle debug mode
    if (e.key === 'd' || e.key === 'D') {
      toggleDebug();
    }
    
    // Number keys for quick navigation
    const navMap = { '1': 'about', '2': 'publications', '3': 'education', '4': 'interests' };
    if (navMap[e.key]) {
      const link = document.querySelector(`[data-target="${navMap[e.key]}"]`);
      if (link) link.click();
    }
  });
}

// Mouse movement parallax (subtle)
function initParallax() {
  const sidebar = document.querySelector('.sidebar');
  
  document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 10;
    const y = (e.clientY / window.innerHeight - 0.5) * 10;
    
    sidebar.style.transform = `translate(${x}px, ${y}px)`;
  });
  
  document.addEventListener('mouseleave', () => {
    sidebar.style.transform = 'translate(0, 0)';
  });
}

// Smooth scroll behavior
function initSmoothScroll() {
  document.documentElement.style.scrollBehavior = 'smooth';
}

// Fetch Chess.com rating
function fetchChessRating() {
  const ratingEl = document.querySelector('.rating-value');
  
  fetch('https://api.chess.com/pub/player/quixilver24/stats')
    .then(response => response.json())
    .then(data => {
      if (data.chess_rapid && data.chess_rapid.best) {
        ratingEl.textContent = data.chess_rapid.best.rating;
        ratingEl.classList.add('visible');
      } else if (data.chess_rapid && data.chess_rapid.last) {
        ratingEl.textContent = data.chess_rapid.last.rating;
        ratingEl.classList.add('visible');
      } else {
        ratingEl.textContent = '—';
      }
    })
    .catch(() => {
      ratingEl.textContent = '—';
    });
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavigation();
  initKeyboardShortcuts();
  initSmoothScroll();
  initParallax();
  
  // Theme toggle button
  document.getElementById('themeToggle').addEventListener('click', toggleTheme);
  
  // Initial reveals
  setTimeout(() => triggerReveals(), 300);
  
  // Fetch chess rating
  fetchChessRating();
  
  // Record load time (visible time to first paint)
  metrics.loadTime = Date.now();
});