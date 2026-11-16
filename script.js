// Dynamic Vacuums - Interactive Experience Script

document.addEventListener('DOMContentLoaded', () => {
  // 1. Wishlist Buttons Toggle
  const wishlistButtons = document.querySelectorAll('.wishlist-btn');
  wishlistButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      btn.classList.toggle('active');
      const svg = btn.querySelector('svg');
      if (btn.classList.contains('active')) {
        svg.setAttribute('fill', 'currentColor');
      } else {
        svg.setAttribute('fill', 'none');
      }
    });
  });

  // 2. Our Favourites Tab Filtering & Carousel Controls
  const tabButtons = document.querySelectorAll('.tab-btn');
  const carousel = document.getElementById('productCarousel');
  const prevBtn = document.getElementById('fav-prev');
  const nextBtn = document.getElementById('fav-next');

  // Products dataset for dynamic tab switching
  const productsData = {
    residential: [
      {
        brand: 'DYSON',
        title: 'Dyson V8 Stick Vacuum',
        price: 'CAD $589.99',
        rating: '★★★★★',
        reviews: '(48)',
        badge: 'In Stock',
        img: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=400&q=80'
      },
      {
        brand: 'MIELE',
        title: 'Miele Guard S1 Canister Vacuum',
        price: 'CAD $399.99',
        rating: '★★★★★',
        reviews: '(64)',
        badge: 'In Stock',
        img: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=400&q=80'
      },
      {
        brand: 'DYSON',
        title: 'Dyson V15 Detect',
        price: 'CAD $994.99',
        rating: '★★★★★',
        reviews: '(112)',
        badge: 'Popular',
        img: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=400&q=80'
      },
      {
        brand: 'SEBO',
        title: 'SEBO Airbelt E3 Premium',
        price: 'CAD $749.99',
        rating: '★★★★★',
        reviews: '(39)',
        badge: 'In Stock',
        img: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=400&q=80'
      }
    ],
    central: [
      {
        brand: 'DUOVAC',
        title: 'Duovac Star Central Vacuum Power Unit',
        price: 'CAD $899.99',
        rating: '★★★★★',
        reviews: '(27)',
        badge: 'In Stock',
        img: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=400&q=80'
      },
      {
        brand: 'CANAVAC',
        title: 'Cana-Vac Signature Series LS-750',
        price: 'CAD $789.00',
        rating: '★★★★★',
        reviews: '(31)',
        badge: 'In Stock',
        img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80'
      },
      {
        brand: 'HIDE-A-HOSE',
        title: 'Retractable Rapid Hose 50ft System',
        price: 'CAD $649.99',
        rating: '★★★★★',
        reviews: '(52)',
        badge: 'Best Seller',
        img: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=400&q=80'
      },
      {
        brand: 'CYCLOVAC',
        title: 'CycloVac High Performance Hybrid Unit',
        price: 'CAD $949.99',
        rating: '★★★★★',
        reviews: '(19)',
        badge: 'In Stock',
        img: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=400&q=80'
      }
    ],
    commercial: [
      {
        brand: 'PROTEAM',
        title: 'Super Coach Pro 10 Backpack Vacuum',
        price: 'CAD $629.99',
        rating: '★★★★★',
        reviews: '(83)',
        badge: 'Pro Grade',
        img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80'
      },
      {
        brand: 'NUMATIC',
        title: 'Henry Professional Canister HVR200',
        price: 'CAD $489.99',
        rating: '★★★★★',
        reviews: '(142)',
        badge: 'Top Choice',
        img: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=400&q=80'
      },
      {
        brand: 'TASKI',
        title: 'Aero 8 Plus Commercial Vacuum',
        price: 'CAD $579.00',
        rating: '★★★★★',
        reviews: '(26)',
        badge: 'In Stock',
        img: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=400&q=80'
      },
      {
        brand: 'NOBLES',
        title: 'Speed Scrub 15in Walk-Behind Scrubber',
        price: 'CAD $2,499.00',
        rating: '★★★★★',
        reviews: '(15)',
        badge: 'Commercial',
        img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80'
      }
    ]
  };

  // Cart State Management (CRO & CX Enhancement)
  let cartCount = 0;
  const cartBadge = document.querySelector('.cart-badge');
  const cartToast = document.getElementById('cartToast');
  const cartToastName = document.getElementById('cartToastName');
  let toastTimer = null;

  function showCartToast(productName) {
    if (!cartToast) return;
    if (cartToastName) cartToastName.textContent = productName;
    cartToast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      cartToast.classList.remove('show');
    }, 3500);
  }

  function setupCartButtons() {
    const cartButtons = document.querySelectorAll('.btn-add-to-cart');
    cartButtons.forEach(btn => {
      // Remove any previously bound handler to prevent duplicates
      btn.onclick = (e) => {
        e.stopPropagation();
        const productName = btn.dataset.name || 'Vacuum Cleaner';
        
        // Instant visual feedback on button
        btn.classList.add('added');
        const textSpan = btn.querySelector('.btn-text');
        const originalText = textSpan ? textSpan.textContent : 'Add to Cart';
        if (textSpan) textSpan.textContent = '✓ Added to Cart';

        // Increment cart count in header
        cartCount += 1;
        if (cartBadge) {
          cartBadge.textContent = cartCount;
          cartBadge.classList.add('bump');
          setTimeout(() => cartBadge.classList.remove('bump'), 300);
        }

        // Show floating toast
        showCartToast(productName);

        // Revert button state after 2.2 seconds
        setTimeout(() => {
          btn.classList.remove('added');
          if (textSpan) textSpan.textContent = originalText;
        }, 2200);
      };
    });
  }

  const brandLogos = {
    'DYSON': 'images/brands/dyson.svg',
    'MIELE': 'images/brands/miele.svg',
    'SEBO': 'images/brands/sebo.png',
    'DUOVAC': 'images/brands/duovac.png',
    'CYCLOVAC': 'images/brands/cyclovac.png',
    'NILFISK': 'images/brands/nilfisk.svg',
    'KARCHER': 'images/brands/karcher.png',
    'NUMATIC': 'images/brands/numatic.png',
    'PROTEAM': 'images/brands/proteam.png',
    'TASKI': 'images/brands/taski.png',
    'CANAVAC': 'images/brands/duovac.png',
    'HIDE-A-HOSE': 'images/brands/cyclovac.png',
    'NOBLES': 'images/brands/nilfisk.svg'
  };

  function renderFavourites(category) {
    if (!carousel) return;
    const items = productsData[category] || productsData.residential;
    carousel.innerHTML = items.map(p => {
      const brandKey = (p.brand || '').toUpperCase().trim();
      const logoSrc = brandLogos[brandKey];
      const brandMarkup = logoSrc
        ? `<img src="${logoSrc}" alt="${p.brand}" class="product-card__brand-logo" title="${p.brand}">`
        : p.brand;

      return `
      <article class="product-card" data-category="${category}">
        <div class="product-card__badges">
          <span class="stock-badge ${p.badge === 'Popular' ? 'hot' : ''}">${p.badge}</span>
        </div>
        <button class="wishlist-btn" aria-label="Save ${p.title} to wishlist">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
          </svg>
        </button>
        <div class="product-card__img-wrap">
          <img src="${p.img}" alt="${p.title}" class="product-card__img">
        </div>
        <div class="product-card__body">
          <div class="product-card__meta">
            <span class="product-card__brand">${brandMarkup}</span>
            <div class="product-card__rating">
              <span class="stars">${p.rating}</span>
              <span class="count">${p.reviews}</span>
            </div>
          </div>
          <h3 class="product-card__title">${p.title}</h3>
          <div class="product-card__price-row">
            <div class="product-card__price">${p.price}</div>
            <span class="shipping-tag">Free Shipping</span>
          </div>
          <button class="btn-add-to-cart" aria-label="Add ${p.title} to cart" data-name="${p.title}" data-price="${p.price}">
            <svg class="cart-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
            </svg>
            <span class="btn-text">Add to Cart</span>
          </button>
        </div>
      </article>
    `;
    }).join('');

    // Reattach wishlist click events to newly created cards
    carousel.querySelectorAll('.wishlist-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        btn.classList.toggle('active');
        const svg = btn.querySelector('svg');
        svg.setAttribute('fill', btn.classList.contains('active') ? 'currentColor' : 'none');
      });
    });

    // Reattach Add to Cart events
    setupCartButtons();
  }

  // Initial call to attach cart buttons on page load
  setupCartButtons();

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      renderFavourites(btn.dataset.tab);
    });
  });

  if (prevBtn && nextBtn && carousel) {
    prevBtn.addEventListener('click', () => {
      carousel.scrollBy({ left: -280, behavior: 'smooth' });
    });
    nextBtn.addEventListener('click', () => {
      carousel.scrollBy({ left: 280, behavior: 'smooth' });
    });
  }

  // 3. Interactive Before/After Split Sliders
  const baVisuals = document.querySelectorAll('.ba-visual');
  baVisuals.forEach(visual => {
    const divider = visual.querySelector('.ba-divider');
    const beforeHalf = visual.querySelector('.ba-half--before');
    const beforeImg = beforeHalf ? beforeHalf.querySelector('img') : null;

    function syncImageWidth() {
      if (beforeImg) {
        beforeImg.style.width = `${visual.offsetWidth}px`;
      }
    }
    syncImageWidth();
    window.addEventListener('resize', syncImageWidth);

    let isDragging = false;

    function updateSplit(clientX) {
      const rect = visual.getBoundingClientRect();
      let percent = ((clientX - rect.left) / rect.width) * 100;
      percent = Math.max(5, Math.min(95, percent));
      
      divider.style.left = `${percent}%`;
      beforeHalf.style.width = `${percent}%`;
    }

    visual.addEventListener('mousedown', (e) => {
      isDragging = true;
      updateSplit(e.clientX);
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      updateSplit(e.clientX);
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    // Touch support
    visual.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) updateSplit(e.touches[0].clientX);
    }, { passive: true });

    visual.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) updateSplit(e.touches[0].clientX);
    }, { passive: true });
  });

  // 4. Video Box Interactive Simulation
  const videoBox = document.getElementById('videoBox');
  if (videoBox) {
    videoBox.addEventListener('click', () => {
      const isPlaying = videoBox.classList.toggle('playing');
      const progressBar = videoBox.querySelector('.video-progress__bar');
      const timeDisplay = videoBox.querySelector('.video-time');
      
      if (isPlaying) {
        progressBar.style.transition = 'width 15s linear';
        progressBar.style.width = '100%';
        timeDisplay.textContent = '0:14 / 0:21';
      } else {
        progressBar.style.transition = 'none';
        progressBar.style.width = '25%';
        timeDisplay.textContent = '0:00 / 0:21';
      }
    });
  }

  // 5. Mobile Menu Toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = mainNav.classList.toggle('is-open');
      menuToggle.classList.toggle('active', isOpen);
      menuToggle.setAttribute('aria-expanded', isOpen);
      document.body.classList.toggle('menu-open', isOpen);
    });

    // Close mobile nav when clicking any link
    mainNav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('is-open');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-open');
      });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (mainNav.classList.contains('is-open') && !mainNav.contains(e.target) && !menuToggle.contains(e.target)) {
        mainNav.classList.remove('is-open');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-open');
      }
    });
  }

  // Topbar Offer Carousel Autoplay
  startOfferRotation();
});

// Topbar Offer Carousel Controls
let currentOfferIdx = 0;
let offerInterval = null;

function renderOfferSlide(idx) {
  const slides = document.querySelectorAll('.offer-slide');
  if (!slides || slides.length === 0) return;
  if (idx < 0) idx = slides.length - 1;
  if (idx >= slides.length) idx = 0;
  currentOfferIdx = idx;

  slides.forEach((slide, i) => {
    if (i === currentOfferIdx) {
      slide.classList.add('active');
    } else {
      slide.classList.remove('active');
    }
  });
}

window.nextOffer = function() {
  renderOfferSlide(currentOfferIdx + 1);
  startOfferRotation();
};

window.prevOffer = function() {
  renderOfferSlide(currentOfferIdx - 1);
  startOfferRotation();
};

function startOfferRotation() {
  if (offerInterval) clearInterval(offerInterval);
  offerInterval = setInterval(() => {
    renderOfferSlide(currentOfferIdx + 1);
  }, 4500);
}

// Commercial Janitorial Quote Submission Feedback
function handleJanitorialSubmit(form) {
  const companyInput = form.querySelector('#jCompany');
  const companyName = companyInput ? companyInput.value.trim() : 'your business';
  const submitBtn = form.querySelector('.janitorial-submit-btn');
  const originalHtml = submitBtn ? submitBtn.innerHTML : '';

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>✓ Request Sent Successfully!</span>';
    submitBtn.style.backgroundColor = '#15803d';
  }

  // Show toast if available
  const cartToast = document.getElementById('cartToast');
  const cartToastName = document.getElementById('cartToastName');
  if (cartToast && cartToastName) {
    cartToastName.textContent = `Quote Request sent for ${companyName}`;
    cartToast.classList.add('show');
    setTimeout(() => cartToast.classList.remove('show'), 4000);
  }

  setTimeout(() => {
    form.reset();
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalHtml;
      submitBtn.style.backgroundColor = '';
    }
  }, 3500);
}

