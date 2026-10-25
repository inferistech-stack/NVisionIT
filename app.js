/* ============================================================
   Nvision IT — shared chrome injection + interactions + 3D
   Works across every page (index, about, services, etc.)
   ============================================================ */
(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Which page are we on? ---------- */
  const current = (location.pathname.split('/').pop() || 'index.html') || 'index.html';
  const NAV = [
    { href: 'about.html', label: 'About' },
    { href: 'services.html', label: 'Services' },
    { href: 'healthcare-it.html', label: 'Healthcare IT' },
    { href: 'public-sector.html', label: 'Public Sector' },
    { href: 'contact.html', label: 'Contact' },
  ];

  /* ---------- Inject shared chrome ---------- */
  const navHTML = NAV.map(n =>
    `<a href="${n.href}"${n.href === current ? ' class="active"' : ''}>${n.label}</a>`
  ).join('');

  const chrome = `
    <div class="loader" id="loader"><div class="loader-inner">
      <div class="loader-mark">N<span>V</span></div>
      <div class="loader-bar"><span></span></div>
    </div></div>
    <div class="cursor" id="cursor"></div>
    <div class="cursor-dot" id="cursorDot"></div>
    <div class="scroll-progress" id="scrollProgress"></div>
    <canvas id="bg3d"></canvas>
    <header class="nav" id="nav">
      <a href="index.html" class="nav-logo">
        <span class="logo-mark">N<b>V</b></span>
        <span class="logo-text">Nvision<i>IT</i></span>
      </a>
      <nav class="nav-links" id="navLinks">${navHTML}</nav>
      <a href="contact.html" class="nav-cta">Start a Project</a>
      <button class="nav-burger" id="navBurger" aria-label="Menu"><span></span><span></span><span></span></button>
    </header>`;
  document.body.insertAdjacentHTML('afterbegin', chrome);

  const footer = `
    <footer class="footer">
      <div class="footer-top">
        <div class="footer-brand">
          <span class="logo-mark">N<b>V</b></span>
          <p>Transforming today's business challenges into tomorrow's successes — since 2004.</p>
        </div>
        <div class="footer-cols">
          <div><h4>Company</h4><a href="about.html">About Us</a><a href="healthcare-it.html">Healthcare IT</a><a href="public-sector.html">Public Sector</a></div>
          <div><h4>Services</h4><a href="services.html">ERP & Oracle</a><a href="services.html">Enterprise Cloud</a><a href="services.html">BI & Analytics</a></div>
          <div><h4>Contact</h4><a href="tel:3142490824">314-249-0824</a><a href="mailto:info@nvisioninfotech.com">Email us</a><a href="contact.html">Start a Project</a></div>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© 2026 Nvision IT. All rights reserved.</span>
        <span>Award-Winning · Oracle-Certified · 20+ Years of Delivery</span>
      </div>
    </footer>`;
  document.body.insertAdjacentHTML('beforeend', footer);

  /* ---------- Loader ---------- */
  const fadeLoader = () => setTimeout(() => {
    const l = document.getElementById('loader');
    if (l) l.classList.add('done');
  }, 1100);
  if (document.readyState === 'complete') fadeLoader();
  else window.addEventListener('load', fadeLoader);

  /* ---------- Nav scroll state + progress ---------- */
  const nav = document.getElementById('nav');
  const prog = document.getElementById('scrollProgress');
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
    const h = document.documentElement;
    const denom = (h.scrollHeight - h.clientHeight) || 1;
    prog.style.width = (h.scrollTop / denom * 100) + '%';
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  const burger = document.getElementById('navBurger');
  const links = document.getElementById('navLinks');
  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    links.classList.toggle('open');
  });
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    burger.classList.remove('open'); links.classList.remove('open');
  }));

  /* ---------- Hero title lines (home only) ---------- */
  setTimeout(() => {
    document.querySelectorAll('.hero-title .line').forEach((l, i) =>
      setTimeout(() => l.classList.add('in'), 1200 + i * 140));
  }, 0);

  /* ---------- Reveal on scroll ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('[data-reveal]').forEach((el, i) => {
    el.style.transitionDelay = (i % 4) * 70 + 'ms';
    io.observe(el);
  });

  /* ---------- Animated counters ---------- */
  const countIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = +el.dataset.count;
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      const dur = 1600, start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = prefix + Math.floor(eased * target).toLocaleString() + suffix;
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = prefix + target.toLocaleString() + suffix;
      };
      requestAnimationFrame(tick);
      countIO.unobserve(el);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('[data-count]').forEach(el => countIO.observe(el));

  /* ---------- Cursor + magnetic + tilt ---------- */
  if (!reduce && window.matchMedia('(hover:hover)').matches) {
    const cur = document.getElementById('cursor');
    const dot = document.getElementById('cursorDot');
    let mx = 0, my = 0, cx = 0, cy = 0;
    window.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
    });
    (function loop() {
      cx += (mx - cx) * 0.18; cy += (my - cy) * 0.18;
      cur.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%)`;
      requestAnimationFrame(loop);
    })();
    document.querySelectorAll('a,button,[data-tilt],[data-tag]').forEach(el => {
      el.addEventListener('mouseenter', () => cur.classList.add('hover'));
      el.addEventListener('mouseleave', () => cur.classList.remove('hover'));
    });
    document.querySelectorAll('[data-magnetic]').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px,${(e.clientY - r.top - r.height / 2) * 0.35}px)`;
      });
      el.addEventListener('mouseleave', () => el.style.transform = '');
    });
    document.querySelectorAll('[data-tilt]').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(800px) rotateY(${px * 8}deg) rotateX(${-py * 8}deg) translateY(-6px)`;
      });
      el.addEventListener('mouseleave', () => el.style.transform = '');
    });
  }

  /* ---------- Contact form (if present) ---------- */
  const form = document.getElementById('contactForm');
  if (form) form.addEventListener('submit', e => {
    e.preventDefault();
    const note = document.getElementById('formNote');
    if (note) note.textContent = "Thank you — your message is ready to send. Our team responds within one business day.";
    form.reset();
  });

  /* ============================================================
     THREE.JS — particle network field
     ============================================================ */
  if (reduce || typeof THREE === 'undefined') return;
  const canvas = document.getElementById('bg3d');
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0c0c0d, 0.06);
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 14;

  const COUNT = window.innerWidth < 768 ? 110 : 220;
  const positions = new Float32Array(COUNT * 3);
  const velocities = [];
  const SPREAD = 26;
  for (let i = 0; i < COUNT; i++) {
    positions[i*3] = (Math.random() - 0.5) * SPREAD;
    positions[i*3+1] = (Math.random() - 0.5) * (SPREAD * 0.6);
    positions[i*3+2] = (Math.random() - 0.5) * SPREAD * 0.6;
    velocities.push(new THREE.Vector3((Math.random()-0.5)*0.012,(Math.random()-0.5)*0.012,(Math.random()-0.5)*0.012));
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const c = document.createElement('canvas'); c.width = c.height = 64;
  const ctx = c.getContext('2d');
  const grd = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grd.addColorStop(0, 'rgba(255,120,120,1)');
  grd.addColorStop(0.4, 'rgba(204,27,27,0.6)');
  grd.addColorStop(1, 'rgba(204,27,27,0)');
  ctx.fillStyle = grd; ctx.fillRect(0, 0, 64, 64);
  const sprite = new THREE.CanvasTexture(c);
  const pMat = new THREE.PointsMaterial({ size: 0.55, map: sprite, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.9 });
  const points = new THREE.Points(pGeo, pMat);
  scene.add(points);

  const lineGeo = new THREE.BufferGeometry();
  const maxLines = COUNT * 6;
  const linePos = new Float32Array(maxLines * 6);
  lineGeo.setAttribute('position', new THREE.BufferAttribute(linePos, 3));
  const lines = new THREE.LineSegments(lineGeo, new THREE.LineBasicMaterial({ color: 0xcc1b1b, transparent: true, opacity: 0.2, blending: THREE.AdditiveBlending }));
  scene.add(lines);

  const LINK_DIST = 5.2;
  function updateLines() {
    const p = pGeo.attributes.position.array; let n = 0;
    for (let i = 0; i < COUNT; i++) for (let j = i + 1; j < COUNT; j++) {
      const dx = p[i*3]-p[j*3], dy = p[i*3+1]-p[j*3+1], dz = p[i*3+2]-p[j*3+2];
      if (dx*dx+dy*dy+dz*dz < LINK_DIST*LINK_DIST && n < maxLines - 2) {
        linePos[n*3]=p[i*3]; linePos[n*3+1]=p[i*3+1]; linePos[n*3+2]=p[i*3+2]; n++;
        linePos[n*3]=p[j*3]; linePos[n*3+1]=p[j*3+1]; linePos[n*3+2]=p[j*3+2]; n++;
      }
    }
    lineGeo.setDrawRange(0, n);
    lineGeo.attributes.position.needsUpdate = true;
  }

  let tmx = 0, tmy = 0, scrollY = 0;
  window.addEventListener('mousemove', e => { tmx = e.clientX/window.innerWidth-0.5; tmy = e.clientY/window.innerHeight-0.5; });
  window.addEventListener('scroll', () => { scrollY = window.scrollY; }, { passive: true });

  const clock = new THREE.Clock();
  (function animate() {
    const t = clock.getElapsedTime();
    const p = pGeo.attributes.position.array;
    for (let i = 0; i < COUNT; i++) {
      p[i*3] += velocities[i].x; p[i*3+1] += velocities[i].y; p[i*3+2] += velocities[i].z;
      if (Math.abs(p[i*3]) > SPREAD/2) velocities[i].x *= -1;
      if (Math.abs(p[i*3+1]) > SPREAD*0.3) velocities[i].y *= -1;
      if (Math.abs(p[i*3+2]) > SPREAD*0.3) velocities[i].z *= -1;
    }
    pGeo.attributes.position.needsUpdate = true;
    updateLines();
    points.rotation.y = lines.rotation.y = t * 0.04;
    points.rotation.x = lines.rotation.x = Math.sin(t * 0.1) * 0.06;
    camera.position.x += (tmx * 3 - camera.position.x) * 0.04;
    camera.position.y += (-tmy * 2 - scrollY * 0.002 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  })();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();
