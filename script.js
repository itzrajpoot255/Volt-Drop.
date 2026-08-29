// cart + wishlist helpers — both just live in localStorage as JSON

function getCart() {
  try {
    return JSON.parse(localStorage.getItem('cart')) || [];
  } catch {
    return [];
  }
}
function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function getWishlist() {
  try {
    return JSON.parse(localStorage.getItem('wishlist')) || [];
  } catch {
    return [];
  }
}
function saveWishlist(list) {
  localStorage.setItem('wishlist', JSON.stringify(list));
}

function getCartQty(id) {
  const item = getCart().find(i => i.id === id);
  return item ? item.qty : 0;
}

// stock left = original stock minus whatever's already sitting in the cart.
// this way we never have to physically edit the PRODUCTS array to "use up" stock
function getRemainingStock(product) {
  return Math.max(0, product.stock - getCartQty(product.id));
}


// ---- product grid ----

function renderProducts(list) {
  const grid = document.getElementById('productGrid');
  const noResults = document.getElementById('noResults');
  grid.innerHTML = '';

  if (list.length === 0) {
    noResults.classList.remove('d-none');
    return;
  }
  noResults.classList.add('d-none');

  const wishlist = getWishlist();

  list.forEach(p => {
    const remaining = getRemainingStock(p);
    const soldOut = remaining === 0;
    const isWished = wishlist.includes(p.id);

    const col = document.createElement('div');
    col.className = 'col-6 col-md-4 col-lg-3 mb-4';

    col.innerHTML = `
      <div class="product-card ${soldOut ? 'sold-out-card' : ''}">
        ${p.trending ? '<span class="ribbon">TRENDING</span>' : ''}
        <button class="wishlist-btn ${isWished ? 'active' : ''}" data-wish-id="${p.id}" title="Save to wishlist">
          ${isWished ? '♥' : '♡'}
        </button>
        <img src="${p.image}" alt="${p.name}" data-modal-id="${p.id}">
        <div class="card-body">
          <span class="badge-category">${p.category}</span>
          <h6 class="card-title">${p.name}</h6>
          <p class="small mb-1">Rs ${p.price.toLocaleString()} &nbsp;·&nbsp; ⭐ ${p.rating}</p>
          <p class="small ${remaining <= 3 && !soldOut ? 'stock-low' : 'stock-ok'}">
            ${soldOut ? 'Sold Out' : 'Only ' + remaining + ' left'}
          </p>
          <button class="btn btn-accent btn-sm w-100 mt-auto" data-add-id="${p.id}" ${soldOut ? 'disabled' : ''}>
            ${soldOut ? 'Sold Out' : 'Add to Cart'}
          </button>
        </div>
      </div>`;
    grid.appendChild(col);
  });
}

// small horizontal strip up top, just pulls whatever has trending: true
function renderTrendingStrip() {
  const strip = document.getElementById('trendingStrip');
  const trendingItems = PRODUCTS.filter(p => p.trending);
  const cards = trendingItems.map(p => `
    <div class="trending-card" data-modal-id="${p.id}">
      <img src="${p.image}" alt="${p.name}">
      <p>${p.name}</p>
    </div>
  `).join('');

  strip.innerHTML = cards + `
    <div class="trending-card trending-view-all" data-shop-category="all">
      <div class="trending-view-all-box">View All →</div>
      <p>Full Catalog</p>
    </div>`;
}
document.getElementById('trendingStrip').addEventListener('click', (e) => {
  const shopBtn = e.target.closest('[data-shop-category]');
  if (shopBtn) { shopCategory(shopBtn.dataset.shopCategory); return; }

  const card = e.target.closest('[data-modal-id]');
  if (card) openProductModal(Number(card.dataset.modalId));
});


// ---- countdown ----
// change this to whenever the drop should actually close (Pakistan Standard Time, UTC+5)
const DROP_CLOSE_DATE = '2026-09-15T18:00:00+05:00';
let countdownTimerId = null;

function startCountdown(targetDate) {
  const daysEl = document.getElementById('cdDays');
  const hoursEl = document.getElementById('cdHours');
  const minutesEl = document.getElementById('cdMinutes');
  const secondsEl = document.getElementById('cdSeconds');

  countdownTimerId = setInterval(() => {
    const diff = new Date(targetDate) - new Date();

    if (diff <= 0) {
      daysEl.textContent = hoursEl.textContent = minutesEl.textContent = secondsEl.textContent = '00';
      clearInterval(countdownTimerId);
      return;
    }

    daysEl.textContent = String(Math.floor(diff / 86400000)).padStart(2, '0');
    hoursEl.textContent = String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0');
    minutesEl.textContent = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
    secondsEl.textContent = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
  }, 1000);
}

// small live clock showing current Pakistan time (PKT, UTC+5), just for that "real drop" feel
function startPakistanClock() {
  const el = document.getElementById('pktClock');
  if (!el) return;
  setInterval(() => {
    const now = new Date();
    const pkTime = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Karachi',
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
    }).format(now);
    el.textContent = `${pkTime} PKT`;
  }, 1000);
}



// ---- search / filter / sort, all in one go ----

function applyFilters() {
  const query = document.getElementById('search').value.toLowerCase().trim();
  const category = document.getElementById('categoryFilter').value;
  const maxPrice = Number(document.getElementById('priceFilter').value);
  const sortBy = document.getElementById('sortSelect').value;

  let filtered = PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(query) &&
    (category === 'all' || p.category === category) &&
    p.price <= maxPrice
  );

  if (sortBy === 'price-asc') filtered.sort((a, b) => a.price - b.price);
  if (sortBy === 'price-desc') filtered.sort((a, b) => b.price - a.price);
  if (sortBy === 'rating-desc') filtered.sort((a, b) => b.rating - a.rating);

  renderProducts(filtered);
}

['search', 'categoryFilter', 'priceFilter', 'sortSelect'].forEach(id =>
  document.getElementById(id).addEventListener('input', applyFilters)
);


// ---- product modal ----

const productModal = new bootstrap.Modal(document.getElementById('productModal'));
let modalProductId = null;

function openProductModal(id) {
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return;
  modalProductId = id;

  document.getElementById('modalTitle').textContent = product.name;
  document.getElementById('modalDesc').textContent = product.description;
  document.getElementById('modalPrice').textContent = 'Rs ' + product.price.toLocaleString();
  document.getElementById('modalImage').src = product.image;

  document.getElementById('modalSizes').innerHTML =
    product.sizes.map(s => `<span class="size-chip">US ${s}</span>`).join('');

  document.getElementById('modalColors').innerHTML =
    product.colors.map(c => `<span class="color-dot" style="background:${c}"></span>`).join('');

  const addBtn = document.getElementById('modalAddBtn');
  const remaining = getRemainingStock(product);
  addBtn.disabled = remaining === 0;
  addBtn.textContent = remaining === 0 ? 'Sold Out' : 'Add to Cart';

  productModal.show();
}

// one listener on the whole grid handles every product image click
document.getElementById('productGrid').addEventListener('click', (e) => {
  const img = e.target.closest('[data-modal-id]');
  if (img) openProductModal(Number(img.dataset.modalId));
});

document.getElementById('modalAddBtn').addEventListener('click', () => {
  if (modalProductId !== null) addToCart(modalProductId);
  productModal.hide();
});


// ---- wishlist ----

function toggleWishlist(id) {
  let list = getWishlist();
  if (list.includes(id)) {
    list = list.filter(x => x !== id);
  } else {
    list.push(id);
  }
  saveWishlist(list);
  renderWishlist();
  applyFilters();
}

function renderWishlist() {
  const wishlist = getWishlist();
  const ul = document.getElementById('wishlistItems');
  const emptyMsg = document.getElementById('wishlistEmptyMsg');
  const countBadge = document.getElementById('wishlistCount');

  ul.innerHTML = '';
  countBadge.textContent = wishlist.length;
  emptyMsg.classList.toggle('d-none', wishlist.length > 0);

  wishlist.forEach(id => {
    const p = PRODUCTS.find(prod => prod.id === id);
    if (!p) return;
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${p.name} — Rs ${p.price.toLocaleString()}</span>
      <button class="btn btn-sm btn-outline-light" data-remove-wish="${p.id}">Remove</button>`;
    ul.appendChild(li);
  });
}

document.getElementById('productGrid').addEventListener('click', (e) => {
  const btn = e.target.closest('[data-wish-id]');
  if (btn) toggleWishlist(Number(btn.dataset.wishId));
});

document.getElementById('wishlistItems').addEventListener('click', (e) => {
  const btn = e.target.closest('[data-remove-wish]');
  if (btn) toggleWishlist(Number(btn.dataset.removeWish));
});


// ---- cart ----

function addToCart(id) {
  const product = PRODUCTS.find(p => p.id === id);
  if (!product || getRemainingStock(product) <= 0) return;

  const cart = getCart();
  const existing = cart.find(item => item.id === id);
  existing ? existing.qty++ : cart.push({ id, qty: 1 });

  saveCart(cart);
  renderCart();
  applyFilters();
  showToast(`${product.name} added to cart`);
}

function changeQty(id, delta) {
  let cart = getCart();
  const item = cart.find(i => i.id === id);
  if (!item) return;

  const product = PRODUCTS.find(p => p.id === id);
  if (delta > 0 && getRemainingStock(product) <= 0) return; // don't let it go past stock

  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(i => i.id !== id);

  saveCart(cart);
  renderCart();
  applyFilters();
}

function removeFromCart(id) {
  const cart = getCart().filter(i => i.id !== id);
  saveCart(cart);
  renderCart();
  applyFilters();
}

// discount codes — hardcoded, no backend involved
let activeDiscountPercent = 0;
const VALID_CODES = { VOLT10: 10, DROP20: 20 };

document.getElementById('applyDiscountBtn').addEventListener('click', () => {
  const code = document.getElementById('discountInput').value.trim().toUpperCase();
  const msg = document.getElementById('discountMsg');

  if (VALID_CODES[code]) {
    activeDiscountPercent = VALID_CODES[code];
    msg.textContent = `Code applied: ${activeDiscountPercent}% off ✅`;
    msg.className = 'small mb-2 text-accent';
  } else {
    activeDiscountPercent = 0;
    msg.textContent = 'Invalid code ❌';
    msg.className = 'small mb-2 text-danger';
  }
  renderCart();
});

function renderCart() {
  const cart = getCart();
  const list = document.getElementById('cartItems');
  const emptyMsg = document.getElementById('cartEmptyMsg');
  const countBadge = document.getElementById('cartCount');

  list.innerHTML = '';
  let subtotal = 0;
  let totalQty = 0;

  cart.forEach(item => {
    const product = PRODUCTS.find(p => p.id === item.id);
    if (!product) return;
    subtotal += product.price * item.qty;
    totalQty += item.qty;

    const li = document.createElement('li');
    li.innerHTML = `
      <span>${product.name}<br><small class="text-muted-light">Rs ${product.price.toLocaleString()} each</small></span>
      <span class="d-flex align-items-center gap-2">
        <button class="qty-btn" data-qty-id="${product.id}" data-delta="-1">−</button>
        <span>${item.qty}</span>
        <button class="qty-btn" data-qty-id="${product.id}" data-delta="1">+</button>
        <button class="btn btn-sm btn-outline-danger" data-remove-id="${product.id}">✕</button>
      </span>`;
    list.appendChild(li);
  });

  emptyMsg.classList.toggle('d-none', cart.length > 0);
  countBadge.textContent = totalQty;

  const discountAmount = Math.round(subtotal * (activeDiscountPercent / 100));
  const total = subtotal - discountAmount;

  document.getElementById('cartSubtotal').textContent = 'Rs ' + subtotal.toLocaleString();
  document.getElementById('cartDiscount').textContent = '- Rs ' + discountAmount.toLocaleString();
  document.getElementById('cartTotal').textContent = 'Rs ' + total.toLocaleString();
}

document.getElementById('cartItems').addEventListener('click', (e) => {
  const qtyBtn = e.target.closest('[data-qty-id]');
  if (qtyBtn) changeQty(Number(qtyBtn.dataset.qtyId), Number(qtyBtn.dataset.delta));

  const removeBtn = e.target.closest('[data-remove-id]');
  if (removeBtn) removeFromCart(Number(removeBtn.dataset.removeId));
});

document.getElementById('productGrid').addEventListener('click', (e) => {
  const btn = e.target.closest('[data-add-id]');
  if (btn) addToCart(Number(btn.dataset.addId));
});


// ---- checkout ----

const checkoutModal = new bootstrap.Modal(document.getElementById('checkoutModal'));

document.getElementById('openCheckoutBtn').addEventListener('click', () => {
  if (getCart().length === 0) {
    showToast('Your cart is empty');
    return;
  }
  checkoutModal.show();
});

const checkoutForm = document.getElementById('checkoutForm');
checkoutForm.addEventListener('submit', function (e) {
  e.preventDefault();
  e.stopPropagation();

  if (!checkoutForm.checkValidity()) {
    checkoutForm.classList.add('was-validated');
    return;
  }

  // no real payment gateway hooked up — just simulating a successful order
  localStorage.removeItem('cart');
  activeDiscountPercent = 0;

  document.getElementById('orderSuccess').classList.remove('d-none');
  checkoutForm.reset();
  checkoutForm.classList.remove('was-validated');

  renderCart();
  applyFilters();
  showToast('Order placed successfully!');

  setTimeout(() => {
    checkoutModal.hide();
    document.getElementById('orderSuccess').classList.add('d-none');
  }, 1800);
});


// ---- toast ----

const toastEl = document.getElementById('cartToast');
const toast = new bootstrap.Toast(toastEl, { delay: 2000 });

function showToast(message) {
  document.getElementById('toastMsg').textContent = message;
  toast.show();
}


// ---- theme toggle ----

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  document.getElementById('themeToggle').textContent = theme === 'dark' ? '🌙' : '☀️';
  localStorage.setItem('theme', theme);
}

document.getElementById('themeToggle').addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
});


// if the cart/wishlist changes in another open tab, catch up here too
window.addEventListener('storage', (e) => {
  if (e.key === 'cart' || e.key === 'wishlist') {
    renderCart();
    renderWishlist();
    applyFilters();
  }
});


// clicking a category card (or footer link) jumps to the grid filtered to that category
function shopCategory(category) {
  document.getElementById('categoryFilter').value = category;
  applyFilters();
  document.getElementById('shopGrid').scrollIntoView({ behavior: 'smooth' });
}
document.querySelectorAll('[data-shop-category]').forEach(el => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    shopCategory(el.dataset.shopCategory);
  });
});


// ---- kick everything off ----

applyTheme(localStorage.getItem('theme') || 'dark');
renderTrendingStrip();
renderProducts(PRODUCTS);
startCountdown(DROP_CLOSE_DATE);
startPakistanClock();
renderCart();
renderWishlist();
