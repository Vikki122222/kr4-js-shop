// Практическая №18: самостоятельная доработка — корзина, reduce и localStorage.
// В localStorage сохраняются только id товара и количество, не данные формы.
const CART_STORAGE_KEY = 'kr4-js-shop-cart';

function readCart() {
    try {
        const saved = localStorage.getItem(CART_STORAGE_KEY);
        const items = saved === null ? [] : JSON.parse(saved);
        if (!Array.isArray(items)) return [];
        return items.filter((item) =>
            item && Number.isInteger(item.productId) &&
            Number.isInteger(item.quantity) && item.quantity > 0 &&
            products.some((product) => product.id === item.productId)
        );
    } catch (error) {
        console.warn('Не удалось прочитать корзину:', error);
        return [];
    }
}

let cartItems = readCart();

function saveCart() {
    try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
        return true;
    } catch (error) {
        console.warn('Не удалось сохранить корзину:', error);
        return false;
    }
}

function getCartCount() {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
}

function updateCartCounter() {
    document.querySelectorAll('[data-cart-count]').forEach((element) => {
        element.textContent = String(getCartCount());
    });
}

function addToCart(productId) {
    const product = products.find((item) => item.id === productId);
    if (!product || !product.isAvailable) return false;
    const existing = cartItems.find((item) => item.productId === productId);
    if (existing) {
        existing.quantity += 1;
    } else {
        cartItems.push({ productId, quantity: 1 });
    }
    const saved = saveCart();
    updateCartCounter();
    renderCart();
    return saved;
}

function removeFromCart(productId) {
    cartItems = cartItems.filter((item) => item.productId !== productId);
    saveCart();
    updateCartCounter();
    renderCart();
}

function getCartTotal() {
    return cartItems.reduce((sum, item) => {
        const product = products.find((p) => p.id === item.productId);
        return sum + (product ? product.price * item.quantity : 0);
    }, 0);
}

function renderCart() {
    const container = document.querySelector('[data-cart-container]');
    if (!container) return;
    const empty = document.querySelector('.cart-empty');
    const total = document.querySelector('.cart-total');
    container.replaceChildren();
    if (empty) empty.hidden = cartItems.length !== 0;
    if (total) {
        total.textContent = `Итого: ${getCartTotal().toLocaleString('ru-RU')} руб.`;
        total.hidden = cartItems.length === 0;
    }

    cartItems.forEach((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (!product) return;

        const card = document.createElement('article');
        card.classList.add('cart-item');
        const title = document.createElement('h2');
        title.textContent = product.title;
        const quantity = document.createElement('p');
        quantity.textContent = `Количество: ${item.quantity}`;
        const price = document.createElement('p');
        price.textContent = `Стоимость: ${(product.price * item.quantity).toLocaleString('ru-RU')} руб.`;
        const remove = document.createElement('button');
        remove.type = 'button';
        remove.classList.add('button', 'cart-remove');
        remove.dataset.removeProductId = String(item.productId);
        remove.textContent = 'Удалить';
        card.append(title, quantity, price, remove);
        container.append(card);
    });
}

const cartContainer = document.querySelector('[data-cart-container]');
if (cartContainer) {
    cartContainer.addEventListener('click', (event) => {
        const button = event.target.closest('[data-remove-product-id]');
        if (!button || !cartContainer.contains(button)) return;
        removeFromCart(Number(button.dataset.removeProductId));
    });
}
updateCartCounter();
renderCart();
