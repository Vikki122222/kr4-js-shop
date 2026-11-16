
/*
 * Контрольная работа №4
 * Проверка формы оформления заказа.
 * Практическая работа №17.
 */

// Находим форму заказа на странице
const orderForm = document.querySelector('.order-form');

if (orderForm) {

    // Находим поля формы
    const nameInput = orderForm.querySelector('#customer-name');
    const emailInput = orderForm.querySelector('#customer-email');
    const phoneInput = orderForm.querySelector('#customer-phone');
    const sizeInput = orderForm.querySelector('#costume-size');
    const agreementInput = orderForm.querySelector('#order-agreement');

    // Находим места для сообщений об ошибках
    const nameError = orderForm.querySelector('#order-name-error');
    const emailError = orderForm.querySelector('#order-email-error');
    const phoneError = orderForm.querySelector('#order-phone-error');
    const sizeError = orderForm.querySelector('#order-size-error');
    const agreementError = orderForm.querySelector('#order-agreement-error');
    const formMessage = orderForm.querySelector('.form-message');

    // Показываем ошибку под полем
    function showError(input, errorElement, message) {
        errorElement.textContent = message;
        input.setAttribute('aria-invalid', 'true');
        input.setAttribute('aria-describedby', errorElement.id);
    }

    // Убираем ошибку после исправления поля
    function clearError(input, errorElement) {
        errorElement.textContent = '';
        input.removeAttribute('aria-invalid');
    }

    // Проверяем имя: минимум 2 символа
    function validateName() {
        if (nameInput.value.trim().length < 2) {
            showError(nameInput, nameError, 'Введите имя не короче 2 символов.');
            return false;
        }

        clearError(nameInput, nameError);
        return true;
    }

    // Проверяем правильность электронной почты
    function validateEmail() {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(emailInput.value.trim())) {
            showError(emailInput, emailError, 'Введите корректный e-mail.');
            return false;
        }

        clearError(emailInput, emailError);
        return true;
    }

    // Проверяем телефон: 11 цифр, первая — 7 или 8
    function validatePhone() {
        const digits = phoneInput.value.trim().replace(/\D/g, '');

        if (digits.length !== 11 || !['7', '8'].includes(digits[0])) {
            showError(phoneInput, phoneError, 'Введите корректный номер телефона.');
            return false;
        }

        clearError(phoneInput, phoneError);
        return true;
    }

    // Проверяем, выбран ли размер костюма
    function validateSize() {
        if (sizeInput.value === '') {
            showError(sizeInput, sizeError, 'Выберите размер костюма.');
            return false;
        }

        clearError(sizeInput, sizeError);
        return true;
    }

    // Проверяем согласие на обработку данных
    function validateAgreement() {
        if (!agreementInput.checked) {
            showError(agreementInput, agreementError, 'Необходимо согласие на обработку данных.');
            return false;
        }

        clearError(agreementInput, agreementError);
        return true;
    }

    // Обрабатываем нажатие кнопки оформления заказа
    orderForm.addEventListener('submit', (event) => {

        // Отменяем обычную отправку формы
        event.preventDefault();

        // Проверяем все обязательные поля
        const isNameValid = validateName();
        const isEmailValid = validateEmail();
        const isPhoneValid = validatePhone();
        const isSizeValid = validateSize();
        const isAgreementValid = validateAgreement();

        // Если есть ошибки, показываем сообщение
        if (!(isNameValid && isEmailValid && isPhoneValid && isSizeValid && isAgreementValid)) {
            formMessage.textContent = 'Проверьте поля формы.';
            return;
        }

        // Собираем введённые данные заявки
        const requestData = {
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            phone: phoneInput.value.trim()
        };

        // Сообщаем об успешной учебной проверке
        // Настоящая отправка на сервер не выполняется
        console.log('Форма прошла учебную проверку; данные не отправлены.');

        formMessage.textContent = 'Форма прошла учебную проверку. Данные не отправлены.';

        // Очищаем форму после успешной проверки
        orderForm.reset();
    });

    // Проверяем поля сразу при вводе данных
    nameInput.addEventListener('input', validateName);
    emailInput.addEventListener('input', validateEmail);
    phoneInput.addEventListener('input', validatePhone);

    // Проверяем размер и согласие при изменении выбора
    sizeInput.addEventListener('change', validateSize);
    agreementInput.addEventListener('change', validateAgreement);
}
