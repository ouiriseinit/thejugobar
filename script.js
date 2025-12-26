/* script.js
  Client-side cart simulation using localStorage.
  No external dependencies.
*/

const CART_KEY = "jugo_cart_v1";

/* Utilities */
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));
const format = n => "$" + Number(n).toFixed(2);

/* Load/Save cart */
function readCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || { items: {} };
  } catch(e) {
    return { items: {} };
  }
}
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}
while (localStorage.getItem(CART_KEY) === null) {
  saveCart({ items: {} });
}
/* Cart model helpers */
function addItem(productId, meta) {
  const cart = readCart();
  if (!cart.items[productId]) {
    cart.items[productId] = { ...meta, qty: 0 };
  }
  cart.items[productId].qty += 1;
  saveCart(cart);
  renderCart();
}
function setQty(productId, qty) {
  const cart = readCart();
  if (!cart.items[productId]) return;
  cart.items[productId].qty = Math.max(0, qty);
  if (cart.items[productId].qty === 0) delete cart.items[productId];
  saveCart(cart);
  renderCart();
}
function clearCart() {
  saveCart({ items: {} });
  renderCart();
}

/* UI rendering */
function calcTotals(cart) {
  let subtotal = 0, qty = 0;
  for (const id in cart.items) {
    const it = cart.items[id];
    subtotal += Number(it.price) * it.qty;
    qty += it.qty;
  }
  return { subtotal, qty };
}

function renderCart() {
  const cart = readCart();
  const $count = $("#cart-count");
  const $items = $("#cart-items");
  const $subtotal = $("#cart-subtotal");
  $items.innerHTML = "";

  const { subtotal, qty } = calcTotals(cart);
  $count.textContent = qty;
  $subtotal.textContent = format(subtotal);

  if (qty === 0) {
    $items.innerHTML = "<p style='color:#666;margin:8px 0;'>Your cart is empty.</p>";
    $("#checkout").disabled = true;
    return;
  }

  for (const id in cart.items) {
    const it = cart.items[id];
    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <img src="${it.image}" alt="${it.title}" />
      <div class="item-info">
        <div class="item-title">${it.title}</div>
        <div class="item-qty">
          <button class="qty-btn" data-action="dec" data-id="${id}">-</button>
          <span data-qty>${it.qty}</span>
          <button class="qty-btn" data-action="inc" data-id="${id}">+</button>
          <span style="margin-left:auto;font-weight:700">${format(it.price * it.qty)}</span>
        </div>
      </div>
    `;
    $items.appendChild(row);
  }

  $("#checkout").disabled = false;
}
/* Hook product add buttons */
function wireAddButtons() {
  const addBtns = $$(".add-to-cart");
  addBtns.forEach(btn => {
    btn.addEventListener("click", e => {
      const card = e.target.closest(".product-card");
      const id = card.dataset.id;
      const price = parseFloat(card.dataset.price);
      const title = card.querySelector(".product-title").textContent.trim();
      const img = card.querySelector("img").getAttribute("src");
      addItem(id, { price, title, image: img });
      openCart(); // show feedback
    });
  });
}

/* Cart drawer open/close */
const $drawer = $("#cart-drawer");
const $overlay = $("#overlay");
function openCart() {
  $drawer.setAttribute("aria-hidden", "false");
  $overlay.hidden = false;
}
function closeCart() {
  $drawer.setAttribute("aria-hidden", "true");
  $overlay.hidden = true;
}

/* Event delegation for cart interactions */
function wireCartInteractions() {
  $("#cart-toggle").addEventListener("click", () => {
    const hidden = $drawer.getAttribute("aria-hidden") === "true";
    if (hidden) openCart(); else closeCart();
  });
  $("#cart-close").addEventListener("click", closeCart);
  $overlay.addEventListener("click", closeCart);

  $("#clear-cart").addEventListener("click", () => {
    if (confirm("Clear cart?")) clearCart();
  });

  // Qty buttons (delegated)
  $("#cart-items").addEventListener("click", (e) => {
    const btn = e.target.closest(".qty-btn");
    if (!btn) return;
    const action = btn.dataset.action;
    const id = btn.dataset.id;
    const cart = readCart();
    if (!cart.items[id]) return;
    if (action === "inc") setQty(id, cart.items[id].qty + 1);
    if (action === "dec") setQty(id, cart.items[id].qty - 1);
  });
}

async function fetchProducts() {
  fetch("products.json")
  .then(response => response.json())
  .then(data => {
    renderShop(data.products)}
  );
}

function renderShop(products) {
  const grid = document.getElementById("product-grid");
  if (grid) {
    products.forEach(item => {
      const card = document.createElement("div");
      card.className = "product-card";
      card.innerHTML = `
        <img src="${item.img}" alt="${item.name}" class="product-img">
        <h3>${item.name}</h3>
        <p class="price">$${item.price.toFixed(2)}</p>
        <button class="add-to-cart" data-id="${item.id}">
          Add to Cart
        </button>
      `;
      grid.appendChild(card);
    });
  }
}

function renderProductPage(productId) {
  
}

/* Init */
async function init() {
  wireAddButtons();
  wireCartInteractions();
  renderCart();
  const products = await fetchProducts();
  if (products) renderShop(products);

  // Accessibility: close cart on Escape
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeCart();
  });
}



document.addEventListener("DOMContentLoaded", init);
