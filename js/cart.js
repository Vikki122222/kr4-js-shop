
/*
 * Контрольная работа №4
 * Корзина товаров: добавление, удаление, подсчёт суммы и localStorage.
 * Практическая работа №18.
 */

// Ключ для сохранения корзины в браузере
const CART_STORAGE_KEY = 'kr4-js-shop-cart';

// Загружаем сохранённую корзину из localStorage
function readCart() {
    try {
        const saved = localStorage.getItem(CART_STORAGE_KEY);
        const items = saved === null ? [] : JSON.parse(saved);

        // Проверяем, что полученные данные являются массивом
        if (!Array.isArray(items)) return [];

        // Оставляем только корректные товары и количество
        return items.filter((item) =>
            item &&
            Number.isInteger(item.productId) &&
            Number.isInteger(item.quantity) &&
            item.quantity > 0 &&
            products.some((product) => product.id === item.productId)
        );
    } catch (error) {
        console.warn('Не удалось прочитать корзину:', error);
        return [];
    }
}

// Храним текущие товары корзины
let cartItems = readCart();

// Сохраняем корзину в браузере
function saveCart() {
    try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
        return true;
    } catch (error) {
        console.warn('Не удалось сохранить корзину:', error);
        return false;
    }
}

// Считаем общее количество товаров в корзине
function getCartCount() {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
}

// Обновляем счётчик корзины в меню
function updateCartCounter() {
    document.querySelectorAll('[data-cart-count]').forEach((element) => {
        element.textContent = String(getCartCount());
    });
}

// Добавляем выбранный товар в корзину
function addToCart(productId) {
    // Находим товар по его ID
    const product = products.find((item) => item.id === productId);

    // Недоступный товар добавлять нельзя
    if (!product || !product.isAvailable) return false;

    // Проверяем, есть ли товар уже в корзине
    const existing = cartItems.find((item) => item.productId === productId);

    if (existing) {
        // Если товар уже есть, увеличиваем количество
        existing.quantity += 1;
    } else {
        // Если товара нет, добавляем новую позицию
        cartItems.push({ productId, quantity: 1 });
    }

    // Сохраняем изменения и обновляем страницу
    const saved = saveCart();
    updateCartCounter();
    renderCart();

    return saved;
}

// Удаляем товар из корзины
function removeFromCart(productId) {
    cartItems = cartItems.filter((item) => item.productId !== productId);

    // Сохраняем изменения и обновляем корзину
    saveCart();
    updateCartCounter();
    renderCart();
}

// Считаем общую стоимость товаров через reduce
function getCartTotal() {
    return cartItems.reduce((sum, item) => {
        const product = products.find((p) => p.id === item.productId);

        // Учитываем цену и количество каждого товара
        return sum + (product ? product.price * item.quantity : 0);
    }, 0);
}

// Выводим содержимое корзины на страницу
function renderCart() {
    // Находим элементы страницы корзины
    const container = document.querySelector('[data-cart-container]');
    if (!container) return;

    const empty = document.querySelector('.cart-empty');
    const total = document.querySelector('.cart-total');

    // Очищаем старые карточки товаров
    container.replaceChildren();

    // Показываем сообщение, если корзина пустая
    if (empty) empty.hidden = cartItems.length !== 0;

    // Выводим итоговую стоимость товаров
    if (total) {
        total.textContent = `Итого: ${getCartTotal().toLocaleString('ru-RU')} руб.`;
        total.hidden = cartItems.length === 0;
    }

    // Создаём карточку для каждого товара в корзине
    cartItems.forEach((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (!product) return;

        // Создаём блок товара
        const card = document.createElement('article');
        card.classList.add('cart-item');

        // Название товара
        const title = document.createElement('h2');
        title.textContent = product.title;

        // Количество товара
        const quantity = document.createElement('p');
        quantity.textContent = `Количество: ${item.quantity}`;

        // Стоимость с учётом количества
        const price = document.createElement('p');
        price.textContent = `Стоимость: ${(product.price * item.quantity).toLocaleString('ru-RU')} руб.`;

        // Кнопка удаления товара
        const remove = document.createElement('button');
        remove.type = 'button';
        remove.classList.add('button', 'cart-remove');
        remove.dataset.removeProductId = String(item.productId);
        remove.textContent = 'Удалить';

        // Добавляем элементы в карточку и на страницу
        card.append(title, quantity, price, remove);
        container.append(card);
    });
}

// Находим контейнер корзины
const cartContainer = document.querySelector('[data-cart-container]');

// Обрабатываем нажатие кнопки «Удалить»
if (cartContainer) {
    cartContainer.addEventListener('click', (event) => {
        const button = event.target.closest('[data-remove-product-id]');

        if (!button || !cartContainer.contains(button)) return;

        removeFromCart(Number(button.dataset.removeProductId));
    });
}

// Показываем счётчик и корзину при загрузке страницы
updateCartCounter();
renderCart();
