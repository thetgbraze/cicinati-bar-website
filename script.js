document.addEventListener('DOMContentLoaded', () => {

    // ── 1. Theme Toggle Logic ────────────────────────────────
    const htmlEl = document.documentElement;
    const themeBtn = document.getElementById('theme-toggle');
    const mobileThemeBtn = document.getElementById('mobile-theme-toggle');

    // Apply saved theme (default: dark)
    const savedTheme = localStorage.getItem('theme') || 'dark';
    htmlEl.setAttribute('data-theme', savedTheme);

    function toggleTheme() {
        const newTheme = htmlEl.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        htmlEl.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    }

    themeBtn?.addEventListener('click', toggleTheme);
    mobileThemeBtn?.addEventListener('click', () => {
        toggleTheme();
        closeMobileMenu();
    });


    // ── 2. Mobile Menu Logic ─────────────────────────────────
    const mobileBtn  = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon   = document.getElementById('mobile-menu-icon');
    let menuIsOpen   = false;

    function openMobileMenu() {
        menuIsOpen = true;
        mobileMenu.classList.remove('menu-closed');
        mobileMenu.style.display = 'flex';
        // Allow display:flex to apply before transitioning
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                mobileMenu.style.transform  = 'scaleY(1)';
                mobileMenu.style.opacity    = '1';
            });
        });
        mobileBtn.setAttribute('aria-expanded', 'true');
        menuIcon.className = 'ph ph-x text-2xl';
    }

    function closeMobileMenu() {
        if (!menuIsOpen) return;
        menuIsOpen = false;
        mobileMenu.style.transform  = 'scaleY(0)';
        mobileMenu.style.opacity    = '0';
        mobileBtn.setAttribute('aria-expanded', 'false');
        menuIcon.className = 'ph ph-list text-2xl';
        setTimeout(() => {
            mobileMenu.classList.add('menu-closed');
        }, 280);
    }

    mobileBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        menuIsOpen ? closeMobileMenu() : openMobileMenu();
    });

    // Close on any nav link click
    mobileMenu?.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (menuIsOpen && !mobileMenu.contains(e.target) && !mobileBtn.contains(e.target)) {
            closeMobileMenu();
        }
    });


    // ── 2.5. Sliding Pill Nav Hover ──────────────────────────
    const desktopNav = document.getElementById('desktop-nav');
    const navPill    = document.getElementById('nav-pill');

    if (desktopNav && navPill) {
        desktopNav.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('mouseenter', (e) => {
                const rect       = e.target.getBoundingClientRect();
                const parentRect = desktopNav.getBoundingClientRect();
                navPill.style.left    = (rect.left - parentRect.left) + 'px';
                navPill.style.width   = rect.width + 'px';
                navPill.style.top     = (rect.top - parentRect.top) + 'px';
                navPill.style.height  = rect.height + 'px';
                navPill.classList.remove('opacity-0');
                navPill.classList.add('opacity-100');
            });
        });
        desktopNav.addEventListener('mouseleave', () => {
            navPill.classList.remove('opacity-100');
            navPill.classList.add('opacity-0');
        });
    }


    // ── 3. Custom Mouse Cursor ───────────────────────────────
    const cursor = document.getElementById('custom-cursor');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (cursor && window.matchMedia('(pointer: fine)').matches && !prefersReducedMotion) {
        let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
        let cursorX = mouseX, cursorY = mouseY;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.style.opacity = '1';
        });

        const updateCursor = () => {
            cursorX += (mouseX - cursorX) * 0.15;
            cursorY += (mouseY - cursorY) * 0.15;
            cursor.style.transform = `translate3d(${cursorX - 6}px, ${cursorY - 6}px, 0)`;
            requestAnimationFrame(updateCursor);
        };
        updateCursor();

        document.querySelectorAll('a, button, input, select, textarea, .hover-lift').forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.width  = '28px';
                cursor.style.height = '28px';
                cursor.style.background = 'rgba(220,38,38,0.4)';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.width  = '12px';
                cursor.style.height = '12px';
                cursor.style.background = '';
            });
        });
    } else if (cursor) {
        cursor.style.display = 'none';
    }


    // ── 4. Hero Slideshow ────────────────────────────────────
    const slides = [
        'https://images.unsplash.com/photo-1543007630-9710e4a00a20?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
        'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
        'https://images.unsplash.com/photo-1516280440503-6c7398189c44?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
        'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1920&q=80'
    ];

    const slideshowEl = document.getElementById('slideshow');
    const dotsEl      = document.getElementById('slide-dots');
    let currentSlide  = 0;
    let slideInterval = null;

    // Build slides
    slides.forEach((src, i) => {
        const div = document.createElement('div');
        div.className = `hero-slide${i === 0 ? ' active' : ''}`;
        div.style.backgroundImage = `url('${src}')`;
        div.setAttribute('role', 'img');
        div.setAttribute('aria-label', `Slideshow image ${i + 1}`);
        slideshowEl.appendChild(div);
    });

    const slideEls = document.querySelectorAll('.hero-slide');

    // Build dots
    slides.forEach((_, i) => {
        const btn = document.createElement('button');
        btn.className = `slide-dot${i === 0 ? ' active' : ''}`;
        btn.setAttribute('aria-label', `Go to slide ${i + 1}`);
        btn.addEventListener('click', () => goToSlide(i));
        dotsEl.appendChild(btn);
    });

    const dotEls = document.querySelectorAll('.slide-dot');

    function goToSlide(n) {
        slideEls[currentSlide].classList.remove('active');
        dotEls[currentSlide].classList.remove('active');
        currentSlide = (n + slides.length) % slides.length;
        slideEls[currentSlide].classList.add('active');
        dotEls[currentSlide].classList.add('active');
    }

    function nextSlide() { goToSlide(currentSlide + 1); }
    function prevSlide() { goToSlide(currentSlide - 1); }

    document.getElementById('slide-next')?.addEventListener('click', (e) => { e.preventDefault(); nextSlide(); });
    document.getElementById('slide-prev')?.addEventListener('click', (e) => { e.preventDefault(); prevSlide(); });

    function startSlideshow() {
        if (!prefersReducedMotion) {
            slideInterval = setInterval(nextSlide, 5000);
        }
    }
    function stopSlideshow() { clearInterval(slideInterval); }

    startSlideshow();

    const heroSection = document.getElementById('hero');
    heroSection?.addEventListener('mouseenter', stopSlideshow);
    heroSection?.addEventListener('mouseleave', startSlideshow);

    // Swipe support on mobile
    let touchStartX = 0;
    heroSection?.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
    heroSection?.addEventListener('touchend', e => {
        const dx = e.changedTouches[0].screenX - touchStartX;
        if (Math.abs(dx) > 50) dx < 0 ? nextSlide() : prevSlide();
    }, { passive: true });


    // ── 5. Menu Data & Rendering ─────────────────────────────
    const menuData = [
        { name: 'Classic Cincinnati Burger', category: 'Burgers',      price: '$14', desc: 'Double patty, smoked cheddar, bacon, house sauce.',           img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80' },
        { name: 'Spicy Chicken Sandwich',    category: 'Burgers',      price: '$12', desc: 'Crispy fried chicken, spicy slaw, pickles.',                   img: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=600&q=80' },
        { name: 'Ribeye Steak',              category: 'Grilled Meat', price: '$32', desc: '12oz bone-in ribeye, garlic butter, roasted veg.',             img: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80' },
        { name: 'BBQ Pork Ribs',             category: 'Grilled Meat', price: '$24', desc: 'Half rack slow-smoked, bourbon BBQ glaze.',                    img: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=600&q=80' },
        { name: 'Neon Old Fashioned',        category: 'Cocktails',    price: '$12', desc: 'Bourbon, bitters, orange peel, distinct smoke.',               img: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=600&q=80' },
        { name: 'Karaoke Margarita',         category: 'Cocktails',    price: '$10', desc: 'Tequila, lime juice, agave, spicy rim.',                       img: 'https://images.unsplash.com/photo-1560512823-829485b8bf24?auto=format&fit=crop&w=600&q=80' },
        { name: 'Local IPA Draft',           category: 'Beers',        price: '$6',  desc: "Rotating tap of the city's best hoppy drafts.",               img: 'https://images.unsplash.com/photo-1595155694247-920fca6838b0?auto=format&fit=crop&w=600&q=80' },
        { name: 'Crispy Calamari',           category: 'Snacks',       price: '$11', desc: 'Lightly breaded squid, lemon garlic aioli.',                   img: 'https://images.unsplash.com/photo-1599487405249-161bfe8dbf72?auto=format&fit=crop&w=600&q=80' },
        { name: 'Loaded Truffle Fries',      category: 'Snacks',       price: '$9',  desc: 'Shoestring fries, truffle oil, parmesan, herbs.',              img: 'https://images.unsplash.com/photo-1574158622602-c1f96dfda1fa?auto=format&fit=crop&w=600&q=80' }
    ];

    const menuGrid    = document.getElementById('menu-grid');
    const menuFilters = document.querySelectorAll('.menu-filter');

    function renderMenu(category = 'All') {
        menuGrid.innerHTML = '';
        const filtered = category === 'All' ? menuData : menuData.filter(i => i.category === category);

        if (filtered.length === 0) {
            menuGrid.innerHTML = `<p class="col-span-3 text-center text-gray-400 py-12">No items in this category yet!</p>`;
            return;
        }

        filtered.forEach(item => {
            const card = document.createElement('div');
            card.className = 'glass-card hover-lift overflow-hidden group flex flex-col h-full';
            card.innerHTML = `
                <div class="aspect-video w-full overflow-hidden bg-gray-200 dark:bg-gray-800 shrink-0">
                    <img src="${item.img}" alt="${item.name}" loading="lazy"
                        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105">
                </div>
                <div class="p-6 flex flex-col flex-grow">
                    <div class="flex justify-between items-start mb-2 gap-2">
                        <h3 class="text-xl font-heading font-bold text-gray-900 dark:text-white leading-tight">${item.name}</h3>
                        <span class="text-xl font-bold text-cta shrink-0">${item.price}</span>
                    </div>
                    <span class="text-xs font-bold text-primary uppercase tracking-wider mb-3 block">${item.category}</span>
                    <p class="text-gray-600 dark:text-gray-400 text-sm flex-grow leading-relaxed">${item.desc}</p>
                </div>`;
            menuGrid.appendChild(card);
        });
    }

    renderMenu();

    menuFilters.forEach(btn => {
        btn.addEventListener('click', () => {
            menuFilters.forEach(f => {
                f.classList.remove('active', 'bg-primary', 'text-white', 'border-primary');
                f.classList.add('border-gray-300');
            });
            btn.classList.add('active', 'bg-primary', 'text-white', 'border-primary');
            btn.classList.remove('border-gray-300');
            renderMenu(btn.dataset.category);
        });
    });


    // ── 6. Gallery Data & Rendering ──────────────────────────
    const galleryImages = [
        { src: 'https://images.unsplash.com/photo-1514933651103-005eab06c04d?auto=format&fit=crop&w=600&q=80', alt: 'Neon sign above bar' },
        { src: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=600&q=80', alt: 'Bartender pouring drinks' },
        { src: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&w=600&q=80', alt: 'Grilling in kitchen' },
        { src: 'https://images.unsplash.com/photo-1516280440503-6c7398189c44?auto=format&fit=crop&w=600&q=80', alt: 'Karaoke night crowd' },
        { src: 'https://images.unsplash.com/photo-1575037614876-c3f2b604b08f?auto=format&fit=crop&w=600&q=80', alt: 'Mixed cocktail drinks' },
        { src: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80', alt: 'Gourmet food plate' },
        { src: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80', alt: 'Bar interior with lights' },
        { src: 'https://images.unsplash.com/photo-1572116469696-ed7f6add23fe?auto=format&fit=crop&w=600&q=80', alt: 'Cocktail close-up' }
    ];

    const galleryGrid = document.getElementById('gallery-grid');
    galleryImages.forEach(({ src, alt }) => {
        const div = document.createElement('div');
        div.className = 'gallery-item aspect-square relative bg-gray-200 dark:bg-gray-800';
        div.innerHTML = `
            <img src="${src}" loading="lazy" alt="${alt}" class="w-full h-full object-cover">
            <div class="gallery-overlay">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M229.66,218.34l-50.06-50.07a88.21,88.21,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.31-11.31ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Zm120,0a8,8,0,0,1-8,8H120v32a8,8,0,0,1-16,0V120H72a8,8,0,0,1,0-16h32V72a8,8,0,0,1,16,0v32h32A8,8,0,0,1,160,112Z"/>
                </svg>
            </div>`;
        galleryGrid.appendChild(div);
    });


    // ── 7. Scroll Reveal ─────────────────────────────────────
    const revealObs = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));


    // ── 8. Sticky Header Behavior ────────────────────────────
    const navbar = document.getElementById('navbar');
    let lastY    = window.scrollY;

    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        if (y > lastY && y > 100) {
            navbar.style.transform = 'translate(-50%, -130%)';
            navbar.style.opacity   = '0';
        } else {
            navbar.style.transform = 'translate(-50%, 0)';
            navbar.style.opacity   = '1';
        }
        lastY = y;
    }, { passive: true });


    // ── 9. Toast Notification ────────────────────────────────
    const toastEl  = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-message');
    let toastTimer = null;

    function showToast(message, duration = 4000) {
        if (toastTimer) clearTimeout(toastTimer);
        toastMsg.textContent = message;
        toastEl.classList.add('show');
        toastTimer = setTimeout(() => toastEl.classList.remove('show'), duration);
    }


    // ── 10. Reservation Form ─────────────────────────────────
    document.getElementById('reservation-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('button[type="submit"]');
        btn.disabled   = true;
        btn.innerHTML  = '<i class="ph ph-circle-notch animate-spin text-xl"></i> Sending…';

        // Simulate async submit
        setTimeout(() => {
            e.target.reset();
            btn.disabled  = false;
            btn.innerHTML = '<i class="ph ph-check-circle text-xl"></i> Book My Reservation';
            showToast('🎉 Reservation received! We\'ll confirm via phone shortly.');
        }, 1200);
    });

});
