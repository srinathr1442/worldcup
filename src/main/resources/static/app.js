/**
 * FutbolKits — app.js
 * -----------------------------------------------------------------------
 * Handles:
 *   1. Fetching the product catalog from the Java backend (GET /api/products)
 *   2. Rendering product cards from a <template>
 *   3. League filter + price sort (delegated to the backend via query params,
 *      with a client-side fallback/search on top so typing feels instant)
 *   4. Cart state (in-memory), badge count, drawer UI
 *   5. Posting the cart to the backend on checkout (POST /api/cart)
 * -----------------------------------------------------------------------
 * NOTE: If you're opening index.html directly as a file:// URL, fetch()
 * calls to the backend will fail CORS/security checks. Serve this folder
 * with a static server (or let the Spring Boot app serve it) while the
 * backend runs on http://localhost:8080.
 */

// ---------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------
const API_BASE = "http://localhost:8080/api";

// ---------------------------------------------------------------------
// Application state
// ---------------------------------------------------------------------
const state = {
  allProducts: [],   // full catalog as last fetched from the server
  league: "all",     // currently selected league filter
  sort: "none",      // "none" | "asc" | "desc"
  searchTerm: "",     // free-text search
  cart: [],           // { productId, name, price, size, qty, imageUrl }
};

// ---------------------------------------------------------------------
// DOM references
// ---------------------------------------------------------------------
const productGrid = document.getElementById("productGrid");
const productCardTemplate = document.getElementById("productCardTemplate");
const emptyState = document.getElementById("emptyState");
const resultCount = document.getElementById("resultCount");

const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const leagueFiltersContainer = document.getElementById("leagueFilters");

const cartTrigger = document.getElementById("cartTrigger");
const cartBadge = document.getElementById("cartBadge");
const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");
const cartClose = document.getElementById("cartClose");
const cartItemsEl = document.getElementById("cartItems");
const cartEmptyMsg = document.getElementById("cartEmptyMsg");
const cartSubtotalEl = document.getElementById("cartSubtotal");
const checkoutBtn = document.getElementById("checkoutBtn");

// ---------------------------------------------------------------------
// Init
// ---------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  fetchProducts();
  bindEvents();
});

function bindEvents() {
  searchInput.addEventListener("input", (e) => {
    state.searchTerm = e.target.value.trim().toLowerCase();
    renderProducts();
  });

  sortSelect.addEventListener("change", (e) => {
    state.sort = e.target.value;
    fetchProducts(); // re-fetch so backend sort param is exercised
  });

  leagueFiltersContainer.addEventListener("change", (e) => {
    if (e.target.name === "league") {
      state.league = e.target.value;
      fetchProducts();
    }
  });

  cartTrigger.addEventListener("click", openCart);
  cartClose.addEventListener("click", closeCart);
  cartOverlay.addEventListener("click", closeCart);
  checkoutBtn.addEventListener("click", handleCheckout);
}

// ---------------------------------------------------------------------
// Fetching products
// ---------------------------------------------------------------------
async function fetchProducts() {
  productGrid.setAttribute("aria-busy", "true");

  const params = new URLSearchParams();
  if (state.league && state.league !== "all") params.set("league", state.league);
  if (state.sort && state.sort !== "none") params.set("sort", state.sort);

  const url = `${API_BASE}/products${params.toString() ? `?${params}` : ""}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Server responded with ${res.status}`);
    const data = await res.json();
    state.allProducts = data;
  } catch (err) {
    console.error("Failed to load products from backend:", err);
    // Fallback so the UI still demos nicely if the backend isn't running
    state.allProducts = state.allProducts.length ? state.allProducts : FALLBACK_PRODUCTS;
  } finally {
    renderProducts();
    productGrid.removeAttribute("aria-busy");
  }
}

// ---------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------
function renderProducts() {
  const term = state.searchTerm;

  const visible = state.allProducts.filter((p) => {
    if (!term) return true;
    return (
      p.name.toLowerCase().includes(term) ||
      p.team.toLowerCase().includes(term) ||
      p.league.toLowerCase().includes(term)
    );
  });

  productGrid.innerHTML = "";

  visible.forEach((product) => {
    const node = productCardTemplate.content.cloneNode(true);

    const numberEl = node.querySelector("[data-number]");
    const leagueEl = node.querySelector("[data-league]");
    const nameEl = node.querySelector("[data-name]");
    const priceEl = node.querySelector("[data-price]");
    const sizeSelect = node.querySelector("[data-size-select]");
    const addBtn = node.querySelector("[data-add-btn]");

    numberEl.textContent = shirtNumberFor(product.id);
    leagueEl.textContent = product.league;
    nameEl.textContent = product.name;
    priceEl.textContent = formatPrice(product.price);

    addBtn.addEventListener("click", () => {
      addToCart(product, sizeSelect.value);
      flashAdded(addBtn);
    });

    productGrid.appendChild(node);
  });

  resultCount.textContent = visible.length;
  emptyState.hidden = visible.length !== 0;
}

/** Deterministic "shirt number" badge derived from the product id, purely decorative. */
function shirtNumberFor(id) {
  const num = Math.abs(hashCode(id)) % 23 + 1;
  return `#${num}`;
}

function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

function formatPrice(value) {
  return `$${Number(value).toFixed(2)}`;
}

function flashAdded(button) {
  const original = button.textContent;
  button.textContent = "Added ✓";
  button.classList.add("just-added");
  setTimeout(() => {
    button.textContent = original;
    button.classList.remove("just-added");
  }, 900);
}

// ---------------------------------------------------------------------
// Cart logic
// ---------------------------------------------------------------------
function addToCart(product, size) {
  const existing = state.cart.find((i) => i.productId === product.id && i.size === size);

  if (existing) {
    existing.qty += 1;
  } else {
    state.cart.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      size,
      qty: 1,
    });
  }

  renderCart();
  updateCartBadge();
}

function updateQty(productId, size, delta) {
  const item = state.cart.find((i) => i.productId === productId && i.size === size);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    state.cart = state.cart.filter((i) => !(i.productId === productId && i.size === size));
  }

  renderCart();
  updateCartBadge();
}

function removeFromCart(productId, size) {
  state.cart = state.cart.filter((i) => !(i.productId === productId && i.size === size));
  renderCart();
  updateCartBadge();
}

function cartCount() {
  return state.cart.reduce((sum, i) => sum + i.qty, 0);
}

function cartSubtotal() {
  return state.cart.reduce((sum, i) => sum + i.qty * i.price, 0);
}

function updateCartBadge() {
  const count = cartCount();
  cartBadge.textContent = count;
  cartBadge.style.display = count > 0 ? "grid" : "none";
}

function renderCart() {
  cartItemsEl.querySelectorAll(".cart-line").forEach((el) => el.remove());
  cartEmptyMsg.hidden = state.cart.length > 0;

  state.cart.forEach((item) => {
    const line = document.createElement("div");
    line.className = "cart-line";
    line.innerHTML = `
      <div class="cart-line-swatch"></div>
      <div class="cart-line-info">
        <h4>${escapeHtml(item.name)}</h4>
        <div class="cart-line-meta">Size ${escapeHtml(item.size)}</div>
        <div class="cart-line-controls">
          <button class="qty-btn" data-action="dec" aria-label="Decrease quantity">−</button>
          <span>${item.qty}</span>
          <button class="qty-btn" data-action="inc" aria-label="Increase quantity">+</button>
        </div>
        <button class="cart-line-remove" data-action="remove">Remove</button>
      </div>
      <div class="cart-line-price">${formatPrice(item.price * item.qty)}</div>
    `;

    line.querySelector('[data-action="inc"]').addEventListener("click", () =>
      updateQty(item.productId, item.size, 1)
    );
    line.querySelector('[data-action="dec"]').addEventListener("click", () =>
      updateQty(item.productId, item.size, -1)
    );
    line.querySelector('[data-action="remove"]').addEventListener("click", () =>
      removeFromCart(item.productId, item.size)
    );

    cartItemsEl.insertBefore(line, cartEmptyMsg);
  });

  cartSubtotalEl.textContent = formatPrice(cartSubtotal());
  checkoutBtn.disabled = state.cart.length === 0;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// ---------------------------------------------------------------------
// Cart drawer open/close
// ---------------------------------------------------------------------
function openCart() {
  cartDrawer.classList.add("open");
  cartOverlay.classList.add("visible");
}

function closeCart() {
  cartDrawer.classList.remove("open");
  cartOverlay.classList.remove("visible");
}

// ---------------------------------------------------------------------
// Checkout — POST /api/cart
// ---------------------------------------------------------------------
async function handleCheckout() {
  if (state.cart.length === 0) return;

  checkoutBtn.disabled = true;
  checkoutBtn.textContent = "Processing…";

  try {
    const res = await fetch(`${API_BASE}/cart`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: state.cart, subtotal: cartSubtotal() }),
    });

    if (!res.ok) throw new Error(`Checkout failed with status ${res.status}`);

    const result = await res.json();
    alert(result.message || "Order received! Thanks for supporting your team.");

    state.cart = [];
    renderCart();
    updateCartBadge();
    closeCart();
  } catch (err) {
    console.error("Checkout error:", err);
    alert("We couldn't reach the server to complete checkout. Please try again.");
  } finally {
    checkoutBtn.disabled = state.cart.length === 0;
    checkoutBtn.textContent = "Checkout";
  }
}

// ---------------------------------------------------------------------
// Fallback data — only used if the Java backend is unreachable, so the
// front end still has something to render during local UI development.
// ---------------------------------------------------------------------
const FALLBACK_PRODUCTS = [
  { id: "bra-2026-home", name: "Brazil 2026 Home", team: "Brazil", league: "World Cup", price: 94.99 },
  { id: "arg-2026-home", name: "Argentina 2026 Home", team: "Argentina", league: "World Cup", price: 94.99 },
  { id: "fra-2026-away", name: "France 2026 Away", team: "France", league: "World Cup", price: 89.99 },
  { id: "ita-retro-home", name: "Italy Retro Home", team: "Italy", league: "Serie A", price: 79.99 },
  { id: "mci-2026-home", name: "Man City 2026 Home", team: "Manchester City", league: "Premier League", price: 84.99 },
  { id: "rma-2026-home", name: "Real Madrid 2026 Home", team: "Real Madrid", league: "La Liga", price: 99.99 },
];
