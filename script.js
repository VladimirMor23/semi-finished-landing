const products = [
  {
    id: "pelmeni-classic",
    name: "Пельмени домашние",
    category: "dumplings",
    categoryName: "Пельмени",
    description: "Сочные пельмени с начинкой из свинины и говядины.",
    price: 590,
    weight: 0.5,
    weightLabel: "500 г",
    emoji: "🥟",
    color: "orange"
  },
  {
    id: "pelmeni-chicken",
    name: "Пельмени с курицей",
    category: "dumplings",
    categoryName: "Пельмени",
    description: "Нежная курица, лук и ароматные домашние специи.",
    price: 560,
    weight: 0.5,
    weightLabel: "500 г",
    emoji: "🥟",
    color: "yellow"
  },
  {
    id: "vareniki-potato",
    name: "Вареники с картофелем",
    category: "vareniki",
    categoryName: "Вареники",
    description: "Картофель, жареный лук и немного сливочного масла.",
    price: 420,
    weight: 0.5,
    weightLabel: "500 г",
    emoji: "🥟",
    color: "purple"
  },
  {
    id: "vareniki-cherry",
    name: "Вареники с вишней",
    category: "vareniki",
    categoryName: "Вареники",
    description: "Сочная вишня в тонком мягком тесте.",
    price: 490,
    weight: 0.5,
    weightLabel: "500 г",
    emoji: "🍒",
    color: "red"
  },
  {
    id: "cutlets-home",
    name: "Котлеты домашние",
    category: "cutlets",
    categoryName: "Котлеты",
    description: "Сочные котлеты из свинины и говядины.",
    price: 650,
    weight: 0.6,
    weightLabel: "600 г",
    emoji: "🍔",
    color: "green"
  },
  {
    id: "cutlets-chicken",
    name: "Котлеты куриные",
    category: "cutlets",
    categoryName: "Котлеты",
    description: "Лёгкие куриные котлеты с зеленью.",
    price: 610,
    weight: 0.6,
    weightLabel: "600 г",
    emoji: "🍗",
    color: "yellow"
  },
  {
    id: "syrniki",
    name: "Сырники творожные",
    category: "breakfast",
    categoryName: "Завтраки",
    description: "Нежные сырники для вкусного и быстрого завтрака.",
    price: 450,
    weight: 0.4,
    weightLabel: "400 г",
    emoji: "🥞",
    color: "cream"
  },
  {
    id: "blinchiki",
    name: "Блинчики с творогом",
    category: "breakfast",
    categoryName: "Завтраки",
    description: "Тонкие блинчики с нежной творожной начинкой.",
    price: 480,
    weight: 0.4,
    weightLabel: "400 г",
    emoji: "🥞",
    color: "orange"
  }
];

const storageKey = "semiFinishedLandingCart";

let cart = loadCart();

const header = document.getElementById("header");
const navigation = document.getElementById("navigation");
const mobileMenuButton = document.getElementById("mobileMenuButton");

const categoryList = document.getElementById("categoryList");
const productsGrid = document.getElementById("productsGrid");

const openCartButton = document.getElementById("openCartButton");
const closeCartButton = document.getElementById("closeCartButton");
const cartOverlay = document.getElementById("cartOverlay");
const cartSidebar = document.getElementById("cartSidebar");

const cartItems = document.getElementById("cartItems");
const cartCounter = document.getElementById("cartCounter");
const cartButtonPrice = document.getElementById("cartButtonPrice");
const cartItemsCount = document.getElementById("cartItemsCount");
const cartWeight = document.getElementById("cartWeight");
const cartTotal = document.getElementById("cartTotal");
const openCheckoutButton = document.getElementById("openCheckoutButton");

const checkoutModal = document.getElementById("checkoutModal");
const closeCheckoutButton = document.getElementById("closeCheckoutButton");
const checkoutForm = document.getElementById("checkoutForm");
const formMessage = document.getElementById("formMessage");

function loadCart() {
  try {
    const savedCart = localStorage.getItem(storageKey);

    if (!savedCart) {
      return [];
    }

    const parsedCart = JSON.parse(savedCart);

    if (!Array.isArray(parsedCart)) {
      return [];
    }

    return parsedCart.filter((item) => {
      return (
        item &&
        typeof item.id === "string" &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0 &&
        products.some((product) => product.id === item.id)
      );
    });
  } catch (error) {
    console.error("Не удалось загрузить корзину:", error);
    return [];
  }
}

function saveCart() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(cart));
  } catch (error) {
    console.error("Не удалось сохранить корзину:", error);
  }
}

function formatPrice(value) {
  return `${Number(value).toLocaleString("ru-RU")} ₽`;
}

function formatWeight(value) {
  if (value === 0) {
    return "0 кг";
  }

  return `${Number(value).toLocaleString("ru-RU", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  })} кг`;
}

function getProduct(productId) {
  return products.find((product) => product.id === productId);
}

function getCartQuantity() {
  return cart.reduce((total, item) => total + item.quantity, 0);
}

function getCartTotal() {
  return cart.reduce((total, item) => {
    const product = getProduct(item.id);

    if (!product) {
      return total;
    }

    return total + product.price * item.quantity;
  }, 0);
}

function getCartWeight() {
  return cart.reduce((total, item) => {
    const product = getProduct(item.id);

    if (!product) {
      return total;
    }

    return total + product.weight * item.quantity;
  }, 0);
}

function renderProducts(category = "all") {
  if (!productsGrid) {
    return;
  }

  const filteredProducts = category === "all"
    ? products
    : products.filter((product) => product.category === category);

  productsGrid.innerHTML = filteredProducts.map((product) => {
    return `
      <article class="product-card">
        <div class="product-image product-image-${product.color}">
          <span class="product-emoji">${product.emoji}</span>
          <span class="product-weight">${product.weightLabel}</span>
        </div>

        <div class="product-info">
          <span class="product-category">${product.categoryName}</span>
          <h3>${product.name}</h3>
          <p>${product.description}</p>

          <div class="product-bottom">
            <div class="product-price">
              <strong>${formatPrice(product.price)}</strong>
              <span>${product.weightLabel}</span>
            </div>

            <button
              class="add-to-cart"
              type="button"
              data-product-id="${product.id}"
            >
              Добавить
            </button>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

function renderCart() {
  const quantity = getCartQuantity();
  const total = getCartTotal();
  const weight = getCartWeight();

  cartCounter.textContent = quantity;
  cartButtonPrice.textContent = formatPrice(total);
  cartItemsCount.textContent = `${quantity} шт.`;
  cartWeight.textContent = formatWeight(weight);
  cartTotal.textContent = formatPrice(total);
  openCheckoutButton.disabled = cart.length === 0;

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="empty-cart">
        <span class="empty-cart-icon">🛒</span>
        <h3>Корзина пока пуста</h3>
        <p>Добавьте блюда из каталога, чтобы оформить заказ.</p>
      </div>
    `;

    return;
  }

  cartItems.innerHTML = cart.map((item) => {
    const product = getProduct(item.id);

    if (!product) {
      return "";
    }

    const itemTotal = product.price * item.quantity;
    const itemWeight = product.weight * item.quantity;

    return `
      <div class="cart-item">
        <div class="cart-item-image">${product.emoji}</div>

        <div class="cart-item-info">
          <h3>${product.name}</h3>
          <div class="cart-item-meta">
            ${formatWeight(itemWeight)} · ${formatPrice(product.price)} за упаковку
          </div>

          <div class="cart-item-bottom">
            <div class="quantity-controls">
              <button
                class="quantity-button"
                type="button"
                data-action="decrease"
                data-product-id="${product.id}"
                aria-label="Уменьшить количество"
              >
                −
              </button>

              <span class="quantity-value">${item.quantity}</span>

              <button
                class="quantity-button"
                type="button"
                data-action="increase"
                data-product-id="${product.id}"
                aria-label="Увеличить количество"
              >
                +
              </button>

              <button
                class="remove-item"
                type="button"
                data-action="remove"
                data-product-id="${product.id}"
                aria-label="Удалить товар"
              >
                ×
              </button>
            </div>

            <strong class="cart-item-price">${formatPrice(itemTotal)}</strong>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

function addToCart(productId) {
  const product = getProduct(productId);

  if (!product) {
    return;
  }

  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: productId,
      quantity: 1
    });
  }

  saveCart();
  renderCart();
  showAddedButton(productId);
}

function changeQuantity(productId, change) {
  const item = cart.find((cartItem) => cartItem.id === productId);

  if (!item) {
    return;
  }

  item.quantity += change;

  if (item.quantity <= 0) {
    cart = cart.filter((cartItem) => cartItem.id !== productId);
  }

  saveCart();
  renderCart();
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  saveCart();
  renderCart();
}

function showAddedButton(productId) {
  const button = document.querySelector(
    `.add-to-cart[data-product-id="${productId}"]`
  );

  if (!button) {
    return;
  }

  const originalText = button.textContent;

  button.classList.add("added");
  button.textContent = "Добавлено";

  window.setTimeout(() => {
    button.classList.remove("added");
    button.textContent = originalText;
  }, 1200);
}

function openCart() {
  cartSidebar.classList.add("open");
  cartOverlay.classList.add("visible");
  document.body.classList.add("no-scroll");
}

function closeCart() {
  cartSidebar.classList.remove("open");
  cartOverlay.classList.remove("visible");

  if (!checkoutModal.classList.contains("visible")) {
    document.body.classList.remove("no-scroll");
  }
}

function openCheckout() {
  if (cart.length === 0) {
    return;
  }

  closeCart();
  checkoutModal.classList.add("visible");
  document.body.classList.add("no-scroll");
  formMessage.textContent = "";
  formMessage.className = "form-message";
}

function closeCheckout() {
  checkoutModal.classList.remove("visible");
  document.body.classList.remove("no-scroll");
}

function closeAllWindows() {
  closeCart();
  closeCheckout();
}

function showFormMessage(message, type) {
  formMessage.textContent = message;
  formMessage.className = `form-message ${type}`;
}

function handleCheckoutSubmit(event) {
  event.preventDefault();

  const formData = new FormData(checkoutForm);
  const name = String(formData.get("name") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const address = String(formData.get("address") || "").trim();

  if (!name || !phone || !address) {
    showFormMessage("Заполните имя, телефон и адрес доставки.", "error");
    return;
  }

  const orderNumber = Math.floor(1000 + Math.random() * 9000);
  const orderTotal = formatPrice(getCartTotal());
  const orderWeight = formatWeight(getCartWeight());

  showFormMessage(
    `Спасибо! Заказ №${orderNumber} принят. Сумма: ${orderTotal}, вес: ${orderWeight}. Мы скоро свяжемся с вами.`,
    "success"
  );

  checkoutForm.reset();
  cart = [];
  saveCart();
  renderCart();

  window.setTimeout(() => {
    closeCheckout();
  }, 5000);
}

function toggleMobileMenu() {
  const isOpen = navigation.classList.toggle("open");

  mobileMenuButton.classList.toggle("active", isOpen);
  mobileMenuButton.setAttribute("aria-expanded", String(isOpen));
}

function closeMobileMenu() {
  navigation.classList.remove("open");
  mobileMenuButton.classList.remove("active");
  mobileMenuButton.setAttribute("aria-expanded", "false");
}

function handleScroll() {
  header.classList.toggle("scrolled", window.scrollY > 10);
}

categoryList.addEventListener("click", (event) => {
  const button = event.target.closest(".category-button");

  if (!button) {
    return;
  }

  document.querySelectorAll(".category-button").forEach((categoryButton) => {
    categoryButton.classList.remove("active");
  });

  button.classList.add("active");
  renderProducts(button.dataset.category);
});

productsGrid.addEventListener("click", (event) => {
  const button = event.target.closest(".add-to-cart");

  if (!button) {
    return;
  }

  addToCart(button.dataset.productId);
});

cartItems.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");

  if (!button) {
    return;
  }

  const productId = button.dataset.productId;
  const action = button.dataset.action;

  if (action === "increase") {
    changeQuantity(productId, 1);
  }

  if (action === "decrease") {
    changeQuantity(productId, -1);
  }

  if (action === "remove") {
    removeFromCart(productId);
  }
});

openCartButton.addEventListener("click", openCart);
closeCartButton.addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

openCheckoutButton.addEventListener("click", openCheckout);
closeCheckoutButton.addEventListener("click", closeCheckout);

checkoutModal.addEventListener("click", (event) => {
  if (event.target === checkoutModal) {
    closeCheckout();
  }
});

checkoutForm.addEventListener("submit", handleCheckoutSubmit);

mobileMenuButton.addEventListener("click", toggleMobileMenu);

navigation.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    closeMobileMenu();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeAllWindows();
    closeMobileMenu();
  }
});

window.addEventListener("scroll", handleScroll);

renderProducts();
renderCart();
handleScroll();