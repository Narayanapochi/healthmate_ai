/* HealthMate AI - Main JavaScript */

// Dark Mode
function initDarkMode() {
  const saved = localStorage.getItem('hm-theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  const btn = document.getElementById('darkToggle');
  if (btn) btn.classList.toggle('on', saved === 'dark');
}

function toggleDark() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('hm-theme', next);
  const btn = document.getElementById('darkToggle');
  if (btn) btn.classList.toggle('on', next === 'dark');
}

// Language
function setLanguage(lang) {
  localStorage.setItem('hm-lang', lang);
  fetch('/accounts/set-language/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-CSRFToken': getCookie('csrftoken') },
    body: JSON.stringify({ language: lang })
  }).then(() => location.reload()).catch(() => location.reload());
}

function initLanguage() {
  const lang = localStorage.getItem('hm-lang') || 'en';
  document.querySelectorAll('[data-lang]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
}

// Sidebar
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  sidebar?.classList.toggle('open');
  overlay?.classList.toggle('open');
}

// Cookie helper
function getCookie(name) {
  const cookies = document.cookie.split(';');
  for (let c of cookies) {
    const [k, v] = c.trim().split('=');
    if (k === name) return decodeURIComponent(v);
  }
  return null;
}

// Auto-dismiss alerts
function initAlerts() {
  document.querySelectorAll('.auto-dismiss').forEach(el => {
    setTimeout(() => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(-10px)';
      setTimeout(() => el.remove(), 300);
    }, 4000);
  });
}

// Animate numbers
function animateNumber(el) {
  const target = parseFloat(el.dataset.target || el.textContent);
  const isFloat = String(target).includes('.');
  const decimals = isFloat ? 1 : 0;
  const duration = 1200;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = isFloat ? current.toFixed(decimals) : Math.floor(current);
    if (current >= target) clearInterval(timer);
  }, 16);
}

function initCounters() {
  document.querySelectorAll('[data-counter]').forEach(el => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { animateNumber(el); obs.unobserve(el); } });
    });
    obs.observe(el);
  });
}

// Progress bars animation
function initProgress() {
  document.querySelectorAll('.progress-bar[data-width]').forEach(bar => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          bar.style.width = bar.dataset.width + '%';
          obs.unobserve(bar);
        }
      });
    });
    obs.observe(bar);
  });
}

// Animate elements in
function initAnimations() {
  document.querySelectorAll('.anim').forEach((el, i) => {
    el.style.opacity = '0';
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          setTimeout(() => {
            el.style.animation = `fadeInUp 0.5s ease both`;
            el.style.opacity = '';
          }, (i % 6) * 80);
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.1 });
    obs.observe(el);
  });
}

// BMI Calculator
function calculateBMI() {
  const weight = parseFloat(document.getElementById('bmiWeight')?.value);
  const heightCm = parseFloat(document.getElementById('bmiHeight')?.value);
  if (weight && heightCm) {
    const heightM = heightCm / 100;
    const bmi = (weight / (heightM * heightM)).toFixed(1);
    const bmiField = document.getElementById('id_bmi');
    if (bmiField) bmiField.value = bmi;
    
    const display = document.getElementById('bmiDisplay');
    if (display) {
      let status, cls;
      if (bmi < 18.5) { status = 'Underweight'; cls = 'warning'; }
      else if (bmi < 25) { status = 'Normal'; cls = 'normal'; }
      else if (bmi < 30) { status = 'Overweight'; cls = 'warning'; }
      else { status = 'Obese'; cls = 'danger'; }
      display.innerHTML = `<span class="hbadge ${cls}">BMI: ${bmi} — ${status}</span>`;
    }
  }
}

// Risk gauge
function drawGauge(canvasId, value, max = 100) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const cx = canvas.width / 2;
  const cy = canvas.height * 0.85;
  const radius = Math.min(canvas.width, canvas.height) * 0.7;
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Background arc
  ctx.beginPath();
  ctx.arc(cx, cy, radius, Math.PI, 0);
  ctx.lineWidth = 18;
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineCap = 'round';
  ctx.stroke();
  
  // Value arc
  const pct = value / max;
  const color = pct < 0.3 ? '#10b981' : pct < 0.6 ? '#f59e0b' : '#ef4444';
  ctx.beginPath();
  ctx.arc(cx, cy, radius, Math.PI, Math.PI + pct * Math.PI);
  ctx.strokeStyle = color;
  ctx.stroke();
  
  // Center text
  ctx.fillStyle = color;
  ctx.font = 'bold 28px Outfit, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(value.toFixed(1) + '%', cx, cy - 10);
  
  ctx.fillStyle = '#64748b';
  ctx.font = '12px Outfit, sans-serif';
  ctx.fillText('Risk Score', cx, cy + 12);
}

// Initialize charts helper
function createLineChart(id, labels, datasets, title = '') {
  const canvas = document.getElementById(id);
  if (!canvas) return;
  
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const gridColor = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)';
  const textColor = isDark ? '#94a3b8' : '#64748b';
  
  return new Chart(canvas, {
    type: 'line',
    data: { labels, datasets },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: textColor, font: { family: 'Outfit', size: 12 }, boxWidth: 14 } },
        title: title ? { display: true, text: title, color: textColor } : { display: false },
        tooltip: {
          backgroundColor: isDark ? '#1e293b' : '#0f172a',
          titleColor: '#fff', bodyColor: '#94a3b8',
          borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1,
          cornerRadius: 8, padding: 10,
        }
      },
      scales: {
        x: { grid: { color: gridColor }, ticks: { color: textColor, font: { family: 'Outfit', size: 11 } } },
        y: { grid: { color: gridColor }, ticks: { color: textColor, font: { family: 'Outfit', size: 11 } } },
      },
      elements: { line: { tension: 0.4 }, point: { radius: 4, hoverRadius: 6 } }
    }
  });
}

function createBarChart(id, labels, data, color = '#1a56db') {
  const canvas = document.getElementById(id);
  if (!canvas) return;
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const gridColor = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)';
  const textColor = isDark ? '#94a3b8' : '#64748b';
  
  return new Chart(canvas, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: color + '33',
        borderColor: color,
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { color: textColor } },
        y: { grid: { color: gridColor }, ticks: { color: textColor } }
      }
    }
  });
}

function createDoughnutChart(id, labels, data, colors) {
  const canvas = document.getElementById(id);
  if (!canvas) return;
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  
  return new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{ data, backgroundColor: colors, borderWidth: 0, hoverOffset: 6 }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      cutout: '72%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: isDark ? '#94a3b8' : '#64748b', padding: 16, font: { family: 'Outfit', size: 12 }, boxWidth: 12, usePointStyle: true }
        }
      }
    }
  });
}

// On DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initDarkMode();
  initLanguage();
  initAlerts();
  initCounters();
  initProgress();
  initAnimations();
  
  // Sidebar toggle
  document.getElementById('sidebarToggle')?.addEventListener('click', toggleSidebar);
  document.getElementById('sidebarOverlay')?.addEventListener('click', toggleSidebar);
  document.getElementById('darkToggle')?.addEventListener('click', toggleDark);
  
  // Lang buttons
  document.querySelectorAll('[data-lang]').forEach(btn => {
    btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
  });
  
  // BMI calculator
  document.getElementById('bmiWeight')?.addEventListener('input', calculateBMI);
  document.getElementById('bmiHeight')?.addEventListener('input', calculateBMI);
  
  // Mark active nav
  const path = window.location.pathname;
  document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
    if (link.getAttribute('href') && path.startsWith(link.getAttribute('href')) && link.getAttribute('href') !== '/') {
      link.classList.add('active');
    }
  });
});
