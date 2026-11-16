
/*
  AEGIS COSPLAY — обработка форм заказа.

  Основа проекта: JavaScript из КР №1.

  Практика №12:
  Адаптивная вёрстка реализована через HTML и CSS.
  JavaScript не управляет расположением элементов.

  Практика №13:
  Доступность модального окна, возврат фокуса,
  проверка полей и атрибут aria-invalid.

  Практика №14:
  Финальная проверка работы форм перед сдачей КР №3.

  Проект учебный: данные на сервер не отправляются.
*/


/* =========================================
   1. ЭЛЕМЕНТЫ МОДАЛЬНОГО ОКНА
   ========================================= */

// Находим модальное окно на главной странице.
const orderDialog = document.getElementById('order-dialog');

// Находим кнопки заказа в карточках товаров.
const orderButtons = document.querySelectorAll('.product-card__button');

// Кнопка закрытия модального окна.
const closeDialogButton = document.getElementById('close-order-dialog');

// Скрытое поле для выбранного товара.
const selectedProductInput = document.getElementById('selected-product');

// Форма внутри модального окна.
const orderForm = document.getElementById('order-form');

// Сообщение об успешном оформлении заказа.
const successMessage = document.getElementById('success-message');

// Запоминаем кнопку, с которой открыли окно.
// Это нужно для возврата фокуса после закрытия.
let lastOrderTrigger = null;


/* =========================================
   2. ОТКРЫТИЕ И ЗАКРЫТИЕ ОКНА
   Практика №13 — доступность
   ========================================= */

// Обработчики добавляем только на тех страницах,
// где действительно существует модальное окно.
if (
    orderDialog &&
    closeDialogButton &&
    selectedProductInput &&
    orderForm &&
    successMessage
) {

    // Перебираем все кнопки «Заказать».
    orderButtons.forEach((button) => {

        // При нажатии сохраняем выбранный товар
        // и открываем модальное окно.
        button.addEventListener('click', () => {

            // Запоминаем кнопку для возврата фокуса.
            lastOrderTrigger = button;

            // Получаем название товара из data-product.
            const productName = button.dataset.product;

            // Передаём название в скрытое поле формы.
            selectedProductInput.value = productName;

            // Скрываем сообщение от предыдущего заказа.
            successMessage.hidden = true;

            // showModal() открывает стандартный HTML-dialog.
            orderDialog.showModal();
        });
    });


    // Практика №13: после закрытия окна возвращаем
    // клавиатурный фокус на кнопку, открывшую его.
    // Событие close возникает и при закрытии через Escape.
    orderDialog.addEventListener('close', () => {

        // Проверяем, что кнопка осталась на странице.
        if (lastOrderTrigger && lastOrderTrigger.isConnected) {
            lastOrderTrigger.focus();
        }
    });


    // Закрываем модальное окно по кнопке «Закрыть».
    closeDialogButton.addEventListener('click', () => {
        orderDialog.close();
    });


    /* =========================================
       3. ПРОВЕРКА ФОРМЫ В МОДАЛЬНОМ ОКНЕ
       Практика №13 — валидация и ARIA
       ========================================= */

    // Обрабатываем отправку формы заказа.
    orderForm.addEventListener('submit', (event) => {

        // Отменяем обычную отправку данных на сервер.
        event.preventDefault();

        // Получаем все элементы формы.
        const formElements = Array.from(orderForm.elements);


        // Сначала удаляем признаки старых ошибок.
        formElements.forEach((element) => {

            // willValidate проверяет, участвует ли
            // элемент в стандартной HTML-валидации.
            if (element.willValidate) {
                element.removeAttribute('aria-invalid');
            }

        });


        // Проверяем обязательные поля и форматы данных.
        if (!orderForm.checkValidity()) {

            // Отмечаем все неправильно заполненные поля.
            formElements.forEach((element) => {

                if (
                    element.willValidate &&
                    !element.checkValidity()
                ) {
                    // Практика №13: aria-invalid сообщает
                    // вспомогательным технологиям об ошибке.
                    element.setAttribute(
                        'aria-invalid',
                        'true'
                    );
                }

            });


            // Показываем встроенные подсказки браузера.
            orderForm.reportValidity();

            // Прерываем обработку, если есть ошибки.
            return;
        }


        // Показываем сообщение об успешном заполнении.
        successMessage.hidden = false;

        // Очищаем введённые данные.
        orderForm.reset();
    });
}


/* =========================================
   4. ФОРМА НА СТРАНИЦЕ ORDER.HTML
   ========================================= */

// Находим отдельную форму оформления заказа.
const orderPageForm = document.getElementById('order-page-form');

// Находим сообщение об успешном заказе.
const orderSuccessMessage = document.getElementById(
    'order-success-message'
);


// Этот блок выполняется только на странице order.html.
if (orderPageForm && orderSuccessMessage) {

    // Обрабатываем отправку отдельной формы заказа.
    orderPageForm.addEventListener('submit', (event) => {

        // Не отправляем данные на сервер.
        event.preventDefault();

        // Получаем все элементы формы.
        const formElements = Array.from(orderPageForm.elements);


        // Удаляем признаки ошибок предыдущей проверки.
        formElements.forEach((element) => {

            if (element.willValidate) {
                element.removeAttribute('aria-invalid');
            }

        });


        // Проверяем заполнение обязательных полей.
        if (!orderPageForm.checkValidity()) {

            // Практика №13: отмечаем поля с ошибками.
            formElements.forEach((element) => {

                if (
                    element.willValidate &&
                    !element.checkValidity()
                ) {
                    element.setAttribute(
                        'aria-invalid',
                        'true'
                    );
                }

            });


            // Показываем подсказки встроенной HTML-валидации.
            orderPageForm.reportValidity();

            // Не продолжаем обработку при ошибках.
            return;
        }


        // Показываем сообщение после заполнения формы.
        orderSuccessMessage.hidden = false;

        // Сбрасываем значения полей.
        orderPageForm.reset();


        // Прокручиваем страницу к сообщению,
        // чтобы пользователь увидел результат.
        orderSuccessMessage.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    });
}

/*
 * Практическая №16
 * Массив товаров и обработка данных.
 */

// Выводим данные товаров в консоль для проверки
console.log('Файл main.js подключён');
console.log(products);
console.table(products);

// Получаем названия всех товаров
function getProductTitles(products) {
    return products.map((product) => product.title);
}

// Получаем только товары, которые есть в наличии
function getAvailableProducts(products) {
    return products.filter((product) => product.isAvailable);
}

// Ищем товары по части названия
function searchProducts(products, query) {
    const normalizedQuery = query.trim().toLowerCase();

    // Если строка поиска пустая, возвращаем все товары
    if (normalizedQuery === '') {
        return products;
    }

    // Оставляем товары, в названии которых есть запрос
    return products.filter((product) => {
        return product.title.toLowerCase().includes(normalizedQuery);
    });
}

// Фильтруем товары по выбранной категории
function filterProductsByCategory(products, category) {
    // Категория all означает, что нужны все товары
    if (category === 'all') {
        return products;
    }

    return products.filter((product) => {
        return product.category === category;
    });
}

// Сортируем товары по цене
function sortProductsByPrice(products, direction = 'asc') {
    // Создаём копию массива, чтобы сохранить исходный порядок
    const productsCopy = [...products];

    // Сортировка от дорогих к дешёвым
    if (direction === 'desc') {
        return productsCopy.sort((a, b) => b.price - a.price);
    }

    // Сортировка от дешёвых к дорогим
    return productsCopy.sort((a, b) => a.price - b.price);
}

// Находим один товар по его ID
function findProductById(products, id) {
    return products.find((product) => product.id === id);
}

// Считаем общую стоимость всех товаров
function calculateTotalPrice(products) {
    return products.reduce((sum, product) => {
        return sum + product.price;
    }, 0);
}

// Считаем количество товаров в наличии
function countAvailableProducts(products) {
    return products.filter((product) => product.isAvailable).length;
}

// Вычисляем среднюю цену товаров
function calculateAveragePrice(products) {
    // Если массив пустой, возвращаем ноль
    if (products.length === 0) {
        return 0;
    }

    const totalPrice = calculateTotalPrice(products);

    // Округляем среднюю цену до целого числа
    return Math.round(totalPrice / products.length);
}

// Применяем поиск, фильтрацию и сортировку вместе
function getPreparedProducts(products, query, category, sortDirection) {
    let result = [...products];

    result = searchProducts(result, query);
    result = filterProductsByCategory(result, category);
    result = sortProductsByPrice(result, sortDirection);

    return result;
}

// Проверяем работу функций через консоль браузера
console.log(getProductTitles(products));
console.table(getAvailableProducts(products));
console.table(searchProducts(products, 'ко'));
console.table(filterProductsByCategory(products, 'kitchen'));

// Проверяем сортировку в обоих направлениях
console.table(sortProductsByPrice(products, 'asc'));
console.table(sortProductsByPrice(products, 'desc'));

// Проверяем поиск товара по ID
const selectedProduct = findProductById(products, 3);

if (selectedProduct) {
    console.log(`Найден товар: ${selectedProduct.title}`);
} else {
    console.log('Товар не найден');
}

// Проверяем расчёты и совместную обработку данных
console.log(calculateTotalPrice(products));
console.log(countAvailableProducts(products));
console.log(calculateAveragePrice(products));
console.table(getPreparedProducts(products, 'ко', 'kitchen', 'asc'));

// Находим элементы для вывода результатов на страницу
const messageElement = document.querySelector('.js-message');
const productOutputElement = document.querySelector('.product-output');

// Показываем сообщение о подключении функций
if (messageElement) {
    messageElement.textContent = 'Массив товаров и функции обработки данных подключены.';
}

// Выводим краткую статистику товаров на страницу
if (productOutputElement) {
    productOutputElement.textContent = [
        `Всего товаров: ${products.length}`,
        `Товаров в наличии: ${countAvailableProducts(products)}`,
        `Средняя цена: ${calculateAveragePrice(products)} руб.`,
        `Результатов поиска "ко": ${searchProducts(products, 'ко').length}`
    ].join('\n');
}
