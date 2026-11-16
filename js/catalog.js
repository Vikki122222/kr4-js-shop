
/*
 * Контрольная работа №4
 * Каталог товаров: поиск, фильтрация, сортировка и корзина.
 * Практические работы №17–18.
 */

// Находим элементы каталога на странице
const productsContainer = document.querySelector('[data-products-container]');
const searchInput = document.querySelector('#catalog-search');
const categoryFilter = document.querySelector('#category-filter');
const sortSelect = document.querySelector('#sort-select');
const catalogCount = document.querySelector('.catalog-count');
const catalogEmpty = document.querySelector('.catalog-empty');

// Храним текущие настройки каталога
const catalogState = {
    query: '',
    category: 'all',
    sort: 'default'
};

// Поиск товаров по названию
function searchProducts(products, query) {
    const normalizedQuery = query.trim().toLowerCase();

    // Если поиск пустой, показываем все товары
    if (normalizedQuery === '') {
        return products;
    }

    return products.filter((product) =>
        product.title.toLowerCase().includes(normalizedQuery)
    );
}

// Фильтрация товаров по выбранной категории
function filterProductsByCategory(products, category) {
    if (category === 'all') {
        return products;
    }

    return products.filter((product) => product.category === category);
}

// Сортировка товаров по цене или названию
function sortProducts(products, sortType) {
    // Создаём копию, чтобы не изменять исходный массив
    const productsCopy = [...products];

    if (sortType === 'price-asc') {
        return productsCopy.sort((a, b) => a.price - b.price);
    }

    if (sortType === 'price-desc') {
        return productsCopy.sort((a, b) => b.price - a.price);
    }

    if (sortType === 'title-asc') {
        return productsCopy.sort((a, b) => a.title.localeCompare(b.title));
    }

    return productsCopy;
}

// Применяем поиск, фильтрацию и сортировку вместе
function getPreparedProducts(products, state) {
    let result = [...products];

    result = searchProducts(result, state.query);
    result = filterProductsByCategory(result, state.category);
    result = sortProducts(result, state.sort);

    return result;
}

// Форматируем цену в рублях
function formatPrice(price) {
    return `${price.toLocaleString('ru-RU')} руб.`;
}

// Создаём HTML-карточку товара через JavaScript
function createProductCard(product) {
    const card = document.createElement('article');
    card.classList.add('product-card');

    // Выделяем карточку костюма Афины
    if (product.id === 1) {
        card.classList.add('product-card--featured');
    }

    // Добавляем фотографию товара или заглушку
    let imageContainer;

    if (product.image) {
        imageContainer = document.createElement(product.id === 1 ? 'a' : 'div');
        imageContainer.classList.add('product-card__image-link');

        if (product.id === 1) {
            imageContainer.href = 'product.html';
        }

        const image = document.createElement('img');
        image.classList.add('product-card__image');
        image.src = product.image;
        image.alt = product.title;
        image.loading = 'lazy';

        // Для Афины используем изображения разных размеров
        if (product.id === 1) {
            image.srcset = 'images/athena-480.jpg 480w, images/athena-640.jpg 640w, images/athena-960.jpg 960w';
            image.sizes = '(max-width: 639px) calc(100vw - 48px), (max-width: 1023px) 50vw, 33vw';
            image.width = 640;
            image.height = 853;
        }

        // Дополнительный стиль изображения второго товара
        if (product.id === 2) {
            image.classList.add('product-card__image--moon');
        }

        imageContainer.append(image);
    } else {
        // Если фотографии нет, показываем текстовую заглушку
        imageContainer = document.createElement('div');
        imageContainer.classList.add('product-card__image-placeholder');
        imageContainer.textContent = 'Фото костюма';
    }

    // Создаём название товара
    const title = document.createElement('h3');
    title.classList.add('product-card__title');
    title.textContent = product.title;

    // Добавляем описание товара
    const description = document.createElement('p');
    description.classList.add('product-card__description');
    description.textContent = product.description;

    // Выводим цену товара
    const price = document.createElement('p');
    price.classList.add('product-card__price');
    price.textContent = `Цена: ${formatPrice(product.price)}`;

    // Показываем наличие товара
    const status = document.createElement('p');
    status.classList.add('product-card__status');
    status.textContent = product.isAvailable ? 'В наличии' : 'Нет в наличии';

    // Для Афины добавляем ссылку на подробную страницу
    if (product.id === 1) {
        const detailsLink = document.createElement('a');
        detailsLink.classList.add('button', 'button--primary', 'product-card__button');
        detailsLink.href = 'product.html';
        detailsLink.textContent = 'Подробнее';

        card.append(imageContainer, title, description, price, status, detailsLink);
    } else {
        card.append(imageContainer, title, description, price, status);
    }

    // Создаём кнопку добавления товара в корзину
    const button = document.createElement('button');
    button.classList.add('button', 'button--primary', 'product-card__button');
    button.type = 'button';
    button.textContent = 'В корзину';
    button.dataset.action = 'add-to-cart';
    button.dataset.productId = String(product.id);

    // Отключаем кнопку, если товара нет в наличии
    if (!product.isAvailable) {
        button.disabled = true;
        button.textContent = 'Недоступно';
        button.classList.add('product-card__button--unavailable');
    }

    card.append(button);

    return card;
}

// Выводим карточки товаров на страницу
function renderProducts(productsToRender) {
    if (!productsContainer) {
        return;
    }

    // Очищаем каталог перед обновлением
    productsContainer.textContent = '';

    // Показываем количество найденных товаров
    if (catalogCount) {
        catalogCount.textContent = `Найдено товаров: ${productsToRender.length}`;
    }

    // Если товаров нет, показываем сообщение
    if (catalogEmpty) {
        catalogEmpty.hidden = productsToRender.length > 0;
    }

    // Создаём и добавляем карточки в каталог
    productsToRender.forEach((product) => {
        productsContainer.append(createProductCard(product));
    });
}

// Обновляем каталог после изменения настроек
function updateCatalog() {
    const preparedProducts = getPreparedProducts(products, catalogState);
    renderProducts(preparedProducts);
}

// Подключаем обработчики событий каталога
if (!productsContainer) {
    console.warn('Контейнер товаров не найден. Проверьте data-products-container.');
} else {

    // Обновляем товары при вводе поискового запроса
    if (searchInput) {
        searchInput.addEventListener('input', (event) => {
            catalogState.query = event.target.value;
            updateCatalog();
        });
    }

    // Обновляем товары при выборе категории
    if (categoryFilter) {
        categoryFilter.addEventListener('change', (event) => {
            catalogState.category = event.target.value;
            updateCatalog();
        });
    }

    // Обновляем товары при изменении сортировки
    if (sortSelect) {
        sortSelect.addEventListener('change', (event) => {
            catalogState.sort = event.target.value;
            updateCatalog();
        });
    }

    // Обрабатываем нажатие кнопки «В корзину»
    productsContainer.addEventListener('click', (event) => {
        const button = event.target.closest('[data-action="add-to-cart"]');

        // Проверяем, что нажали нужную кнопку
        if (!button || !productsContainer.contains(button)) {
            return;
        }

        // Находим выбранный товар по его ID
        const productId = Number(button.dataset.productId);
        const selectedProduct = products.find((product) => product.id === productId);

        if (!selectedProduct) {
            console.warn('Товар не найден:', productId);
            return;
        }

        // Не добавляем недоступный товар
        if (!selectedProduct.isAvailable) {
            return;
        }

        // Добавляем товар в корзину
        const added = addToCart(selectedProduct.id);

        // Показываем сообщение о результате добавления
        const feedback = document.querySelector('.catalog-cart-message');

        if (feedback) {
            feedback.textContent = added
                ? `Товар «${selectedProduct.title}» добавлен в корзину.`
                : 'Не удалось сохранить корзину.';
        }
    });

    // Показываем товары при загрузке страницы
    updateCatalog();
}
