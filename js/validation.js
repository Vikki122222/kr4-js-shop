// Практическая №17: валидация существующей формы order.html.
const orderForm = document.querySelector('.order-form');

if (orderForm) {
    const nameInput = orderForm.querySelector('#customer-name');
    const emailInput = orderForm.querySelector('#customer-email');
    const phoneInput = orderForm.querySelector('#customer-phone');
    const sizeInput = orderForm.querySelector('#costume-size');
    const agreementInput = orderForm.querySelector('#order-agreement');

    const nameError = orderForm.querySelector('#order-name-error');
    const emailError = orderForm.querySelector('#order-email-error');
    const phoneError = orderForm.querySelector('#order-phone-error');
    const sizeError = orderForm.querySelector('#order-size-error');
    const agreementError = orderForm.querySelector('#order-agreement-error');
    const formMessage = orderForm.querySelector('.form-message');

    function showError(input, errorElement, message) {
        errorElement.textContent = message;
        input.setAttribute('aria-invalid', 'true');
        input.setAttribute('aria-describedby', errorElement.id);
    }

    function clearError(input, errorElement) {
        errorElement.textContent = '';
        input.removeAttribute('aria-invalid');
    }

    function validateName() {
        if (nameInput.value.trim().length < 2) {
            showError(nameInput, nameError, 'Введите имя не короче 2 символов.');
            return false;
        }
        clearError(nameInput, nameError);
        return true;
    }

    function validateEmail() {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailInput.value.trim())) {
            showError(emailInput, emailError, 'Введите корректный e-mail.');
            return false;
        }
        clearError(emailInput, emailError);
        return true;
    }

    function validatePhone() {
        const digits = phoneInput.value.trim().replace(/\D/g, '');
        if (digits.length !== 11 || !['7', '8'].includes(digits[0])) {
            showError(phoneInput, phoneError, 'Введите корректный номер телефона.');
            return false;
        }
        clearError(phoneInput, phoneError);
        return true;
    }

    // Поля размера и согласия уже были обязательными в КР №3.
    function validateSize() {
        if (sizeInput.value === '') {
            showError(sizeInput, sizeError, 'Выберите размер костюма.');
            return false;
        }
        clearError(sizeInput, sizeError);
        return true;
    }

    function validateAgreement() {
        if (!agreementInput.checked) {
            showError(agreementInput, agreementError, 'Необходимо согласие на обработку данных.');
            return false;
        }
        clearError(agreementInput, agreementError);
        return true;
    }

    orderForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const isNameValid = validateName();
        const isEmailValid = validateEmail();
        const isPhoneValid = validatePhone();
        const isSizeValid = validateSize();
        const isAgreementValid = validateAgreement();

        if (!(isNameValid && isEmailValid && isPhoneValid && isSizeValid && isAgreementValid)) {
            formMessage.textContent = 'Проверьте поля формы.';
            return;
        }

        const requestData = {
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            phone: phoneInput.value.trim()
        };
        console.log('Форма прошла учебную проверку; данные не отправлены.');
        formMessage.textContent = 'Форма прошла учебную проверку. Данные не отправлены.';
        orderForm.reset();
    });

    nameInput.addEventListener('input', validateName);
    emailInput.addEventListener('input', validateEmail);
    phoneInput.addEventListener('input', validatePhone);
    sizeInput.addEventListener('change', validateSize);
    agreementInput.addEventListener('change', validateAgreement);
}
