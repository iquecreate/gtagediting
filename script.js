// ===== UNDEAD EDITING PACK — MAIN SCRIPT =====

document.addEventListener('DOMContentLoaded', () => {

    // ===== PRELOAD SFX =====
    const hoverSfx = document.getElementById('hoverSfx');
    const clickSfx = document.getElementById('clickSfx');
    let sfxReady = false;

    // Unlock audio on first user interaction
    function unlockAudio() {
        if (sfxReady) return;
        hoverSfx.volume = 0.3;
        clickSfx.volume = 0.4;
        const silentPlay = (el) => {
            el.play().then(() => { el.pause(); el.currentTime = 0; }).catch(() => {});
        };
        silentPlay(hoverSfx);
        silentPlay(clickSfx);
        sfxReady = true;
        document.removeEventListener('click', unlockAudio);
        document.removeEventListener('mousemove', unlockAudio);
    }
    document.addEventListener('click', unlockAudio);
    document.addEventListener('mousemove', unlockAudio);

    function playHoverSfx() {
        if (!sfxReady) return;
        const s = hoverSfx.cloneNode();
        s.volume = 0.25;
        s.play().catch(() => {});
    }

    function playClickSfx() {
        if (!sfxReady) return;
        const s = clickSfx.cloneNode();
        s.volume = 0.35;
        s.play().catch(() => {});
    }

    // ===== BUTTON HOVER & CLICK SFX + ANIMATIONS =====
    document.querySelectorAll('.btn-hover-sfx').forEach(el => {
        el.addEventListener('mouseenter', () => {
            playHoverSfx();
            el.classList.add('hovered');
        });
        el.addEventListener('mouseleave', () => {
            el.classList.remove('hovered');
        });
    });

    document.querySelectorAll('.btn-click-sfx').forEach(el => {
        el.addEventListener('mousedown', (e) => {
            playClickSfx();
            el.classList.add('clicking');

            // Ripple effect
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            const rect = el.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
            ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
            el.appendChild(ripple);

            setTimeout(() => {
                el.classList.remove('clicking');
                ripple.remove();
            }, 600);
        });
    });

    // ===== CURSOR GLOW =====
    const cursorGlow = document.getElementById('cursorGlow');
    let mouseX = 0, mouseY = 0, glowX = 0, glowY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursorGlow() {
        glowX += (mouseX - glowX) * 0.08;
        glowY += (mouseY - glowY) * 0.08;
        cursorGlow.style.left = glowX + 'px';
        cursorGlow.style.top = glowY + 'px';
        requestAnimationFrame(animateCursorGlow);
    }
    animateCursorGlow();

    // ===== PARTICLE SYSTEM =====
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.3;
            this.vy = (Math.random() - 0.5) * 0.3;
            this.size = Math.random() * 1.5 + 0.5;
            this.opacity = Math.random() * 0.4 + 0.1;
            this.life = Math.random() * 300 + 200;
            this.maxLife = this.life;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.life--;
            if (this.life <= 0 || this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                this.reset();
            }
        }
        draw() {
            const fade = this.life / this.maxLife;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(124, 58, 237, ${this.opacity * fade})`;
            ctx.fill();
        }
    }

    // Fewer particles for performance
    const particleCount = Math.min(60, Math.floor(window.innerWidth / 20));
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // ===== NAVBAR SCROLL =====
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    // ===== MOBILE MENU =====
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });

    // Close menu on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
        });
    });

    // ===== SCROLL ANIMATIONS =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-in').forEach(el => observer.observe(el));

    // ===== SMOOTH SCROLL FOR NAV LINKS =====
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ===== AUDIO PLAYER SYSTEM =====
    let currentAudio = null;
    let currentItem = null;
    let progressInterval = null;

    document.querySelectorAll('.audio-item').forEach(item => {
        const playBtn = item.querySelector('.play-btn');
        const src = item.dataset.src;
        const waveformProgress = item.querySelector('.waveform-progress');
        const waveformBar = item.querySelector('.audio-waveform');

        playBtn.addEventListener('click', (e) => {
            e.stopPropagation();

            // If same track, toggle
            if (currentItem === item) {
                if (currentAudio.paused) {
                    currentAudio.play();
                    item.classList.add('playing');
                    startProgress(currentAudio, waveformProgress);
                } else {
                    currentAudio.pause();
                    item.classList.remove('playing');
                    clearInterval(progressInterval);
                }
                return;
            }

            // Stop current
            if (currentAudio) {
                currentAudio.pause();
                currentAudio.currentTime = 0;
                if (currentItem) {
                    currentItem.classList.remove('playing');
                    currentItem.querySelector('.waveform-progress').style.width = '0%';
                }
                clearInterval(progressInterval);
            }

            // Play new
            currentAudio = new Audio(src);
            currentItem = item;
            currentAudio.volume = 0.7;
            currentAudio.play().catch(() => {});
            item.classList.add('playing');
            startProgress(currentAudio, waveformProgress);

            currentAudio.addEventListener('ended', () => {
                item.classList.remove('playing');
                waveformProgress.style.width = '0%';
                clearInterval(progressInterval);
                currentAudio = null;
                currentItem = null;
            });
        });

        // Click on waveform to seek
        waveformBar.addEventListener('click', (e) => {
            if (currentItem !== item || !currentAudio) return;
            const rect = waveformBar.getBoundingClientRect();
            const pct = (e.clientX - rect.left) / rect.width;
            currentAudio.currentTime = pct * currentAudio.duration;
        });
    });

    function startProgress(audio, bar) {
        clearInterval(progressInterval);
        progressInterval = setInterval(() => {
            if (audio.duration) {
                bar.style.width = (audio.currentTime / audio.duration * 100) + '%';
            }
        }, 50);
    }

    // ===== LIGHTBOX =====
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');

    // All clickable images
    document.querySelectorAll('.adj-preview img, .adj-values-imgs img, .asset-img-wrap img').forEach(img => {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', () => {
            lightboxImg.src = img.src;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    lightbox.addEventListener('click', closeLightbox);
    document.querySelector('.lightbox-close').addEventListener('click', (e) => {
        e.stopPropagation();
        closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
    });

    // ===== COUNTER ANIMATION =====
    const statNumbers = document.querySelectorAll('.stat-number');
    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const text = el.textContent;
                const num = parseInt(text);
                if (!isNaN(num) && !el.dataset.animated) {
                    el.dataset.animated = 'true';
                    animateCounter(el, 0, num, 1200);
                }
                statObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => statObserver.observe(el));

    function animateCounter(el, start, end, duration) {
        const suffix = el.textContent.includes('%') ? '%' : '';
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const ease = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(start + (end - start) * ease);
            el.textContent = current + suffix;
            if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }

    // ===== TILT EFFECT ON CARDS =====
    document.querySelectorAll('.adj-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            card.style.transform = `translateY(-4px) perspective(800px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;

            const glow = card.querySelector('.adj-card-glow');
            if (glow) {
                glow.style.left = (e.clientX - rect.left - rect.width) + 'px';
                glow.style.top = (e.clientY - rect.top - rect.height) + 'px';
            }
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

});
