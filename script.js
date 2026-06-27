// ============================================
// IronGear Auto Parts — App Logic
// ============================================

const productGrid = document.getElementById('productGrid');
const searchInput = document.getElementById('searchInput');
const clearSearchBtn = document.getElementById('clearSearch');
const resultCount = document.getElementById('resultCount');
const emptyState = document.getElementById('emptyState');
const resetBtn = document.getElementById('resetBtn');
const cartCountEl = document.getElementById('cartCount');
const categoryFilters = document.getElementById('categoryFilters');

let activeCategory = 'all';
let searchTerm = '';
let cartCount = 0;

const categoryLabels = {
  engine: 'Engine',
  brake: 'Brakes',
  suspension: 'Suspension',
  electrical: 'Electrical',
  body: 'Body',
  filter: 'Filters'
};

// Maps each category to its product photo/illustration.
// If an image fails to load, the card falls back to the Bootstrap icon automatically.
const categoryImages = {
  engine: 'images/cat-engine.svg',
  brake: 'images/cat-brake.svg',
  suspension: 'images/cat-suspension.svg',
  electrical: 'images/cat-electrical.svg',
  body: 'images/cat-body.svg',
  filter: 'images/cat-filter.svg'
};

function formatPrice(num) {
  return 'Rs ' + num.toLocaleString('en-PK');
}

function getFilteredProducts() {
  return products.filter(p => {
    const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm) ||
                           p.fits.toLowerCase().includes(searchTerm) ||
                           categoryLabels[p.category].toLowerCase().includes(searchTerm);
    return matchesCategory && matchesSearch;
  });
}

function renderProducts() {
  const filtered = getFilteredProducts();

  if (filtered.length === 0) {
    productGrid.innerHTML = '';
    emptyState.classList.remove('d-none');
  } else {
    emptyState.classList.add('d-none');
    productGrid.innerHTML = filtered.map(buildCardHTML).join('');
  }

  // Update result count text
  if (searchTerm === '' && activeCategory === 'all') {
    resultCount.textContent = `Showing all ${products.length} parts`;
  } else {
    resultCount.textContent = `Showing ${filtered.length} result${filtered.length !== 1 ? 's' : ''}`;
  }

  attachAddToCartHandlers();
}

function buildCardHTML(p) {
  const lowStock = p.stock <= 8;
  let tagHTML = '';
  if (p.tag === 'Best Seller') {
    tagHTML = `<span class="product-tag tag-best">Best Seller</span>`;
  } else if (p.tag === 'Low Stock') {
    tagHTML = `<span class="product-tag tag-low">Low Stock</span>`;
  }

  const priceHTML = p.oldPrice
    ? `<span class="price-old">${formatPrice(p.oldPrice)}</span><span class="price-now">${formatPrice(p.price)}</span>`
    : `<span class="price-now">${formatPrice(p.price)} <span>PKR</span></span>`;

  return `
    <div class="col-md-6 col-lg-4 col-xl-3">
      <div class="product-card">
        <div class="product-media">
          ${tagHTML}
          <img src="${categoryImages[p.category]}" alt="${p.name}" class="product-img"
               onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
          <div class="product-img-fallback" style="display:none;"><i class="bi ${p.icon}"></i></div>
        </div>
        <div class="product-body">
          <p class="product-cat">${categoryLabels[p.category]}</p>
          <h3 class="product-name">${p.name}</h3>
          <p class="product-fits"><i class="bi bi-car-front"></i> ${p.fits}</p>
          <div class="stock-row">
            <span><span class="stock-dot ${lowStock ? 'low' : ''}"></span>${p.stock} in stock</span>
          </div>
          <div class="product-footer">
            <div class="price-block">${priceHTML}</div>
            <button class="add-btn" data-id="${p.id}" aria-label="Add ${p.name} to cart">
              <i class="bi bi-plus-lg"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function attachAddToCartHandlers() {
  document.querySelectorAll('.add-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      cartCount++;
      cartCountEl.textContent = cartCount;

      const icon = btn.querySelector('i');
      btn.classList.add('added');
      icon.className = 'bi bi-check-lg';

      setTimeout(() => {
        btn.classList.remove('added');
        icon.className = 'bi bi-plus-lg';
      }, 1000);
    });
  });
}

// ---- Search ----
searchInput.addEventListener('input', (e) => {
  searchTerm = e.target.value.trim().toLowerCase();
  clearSearchBtn.classList.toggle('d-none', searchTerm === '');
  renderProducts();
});

clearSearchBtn.addEventListener('click', () => {
  searchInput.value = '';
  searchTerm = '';
  clearSearchBtn.classList.add('d-none');
  renderProducts();
  searchInput.focus();
});

resetBtn.addEventListener('click', () => {
  searchInput.value = '';
  searchTerm = '';
  activeCategory = 'all';
  clearSearchBtn.classList.add('d-none');
  document.querySelectorAll('.cat-chip').forEach(c => c.classList.remove('active'));
  document.querySelector('.cat-chip[data-cat="all"]').classList.add('active');
  renderProducts();
});

// ---- Category filter chips ----
categoryFilters.addEventListener('click', (e) => {
  const chip = e.target.closest('.cat-chip');
  if (!chip) return;

  document.querySelectorAll('.cat-chip').forEach(c => c.classList.remove('active'));
  chip.classList.add('active');
  activeCategory = chip.dataset.cat;
  renderProducts();
});

// ---- Initial render ----
renderProducts();
