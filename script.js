document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Theme Toggle Logic ---
    const htmlEl = document.documentElement;
    const themeBtn = document.getElementById('theme-toggle');
    const mobileThemeBtn = document.getElementById('mobile-theme-toggle');

    const savedTheme = localStorage.getItem('theme') || 'dark';
    htmlEl.setAttribute('data-theme', savedTheme);

    function toggleTheme() {
        const currentTheme = htmlEl.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        htmlEl.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    }

    themeBtn.addEventListener('click', toggleTheme);
    mobileThemeBtn.addEventListener('click', toggleTheme);


    // --- 2. Mobile Menu Logic ---
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    mobileBtn.addEventListener('click', () => {
        const isHidden = mobileMenu.classList.contains('hidden');
        if (isHidden) {
            mobileMenu.classList.remove('hidden');
            // Small delay for CSS transition
            setTimeout(() => {
                mobileMenu.classList.remove('scale-y-0');
                mobileMenu.classList.add('scale-y-100');
            }, 10);
        } else {
            mobileMenu.classList.remove('scale-y-100');
            mobileMenu.classList.add('scale-y-0');
            setTimeout(() => {
                mobileMenu.classList.add('hidden');
            }, 300); // Wait for transition
        }
    });

    // Close mobile menu on click
    document.querySelectorAll('#mobile-menu a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('scale-y-100');
            mobileMenu.classList.add('scale-y-0');
            setTimeout(() => {
                mobileMenu.classList.add('hidden');
            }, 300);
        });
    });

    // --- 2.5 Sliding Pill Navigation Hover Effect ---
    const desktopNav = document.getElementById('desktop-nav');
    const navPill = document.getElementById('nav-pill');
    const navLinks = desktopNav ? desktopNav.querySelectorAll('.nav-link') : [];

    if (desktopNav && navPill) {
        navLinks.forEach(link => {
            link.addEventListener('mouseenter', (e) => {
                const rect = e.target.getBoundingClientRect();
                const containerRect = desktopNav.getBoundingClientRect();

                // Calculate position relative to the container
                const leftPos = rect.left - containerRect.left;
                const width = rect.width;

                navPill.style.width = width + 'px';
                navPill.style.left = leftPos + 'px';
                navPill.classList.remove('opacity-0');
                navPill.classList.add('opacity-100');
            });
        });

        desktopNav.addEventListener('mouseleave', () => {
            navPill.classList.remove('opacity-100');
            navPill.classList.add('opacity-0');
        });
    }


    // --- 3. Custom Mouse Cursor logic ---
    const cursor = document.getElementById('custom-cursor');
    if (cursor && window.matchMedia("(pointer: fine)").matches) {
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let cursorX = mouseX;
        let cursorY = mouseY;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            if (cursor.classList.contains('opacity-0')) {
                cursor.classList.remove('opacity-0');
            }
        });

        const updateCursor = () => {
            // Apply simple linear interpolation (lerp) for the "lag" magnetic effect
            cursorX += (mouseX - cursorX) * 0.15;
            cursorY += (mouseY - cursorY) * 0.15;

            cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
            requestAnimationFrame(updateCursor);
        };
        updateCursor();

        // Enlarge cursor on interactive elements
        const interactiveSelectors = 'a, button, input, select, textarea, .hover-lift';
        const addCursorHover = () => cursor.style.transform += ' scale(2.5)';
        const removeCursorHover = () => cursor.style.transform = cursor.style.transform.replace(' scale(2.5)', '');

        document.querySelectorAll(interactiveSelectors).forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('bg-primary/50', 'backdrop-blur-sm');
                cursor.style.width = '24px';
                cursor.style.height = '24px';
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('bg-primary/50', 'backdrop-blur-sm');
                cursor.style.width = '12px';
                cursor.style.height = '12px';
            });
        });
    }

    // --- 4. Hero Slideshow Logic ---
    const slides = [
        "https://images.unsplash.com/photo-1543007630-9710e4a00a20?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80", // Bar interior
        "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80", // Drinks
        "https://images.unsplash.com/photo-1516280440503-6c7398189c44?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80", // Karaoke crowd
        "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1920&q=80" // Food
    ];

    const slideshowContainer = document.getElementById('slideshow');
    let currentSlide = 0;

    // Create slide elements
    slides.forEach((src, idx) => {
        const div = document.createElement('div');
        div.className = `hero-slide ${idx === 0 ? 'active' : ''}`;
        div.style.backgroundImage = `url('${src}')`;
        slideshowContainer.appendChild(div);
    });

    const slideElements = document.querySelectorAll('.hero-slide');
    let slideInterval;

    function nextSlide() {
        slideElements[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slideElements[currentSlide].classList.add('active');
    }

    // Advance automatically every 5 seconds
    function startSlideshow() {
        slideInterval = setInterval(nextSlide, 5000);
    }
    function stopSlideshow() {
        clearInterval(slideInterval);
    }

    startSlideshow();

    // Pause on hover
    const heroSection = document.getElementById('hero');
    heroSection.addEventListener('mouseenter', stopSlideshow);
    heroSection.addEventListener('mouseleave', startSlideshow);


    // --- 4. Menu Data & Rendering ---
    const menuData = [
        { name: "Classic Cicinati Burger", category: "Burgers", price: "$14", desc: "Double patty, smoked cheddar, bacon, house sauce.", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80" },
        { name: "Spicy Chicken Sandwich", category: "Burgers", price: "$12", desc: "Crispy fried chicken, spicy slaw, pickles.", img: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=600&q=80" },
        { name: "Ribeye Steak", category: "Grilled Meat", price: "$32", desc: "12oz bone-in ribeye, garlic butter, roasted veg.", img: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80" },
        { name: "BBQ Pork Ribs", category: "Grilled Meat", price: "$24", desc: "Half rack slow-smoked, bourbon BBQ glaze.", img: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=600&q=80" },
        { name: "Neon Old Fashioned", category: "Cocktails", price: "$12", desc: "Bourbon, bitters, orange peel, distinct smoke.", img: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=600&q=80" },
        { name: "Karaoke Margarita", category: "Cocktails", price: "$10", desc: "Tequila, lime juice, agave, spicy rim.", img: "https://images.unsplash.com/photo-1560512823-829485b8bf24?auto=format&fit=crop&w=600&q=80" },
        { name: "Local IPA Draft", category: "Beers", price: "$6", desc: "Rotating tap of the city's best hoppy drafts.", img: "https://images.unsplash.com/photo-1595155694247-920fca6838b0?auto=format&fit=crop&w=600&q=80" },
        { name: "Crispy Calamari", category: "Snacks", price: "$11", desc: "Lightly breaded squid, lemon garlic aioli.", img: "https://images.unsplash.com/photo-1599487405249-161bfe8dbf72?auto=format&fit=crop&w=600&q=80" },
        { name: "Loaded Truffle Fries", category: "Snacks", price: "$9", desc: "Shoestring fries, truffle oil, parmesan, herbs.", img: "https://images.unsplash.com/photo-1574158622602-c1f96dfda1fa?auto=format&fit=crop&w=600&q=80" }
    ];

    const menuGrid = document.getElementById('menu-grid');
    const menuFilters = document.querySelectorAll('.menu-filter');

    function renderMenu(category = "All") {
        menuGrid.innerHTML = '';
        const filteredData = category === "All" ? menuData : menuData.filter(item => item.category === category);

        filteredData.forEach(item => {
            const card = document.createElement('div');
            card.className = "glass-card hover-lift overflow-hidden group flex flex-col h-full";
            card.innerHTML = `
                <div class="h-48 overflow-hidden bg-gray-200 dark:bg-gray-800 shrink-0">
                    <img src="${item.img}" alt="${item.name}" loading="lazy" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105">
                </div>
                <div class="p-6 flex flex-col flex-grow">
                    <div class="flex justify-between items-start mb-2">
                        <h3 class="text-xl font-heading font-bold text-gray-900 dark:text-white">${item.name}</h3>
                        <span class="text-xl font-bold text-cta glow-text shrink-0 ml-2">${item.price}</span>
                    </div>
                    <span class="text-xs font-medium text-primary uppercase tracking-wider mb-3 block">${item.category}</span>
                    <p class="text-gray-600 dark:text-gray-400 text-sm flex-grow">${item.desc}</p>
                </div>
            `;
            menuGrid.appendChild(card);
        });
    }

    renderMenu(); // Init

    menuFilters.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Update active state
            menuFilters.forEach(f => {
                f.classList.remove('active', 'bg-primary/10', 'border-primary', 'text-primary');
                f.classList.add('border-gray-300', 'dark:border-gray-700');
            });
            e.target.classList.add('active', 'bg-primary/10', 'border-primary', 'text-primary');
            e.target.classList.remove('border-gray-300', 'dark:border-gray-700');

            // Re-render
            renderMenu(e.target.innerText);
        });
    });

    // --- 5. Gallery Data & Rendering ---
    const galleryImages = [
        "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1516280440503-6c7398189c44?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&w=600&q=80", // Grilling
        "https://images.unsplash.com/photo-1525268771113-32d9e9021a97?auto=format&fit=crop&w=600&q=80", // Party
        "https://images.unsplash.com/photo-1575037614876-c3f2b604b08f?auto=format&fit=crop&w=600&q=80", // Drinks
        "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80", // Food plate
        "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80", // Bar interior lights
        "https://images.unsplash.com/photo-1572116469696-ed7f6add23fe?auto=format&fit=crop&w=600&q=80"  // Cocktail details
    ];

    const galleryGrid = document.getElementById('gallery-grid');
    galleryImages.forEach(src => {
        const div = document.createElement('div');
        div.className = "aspect-square overflow-hidden rounded-xl bg-gray-200 dark:bg-gray-800 relative cursor-pointer group";
        div.innerHTML = `
            <img src="${src}" loading="lazy" alt="Gallery Image" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
            <div class="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors duration-300"></div>
        `;
        galleryGrid.appendChild(div);
    });

    // --- 6. Scroll Animations (Reveal) ---
    const revealElements = document.querySelectorAll('.reveal');
    const revealCallback = function (entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: stop observing once revealed
                observer.unobserve(entry.target);
            }
        });
    };
    const revealObserver = new IntersectionObserver(revealCallback, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });
    revealElements.forEach(el => revealObserver.observe(el));

    // --- 7. Sticky Header behavior ---
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        // Adjust nav appearance based on scroll
        if (window.scrollY > 50) {
            navbar.style.transform = "translateY(-10px)"; // small push
            navbar.querySelector('.glass-nav').classList.add('shadow-xl');
        } else {
            navbar.style.transform = "translateY(0)";
            navbar.querySelector('.glass-nav').classList.remove('shadow-xl');
        }
    });

    // --- 8. Prevent Form Default Submission ---
    document.getElementById('reservation-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you! Your reservation request has been received.');
        e.target.reset();
    });
});
