
/*
 * Контрольная работа №4
 * Данные товаров интернет-магазина AEGIS COSPLAY.
 * Практические работы №17–18.
 */

// Массив товаров, который используется для каталога и корзины
// Каждый товар имеет свой ID, название, категорию, цену и другие свойства
const products = [
    // Первый товар — костюм Афины
    {
        "id": 1,
        "title": "Костюм Афины",
        "category": "mythology",
        "price": 12900,
        "discountPercent": 0,
        "rating": null,
        "isAvailable": true,
        "image": "images/athena-640.jpg",
        "description": "Образ богини мудрости в античном стиле с декоративной бронёй и золотыми элементами."
    },

    // Второй товар — лунная волшебница
    {
        "id": 2,
        "title": "Лунная волшебница",
        "category": "magic",
        "price": 9500,
        "discountPercent": 0,
        "rating": null,
        "isAvailable": false,
        "image": "images/moon-sorceress.jpg",
        "description": "Фэнтезийный костюм в светлых оттенках с декоративными элементами и аксессуарами."
    },

    // Третий товар — тёмная охотница
    {
        "id": 3,
        "title": "Тёмная охотница",
        "category": "fantasy",
        "price": 11400,
        "discountPercent": 0,
        "rating": null,
        "isAvailable": false,
        "image": "images/dark-huntress.jpg",
        "description": "Детализированный образ в тёмном фэнтезийном стиле для фестивалей и тематических фотосессий."
    },

    // Четвёртый товар — лесная эльфийка
    {
        "id": 4,
        "title": "Лесная эльфийка",
        "category": "fantasy",
        "price": 10900,
        "discountPercent": 0,
        "rating": null,
        "isAvailable": false,
        "image": "",
        "description": "Лёгкий фэнтезийный образ в природных оттенках с декоративными элементами."
    },

    // Пятый товар — воительница Севера
    {
        "id": 5,
        "title": "Воительница Севера",
        "category": "fantasy",
        "price": 13500,
        "discountPercent": 0,
        "rating": null,
        "isAvailable": false,
        "image": "",
        "description": "Образ северной воительницы с декоративной бронёй и элементами фэнтези."
    },

    // Шестой товар — академия магии
    {
        "id": 6,
        "title": "Академия магии",
        "category": "magic",
        "price": 8900,
        "discountPercent": 0,
        "rating": null,
        "isAvailable": false,
        "image": "",
        "description": "Костюм ученицы магической академии для фестивалей, фотосессий и тематических мероприятий."
    },

    // Седьмой товар — костюм Артемиды
    {
        "id": 7,
        "title": "Костюм Артемиды",
        "category": "mythology",
        "price": 11900,
        "discountPercent": 0,
        "rating": null,
        "isAvailable": true,
        "image": "",
        "description": "Учебная позиция: мифологический образ Артемиды для фестиваля или фотосессии."
    },

    // Восьмой товар — звёздная чародейка
    {
        "id": 8,
        "title": "Звёздная чародейка",
        "category": "magic",
        "price": 10500,
        "discountPercent": 0,
        "rating": null,
        "isAvailable": true,
        "image": "",
        "description": "Учебная позиция: магический образ с декоративными элементами для тематического мероприятия."
    }
];
