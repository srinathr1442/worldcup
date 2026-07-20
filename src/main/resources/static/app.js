/* ==========================================================================
   FIFA JERSEY STORE — APP LOGIC
   Vanilla JS, no dependencies. Handles: sticky navbar shadow, mobile menu,
   search overlay, wishlist/cart counters, quick view, accordion (FAQ),
   newsletter form, and image placeholders for empty src attributes.
   ========================================================================== */

(function () {
  'use strict';

  /* ------------------------------------------------------------------ */
  /* State                                                               */
  /* ------------------------------------------------------------------ */
  var state = {
    wishlist: new Set(),
    cartCount: 0
  };

  /* ------------------------------------------------------------------ */
  /* Utilities                                                           */
  /* ------------------------------------------------------------------ */
  function qs(sel, ctx) { return (ctx || document).querySelector(sel); }
  function qsa(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  var toastEl = null;
  var toastTimer = null;
  function showToast(message) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'toast';
      toastEl.setAttribute('role', 'status');
      toastEl.setAttribute('aria-live', 'polite');
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = message;
    toastEl.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.classList.remove('is-visible');
    }, 2200);
  }

  /* ------------------------------------------------------------------ */
  /* Image placeholders — avoid broken-image icons for empty src=""     */
  /* ------------------------------------------------------------------ */
  function initImagePlaceholders() {
    qsa('img').forEach(function (img) {
      if (!img.getAttribute('src')) {
        img.removeAttribute('src');
      }
    });
  }

  /* ------------------------------------------------------------------ */
  /* Sticky navbar shadow on scroll                                      */
  /* ------------------------------------------------------------------ */
  function initNavbarScroll() {
    var navbar = qs('#navbar');
    if (!navbar) return;
    function update() {
      if (window.scrollY > 8) {
        navbar.classList.add('is-scrolled');
      } else {
        navbar.classList.remove('is-scrolled');
      }
    }
    update();
    window.addEventListener('scroll', update, { passive: true });
  }

  /* ------------------------------------------------------------------ */
  /* Mobile menu toggle                                                  */
  /* ------------------------------------------------------------------ */
  function initMobileMenu() {
    var btn = qs('#hamburgerBtn');
    var menu = qs('#mobileMenu');
    if (!btn || !menu) return;

    function closeMenu() {
      menu.hidden = true;
      btn.setAttribute('aria-expanded', 'false');
    }
    function openMenu() {
      menu.hidden = false;
      btn.setAttribute('aria-expanded', 'true');
    }

    btn.addEventListener('click', function () {
      var isOpen = btn.getAttribute('aria-expanded') === 'true';
      isOpen ? closeMenu() : openMenu();
    });

    qsa('.mobile-nav-link', menu).forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  }

  /* ------------------------------------------------------------------ */
  /* Search overlay                                                       */
  /* ------------------------------------------------------------------ */
  function initSearch() {
    var openBtn = qs('#searchBtn');
    var overlay = qs('#searchOverlay');
    var closeBtn = qs('#searchClose');
    var input = qs('#searchInput');
    var form = qs('#searchForm');
    if (!openBtn || !overlay) return;

    function open() {
      overlay.hidden = false;
      if (input) input.focus();
    }
    function close() {
      overlay.hidden = true;
      openBtn.focus();
    }

    openBtn.addEventListener('click', function () {
      overlay.hidden ? open() : close();
    });
    if (closeBtn) closeBtn.addEventListener('click', close);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !overlay.hidden) close();
    });
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var query = (input && input.value.trim()) || '';
        if (query) {
          showToast('Searching for "' + query + '"\u2026');
        }
        close();
        if (input) input.value = '';
      });
    }
  }

  /* ------------------------------------------------------------------ */
  /* Wishlist (header count + per-card buttons)                          */
  /* ------------------------------------------------------------------ */
  function updateWishlistBadge() {
    var badge = qs('#wishlistCount');
    if (badge) badge.textContent = String(state.wishlist.size);
  }

  function initWishlist() {
    updateWishlistBadge();

    qsa('.product-card .wishlist-btn, .best-seller-card .wishlist-btn').forEach(function (btn, index) {
      // Ensure every wishlist button has a stable identity for the demo state.
      var id = btn.closest('[data-player]')
        ? btn.closest('[data-player]').getAttribute('data-player')
        : 'item-' + index;

      btn.addEventListener('click', function () {
        var nameEl = btn.closest('.product-card, .best-seller-card');
        var name = nameEl ? (qs('.product-player-name, .best-seller-name', nameEl) || {}).textContent : 'Item';

        if (state.wishlist.has(id)) {
          state.wishlist.delete(id);
          btn.classList.remove('is-active');
          showToast((name || 'Item') + ' removed from wishlist');
        } else {
          state.wishlist.add(id);
          btn.classList.add('is-active');
          showToast((name || 'Item') + ' added to wishlist');
        }
        updateWishlistBadge();
      });
    });

    var headerWishlistBtn = qs('#wishlistBtn');
    if (headerWishlistBtn) {
      headerWishlistBtn.addEventListener('click', function () {
        var count = state.wishlist.size;
        showToast(count === 0 ? 'Your wishlist is empty' : count + ' item(s) in your wishlist');
      });
    }
  }

  /* ------------------------------------------------------------------ */
  /* Cart (header count + add-to-cart buttons)                           */
  /* ------------------------------------------------------------------ */
  function updateCartBadge() {
    var badge = qs('#cartCount');
    if (badge) badge.textContent = String(state.cartCount);
  }

  function initCart() {
    updateCartBadge();

    qsa('.add-to-cart-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.cartCount += 1;
        updateCartBadge();

        var card = btn.closest('.product-card, .best-seller-card');
        var name = card
          ? (qs('.product-player-name, .best-seller-name', card) || {}).textContent
          : 'Item';
        showToast((name || 'Item') + ' added to cart');
      });
    });

    var headerCartBtn = qs('#cartBtn');
    if (headerCartBtn) {
      headerCartBtn.addEventListener('click', function () {
        showToast(state.cartCount === 0
          ? 'Your cart is empty'
          : state.cartCount + ' item(s) in your cart');
      });
    }
  }

  /* ------------------------------------------------------------------ */
  /* Profile button (placeholder action)                                 */
  /* ------------------------------------------------------------------ */
  function initProfile() {
    var btn = qs('#profileBtn');
    if (!btn) return;
    btn.addEventListener('click', function () {
      showToast('Sign in to view your profile');
    });
  }

  /* ------------------------------------------------------------------ */
  /* Quick view (product cards)                                          */
  /* ------------------------------------------------------------------ */
  function initQuickView() {
    qsa('.quick-view-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var card = btn.closest('.product-card');
        var name = card ? (qs('.product-player-name', card) || {}).textContent : 'this jersey';
        showToast('Quick view: ' + (name || 'this jersey'));
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /* Size selection (visual state only)                                  */
  /* ------------------------------------------------------------------ */
  function initSizeOptions() {
    qsa('.product-sizes').forEach(function (group) {
      qsa('.size-option', group).forEach(function (opt) {
        opt.setAttribute('role', 'button');
        opt.setAttribute('tabindex', '0');
        function select() {
          qsa('.size-option', group).forEach(function (o) {
            o.style.borderColor = '';
            o.style.backgroundColor = '';
          });
          opt.style.borderColor = 'var(--pitch-900)';
          opt.style.backgroundColor = 'var(--chalk-dim)';
        }
        opt.addEventListener('click', select);
        opt.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            select();
          }
        });
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /* FAQ accordion                                                       */
  /* ------------------------------------------------------------------ */
  function initAccordion() {
    qsa('.accordion-trigger').forEach(function (trigger) {
      var panel = document.getElementById(trigger.getAttribute('aria-controls'));
      if (!panel) return;

      trigger.addEventListener('click', function () {
        var isOpen = trigger.getAttribute('aria-expanded') === 'true';
        trigger.setAttribute('aria-expanded', String(!isOpen));
        panel.hidden = isOpen;
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /* Newsletter form                                                      */
  /* ------------------------------------------------------------------ */
  function initNewsletter() {
    var form = qs('#newsletterForm');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = qs('#newsletterEmail', form);
      var email = input ? input.value.trim() : '';
      if (!email) return;
      showToast('Thanks for joining the squad!');
      form.reset();
    });
  }

  /* ------------------------------------------------------------------ */
  /* Init                                                                 */
  /* ------------------------------------------------------------------ */
  function init() {
    initImagePlaceholders();
    initNavbarScroll();
    initMobileMenu();
    initSearch();
    initWishlist();
    initCart();
    initProfile();
    initQuickView();
    initSizeOptions();
    initAccordion();
    initNewsletter();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();