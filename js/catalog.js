// Практическая работа №17: DOM и события каталога.
const productsContainer = document.querySelector('[data-products-container]');
const searchInput = document.querySelector('#catalog-search');
const categoryFilter = document.querySelector('#category-filter');
const sortSelect = document.querySelector('#sort-select');
const catalogCount = document.querySelector('.catalog-count');
const catalogEmpty = document.querySelector('.catalog-empty');

const catalogState = {
    query: '',
    category: 'all',
    sort: 'default'
};

function searchProducts(products, query) {
    const normalizedQuery = query.trim().toLowerCase();
    if (normalizedQuery === '') {
        return products;
    }
    return products.filter((product) =>
        product.title.toLowerCase().includes(normalizedQuery)
    );
}

function filterProductsByCategory(products, category) {
    if (category === 'all') {
        return products;
    }
    return products.filter((product) => product.category === category);
}

function sortProducts(products, sortType) {
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

function getPreparedProducts(products, state) {
    let result = [...products];
    result = searchProducts(result, state.query);
    result = filterProductsByCategory(result, state.category);
    result = sortProducts(result, state.sort);
    return result;
}

function formatPrice(price) {
    return `${price.toLocaleString('ru-RU')} руб.`;
}

function createProductCard(product) {
    const card = document.createElement('article');
    card.classList.add('product-card');

    // Сохраняем оформление избранной карточки из КР №3.
    if (product.id === 1) {
        card.classList.add('product-card--featured');
    }

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

        // Сохраняем responsive images оригинальной карточки Афины.
        if (product.id === 1) {
            image.srcset = 'images/athena-480.jpg 480w, images/athena-640.jpg 640w, images/athena-960.jpg 960w';
            image.sizes = '(max-width: 639px) calc(100vw - 48px), (max-width: 1023px) 50vw, 33vw';
            image.width = 640;
            image.height = 853;
        }
        if (product.id === 2) {
            image.classList.add('product-card__image--moon');
        }
        imageContainer.append(image);
    } else {
        // У товаров без фотографий сохраняем заглушку из КР №3.
        imageContainer = document.createElement('div');
        imageContainer.classList.add('product-card__image-placeholder');
        imageContainer.textContent = 'Фото костюма';
    }

    const title = document.createElement('h3');
    title.classList.add('product-card__title');
    title.textContent = product.title;

    const description = document.createElement('p');
    description.classList.add('product-card__description');
    description.textContent = product.description;

    const price = document.createElement('p');
    price.classList.add('product-card__price');
    price.textContent = `Цена: ${formatPrice(product.price)}`;

    const status = document.createElement('p');
    status.classList.add('product-card__status');
    status.textContent = product.isAvailable ? 'В наличии' : 'Нет в наличии';

    // Сохраняем существующую ссылку на подробную страницу товара.
    if (product.id === 1) {
        const detailsLink = document.createElement('a');
        detailsLink.classList.add('button', 'button--primary', 'product-card__button');
        detailsLink.href = 'product.html';
        detailsLink.textContent = 'Подробнее';
        card.append(imageContainer, title, description, price, status, detailsLink);
    } else {
        card.append(imageContainer, title, description, price, status);
    }

    // Новая кнопка практической №17: событие пока пишет в Console.
    const button = document.createElement('button');
    button.classList.add('button', 'button--primary', 'product-card__button');
    button.type = 'button';
    button.textContent = 'В корзину';
    button.dataset.action = 'add-to-cart';
    button.dataset.productId = String(product.id);

    if (!product.isAvailable) {
        button.disabled = true;
        button.textContent = 'Недоступно';
        button.classList.add('product-card__button--unavailable');
    }

    card.append(button);
    return card;
}

function renderProducts(productsToRender) {
    if (!productsContainer) {
        return;
    }
    productsContainer.textContent = '';
    if (catalogCount) {
        catalogCount.textContent = `Найдено товаров: ${productsToRender.length}`;
    }
    if (catalogEmpty) {
        catalogEmpty.hidden = productsToRender.length > 0;
    }
    productsToRender.forEach((product) => {
        productsContainer.append(createProductCard(product));
    });
}

function updateCatalog() {
    const preparedProducts = getPreparedProducts(products, catalogState);
    renderProducts(preparedProducts);
}

if (!productsContainer) {
    console.warn('Контейнер товаров не найден. Проверьте data-products-container.');
} else {
    if (searchInput) {
        searchInput.addEventListener('input', (event) => {
            catalogState.query = event.target.value;
            updateCatalog();
        });
    }
    if (categoryFilter) {
        categoryFilter.addEventListener('change', (event) => {
            catalogState.category = event.target.value;
            updateCatalog();
        });
    }
    if (sortSelect) {
        sortSelect.addEventListener('change', (event) => {
            catalogState.sort = event.target.value;
            updateCatalog();
        });
    }
    productsContainer.addEventListener('click', (event) => {
        const button = event.target.closest('[data-action="add-to-cart"]');
        if (!button || !productsContainer.contains(button)) {
            return;
        }
        const productId = Number(button.dataset.productId);
        const selectedProduct = products.find((product) => product.id === productId);
        if (!selectedProduct) {
            console.warn('Товар не найден:', productId);
            return;
        }
        if (!selectedProduct.isAvailable) {
            return;
        }
        const added = addToCart(selectedProduct.id);
        const feedback = document.querySelector('.catalog-cart-message');
        if (feedback) {
            feedback.textContent = added
                ? `Товар «${selectedProduct.title}» добавлен в корзину.`
                : 'Не удалось сохранить корзину.';
        }
    });
    updateCatalog();
}
