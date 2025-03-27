// Масив для зберігання елементів кошика
let cart = [];
let currentPizzaName = ''; // Зберігає ім'я піци для поточного вибору
let currentPizzaSize = ''; // Зберігає розмір піци для поточного вибору

// Вартість добавок
const extraPrices = {
    "Гриби": { "30см": 50, "40см": 70 },
    "Соус BBQ": { "30см": 30, "40см": 30 },
    "Соус BBQ(дб)": { "30см": 30, "40см": 30 },
    "Пепероні": { "30см": 30, "40см": 30 },
    "Сир Фета": { "30см": 25, "40см": 25 },
    "Сир Моцарела": { "30см": 50, "40см": 70 },
    "Соус Червоний(дб)": { "30см": 30, "40см": 30 },
    "Соус Червоний": { "30см": 30, "40см": 30 },
    "Соус Вершковий": { "30см": 35, "40см": 35 },
    "Соус Вершковий(дб)": { "30см": 35, "40см": 35 },
    "Соус Цезарь фірмовий": { "30см": 35, "40см": 35 },
    "Соус Тартар": { "30см": 30, "40см": 30 },
    "Соус Сирний": { "30см": 30, "40см": 30 },
    "Соус Кисло-солодкий": { "30см": 30, "40см": 30 },
    "Сир Гауда": { "30см": 35, "40см": 50 },
    "Сир Горгонзола": { "30см": 40, "40см": 60 },
    "Сир Пармезан": { "30см": 35, "40см": 50 },
    "Томати": { "30см": 30, "40см": 40 },
    "Перець Солодкий": { "30см": 30, "40см": 40 },
    "Перець Гострий": { "30см": 40, "40см": 60 },
    "Цибуля Синя": { "30см": 25, "40см": 35 },
    "Оливки": { "30см": 25, "40см": 35 },
    "Маслини": { "30см": 25, "40см": 35 },
    "Корнішони": { "30см": 30, "40см": 40 },
    "Салямі": { "30см": 35, "40см": 45 },
    "Баварські ковбаски": { "30см": 40, "40см": 50 },
    "Шинка": { "30см": 40, "40см": 50 },
    "Куряче філе": { "30см": 50, "40см": 65 },
    "Куряче філе копчене": { "30см": 60, "40см": 100 },
    "Яловичина": { "30см": 90, "40см": 140 },
    "Перепелині яйця": { "30см": 30, "40см": 50 },
    "Ананас": { "30см": 30, "40см": 40 },
    "Кукурудза": { "30см": 25, "40см": 35 },
    "Лосось": { "30см": 70, "40см": 120 },
    "Морепродукти": { "30см": 100, "40см": 200 }
};

// Функція додавання до кошика
function addToCart(itemName, itemPrice, isPizza = true) {
    // Якщо це не піца (салат чи закуска)
    if (!isPizza) {
        cart.push({ name: itemName, price: itemPrice });
        updateCart(); // Оновити кошик
        return;
    }

    // Логіка для піци
    currentPizzaName = itemName;
    currentPizzaSize = itemName.includes('30см') ? '30см' : '40см';
    cart.push({ name: itemName, price: itemPrice });

    // Очищаємо вибрані добавки та соуси
    resetExtras();

    // Показуємо модальне вікно для вибору добавок
    openExtrasModal();
    updateCart();
}

// Функція онулення вибраних checkbox
function resetExtras() {
    document.querySelectorAll('.extra-option').forEach(checkbox => {
        checkbox.checked = false; // Зняти вибір
    });
}

// Оновлення кошика
function updateCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalContainer = document.getElementById('cart-total');

    cartItemsContainer.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price;

        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';

        // Назва і ціна товару
        const itemText = document.createElement('span');
        itemText.textContent = `${item.name} - ${item.price} грн`;

        // Кнопка видалення
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Видалити';
        deleteButton.className = 'delete-item-btn';
        deleteButton.addEventListener('click', () => {
            removeFromCart(index);
        });

        itemElement.appendChild(itemText);
        itemElement.appendChild(deleteButton);
        cartItemsContainer.appendChild(itemElement);
    });

    cartTotalContainer.textContent = `Загальна сума: ${total} грн`;
}
function removeFromCart(index) {
    cart.splice(index, 1); // Видаляємо елемент із масиву
    updateCart(); // Оновлюємо відображення кошика
}


document.addEventListener('DOMContentLoaded', () => {
    const simpleItemButtons = document.querySelectorAll('.add-to-cart-simple');

    simpleItemButtons.forEach(button => {
        button.addEventListener('click', () => {
            const itemName = button.dataset.name;
            const itemPrice = parseFloat(button.dataset.price);


            cart.push({ name: itemName, price: itemPrice });


            updateCart();
        });
    });
});


// Відкриття модального вікна для добавок
function openExtrasModal() {
    document.getElementById('extras-modal').style.display = 'flex';
}

document.querySelectorAll('.add-to-cart-simple').forEach(button => {
    button.addEventListener('click', () => {
        const itemName = button.dataset.name;
        const itemPrice = parseFloat(button.dataset.price);
        addSimpleItemToCart(itemName, itemPrice);
    });
});

document.getElementById('close-extras-modal').addEventListener('click', () => {
    document.getElementById('extras-modal').style.display = 'none';
});

// Додавання вибраних добавок до піци
document.getElementById('add-to-cart-with-extras').addEventListener('click', () => {
    const selectedExtras = [];
    let extraCost = 0;

    document.querySelectorAll('.extra-option:checked').forEach(extra => {
        const extraName = extra.dataset.extra;
        selectedExtras.push(extraName);

        const sizePrice = extraPrices[extraName] ? extraPrices[extraName][currentPizzaSize] : 0;
        extraCost += sizePrice;
    });

    const pizzaWithExtras = selectedExtras.length > 0 
        ? `${currentPizzaName} (Добавки: ${selectedExtras.join(", ")})` 
        : currentPizzaName;

    cart[cart.length - 1].name = pizzaWithExtras;
    cart[cart.length - 1].price += extraCost;

    updateCart();
    document.getElementById('extras-modal').style.display = 'none';
});

// Додавання обробників для кнопок "Купити"
document.addEventListener('DOMContentLoaded', () => {
    const addButtons = document.querySelectorAll('.add-to-cart');

    addButtons.forEach(button => {
        button.addEventListener('click', () => {
            const itemName = button.dataset.name;
            const itemPrice = parseFloat(button.dataset.price);

            // Перевіряємо чи це піца (за наявністю класу 'pizza-item')
            const isPizza = button.closest('.pizza-item') !== null;
            addToCart(itemName, itemPrice, isPizza);
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const extrasContainer = document.querySelector('.extras-container');
    const closeModalButton = document.getElementById('close-extras-modal');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');

    let currentPizzaName = '';
    let currentPizzaPrice = 0;

    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            currentPizzaName = button.dataset.name;
            currentPizzaPrice = parseFloat(button.dataset.price);
    
            // Скидаємо всі чекбокси перед відкриттям модального вікна
            document.querySelectorAll('.extra-option').forEach(extra => {
                extra.checked = false; // Знімаємо позначку
            });
    
            // Показати модальне вікно
            extrasContainer.style.display = 'flex';
        });
    });
    

    // Обробник закриття модального вікна
    closeModalButton.addEventListener('click', () => {
        extrasContainer.style.display = 'none';
    });

    // Обробник додавання піци з добавками до кошика
    document.getElementById('add-to-cart-with-extras').addEventListener('click', () => {
        const selectedExtras = [];
        let totalExtrasPrice = 0;

        document.querySelectorAll('.extra-option:checked').forEach(extra => {
            selectedExtras.push(extra.dataset.extra);
            totalExtrasPrice += parseInt(extra.dataset.price);
        });

        const itemName = selectedExtras.length > 0
            ? `${currentPizzaName} (Добавки: ${selectedExtras.join(", ")})`
            : currentPizzaName;

        const itemPrice = currentPizzaPrice + totalExtrasPrice;

        // Додати піцу до кошика (приклад логіки)
        console.log(`Додано: ${itemName} - ${itemPrice} грн`);

        // Закрити модальне вікно
        extrasContainer.style.display = 'none';
    });
});

function sendToTelegram() {
    const chatId = "5962734335";
    const botToken = "7852903031:AAFqpvqkSoIl0brvZR_dLP_KTw0MAtRV32g";

    let message = "Замовлення з PizzaDonya:\n";
    let total = 0;

    cart.forEach(item => {
        message += `${item.name} - ${item.price} грн\n`;
        total += item.price;
    });
    message += `\nЗагальна сума: ${total} грн`;

    const deliveryOption = document.querySelector('input[name="delivery-option"]:checked').value;
    message += `\nОпція доставки: ${deliveryOption}`;

    if (deliveryOption === 'Доставка') {
        const name = document.getElementById('delivery-name').value;
        const address = document.getElementById('delivery-address').value;
        const phone = document.getElementById('delivery-phone').value;

        if (!name || !address || !phone) {
            alert("Будь ласка, заповніть усі поля для доставки.");
            return;
        }

        message += `\nІм'я: ${name}`;
        message += `\nАдреса: ${address}`;
        message += `\nТелефон: ${phone}`;
    }

    if (deliveryOption === 'Самовивіз') {
        const name = document.getElementById('pickup-name').value;
        const phone = document.getElementById('pickup-phone').value;

        if (!name || !phone) {
            alert("Будь ласка, заповніть ім'я та телефон для самовивозу.");
            return;
        }

        message += `\nІм'я: ${name}`;
        message += `\nТелефон: ${phone}`;
    }

    const comment = document.getElementById('delivery-comment').value.trim();
    console.log("Коментар:", comment); // Додаємо перевірку
    if (comment) {
        message += `\nКоментар: ${comment}`;
    } else {
        console.log("Коментар не заповнений.");
    }

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const params = {
        chat_id: chatId,
        text: message,
    };

    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
    })
        .then(response => response.json())
        .then(data => {
            if (data.ok) {
                alert("Замовлення успішно відправлено у Telegram!");
            } else {
                alert(`Помилка: ${data.description}`);
            }
        })
        .catch(error => {
            console.error("Помилка:", error);
            alert("Неможливо відправити замовлення.");
        });
}


// Додавання обробника подій для кнопки "Відправити замовлення в Telegram"
document.getElementById('send-to-telegram').addEventListener('click', sendToTelegram);

// Відображення полів для доставки
document.querySelectorAll('input[name="delivery-option"]').forEach((radio) => {
    radio.addEventListener('change', function () {
        if (this.value === 'Доставка') {
            document.getElementById('delivery-fields').style.display = 'block';
        } else {
            document.getElementById('delivery-fields').style.display = 'none';
        }
    });
});
document.addEventListener("DOMContentLoaded", () => {
    let slideIndex = 0; // Поточний слайд
    const slides = document.querySelectorAll(".slide");
    let slideInterval;

    // Ініціалізація слайдшоу
    showSlides(slideIndex);
    startAutoSlide();

    // Функція для ручного переключення слайдів
    function changeSlide(n) {
        slideIndex += n;
        if (slideIndex >= slides.length) slideIndex = 0; // Повернення до першого слайда
        if (slideIndex < 0) slideIndex = slides.length - 1; // Перехід до останнього слайда
        showSlides(slideIndex);
        resetAutoSlide(); // Скидаємо таймер, щоб користувачеві було зручніше
    }

    // Функція для показу конкретного слайда
    function showSlides(index) {
        slides.forEach(slide => slide.style.display = "none"); // Ховаємо всі слайди
        slides[index].style.display = "block"; // Показуємо поточний слайд
    }

    // Функція для автоматичного перемикання слайдів
    function startAutoSlide() {
        slideInterval = setInterval(() => {
            slideIndex++;
            if (slideIndex >= slides.length) slideIndex = 0; // Повертаємось до першого слайда
            showSlides(slideIndex);
        }, 3000); // Зміна слайда кожні 3 секунди
    }

    // Функція для скидання автоматичного слайдшоу
    function resetAutoSlide() {
        clearInterval(slideInterval); // Зупиняємо таймер
        startAutoSlide(); // Перезапускаємо автоматичне слайдшоу
    }

    // Робимо функцію глобальною для кнопок
    window.changeSlide = changeSlide;
});
// Лічильник товарів
let itemCount = 0;

document.addEventListener("DOMContentLoaded", () => {
    const addButtons = document.querySelectorAll('.add-to-cart, .add-to-cart-simple');
    const itemCountDisplay = document.getElementById('item-count');

    addButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Збільшуємо лічильник на 1
            itemCount++;
            // Оновлюємо відображення лічильника
            itemCountDisplay.textContent = itemCount;

            // Перевірка класу і додавання до кошика
            if (button.classList.contains('add-to-cart-simple')) {
                const itemName = button.dataset.name;
                const itemPrice = parseFloat(button.dataset.price);

            }
        });
    });
});
document.addEventListener("DOMContentLoaded", () => {
    const snackButtons = document.querySelectorAll('.add-to-cart-snack');
    const itemCountDisplay = document.getElementById('item-count'); // Елемент для відображення лічильника
    let itemCount = 0; // Початкове значення лічильника

    snackButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Збільшуємо лічильник
            itemCount++;
            // Оновлюємо відображення лічильника
            itemCountDisplay.textContent = itemCount;
            updateCart(); // Оновлюємо відображення кошика
        });
    });
});


document.getElementById('to-toppings').addEventListener('click', () => {
    document.getElementById('sauces-step').style.display = 'none';
    document.getElementById('toppings-step').style.display = 'block';
});

document.getElementById('close-extras-modal').addEventListener('click', () => {
    document.querySelector('.extras-container').style.display = 'none';
});

document.getElementById('add-to-cart-with-extras').addEventListener('click', () => {
    const selectedExtras = [];
    let totalExtrasPrice = 0;

    // Збираємо вибрані добавки
    document.querySelectorAll('.extra-option:checked').forEach(extra => {
        selectedExtras.push(extra.dataset.extra);
        totalExtrasPrice += parseInt(extra.dataset.price);
    });

    // Формуємо назву піци з добавками
    const itemName = selectedExtras.length > 0
        ? `${currentPizzaName} (Добавки: ${selectedExtras.join(", ")})`
        : currentPizzaName;

    const itemPrice = currentPizzaPrice + totalExtrasPrice;

    // Додаємо піцу до кошика
    cart.push({ name: itemName, price: itemPrice });
    updateCart();

    // Скидаємо вибір соусів та добавок
    document.querySelectorAll('.extra-option:checked').forEach(extra => {
        extra.checked = false; // Знімаємо позначку
    });

    // Скидаємо поточний вибір піци
    currentPizzaName = '';
    currentPizzaSize = '';
    currentPizzaPrice = 0;

    // Закриваємо модальне вікно
    document.querySelector('.extras-container').style.display = 'none';
});

document.addEventListener("DOMContentLoaded", () => {
    const openCartBtn = document.getElementById("open-cart-btn"); // Кнопка відкриття кошика
    const closeCartBtn = document.getElementById("close-cart-modal"); // Кнопка закриття кошика
    const cartModal = document.querySelector(".cart-modal-content"); // Контейнер модального вікна
    const cartOverlay = document.querySelector(".cart-modal"); // Фон модального вікна

    // Відкрити кошик
    openCartBtn.addEventListener("click", () => {
        cartOverlay.style.display = "flex"; // Показуємо фон та модальне вікно
    });

    // Закрити кошик через кнопку "Закрити"
    closeCartBtn.addEventListener("click", () => {
        cartOverlay.style.display = "none"; // Ховаємо модальне вікно
    });

    // Закриття кошика при кліку поза модальним вікном
    window.addEventListener("click", (e) => {
        if (e.target === cartOverlay) {
            cartOverlay.style.display = "none";
        }
    });
});
document.addEventListener('DOMContentLoaded', () => {
    const saucesStep = document.getElementById('sauces-step');
    const toppingsStep = document.getElementById('toppings-step');
    const backToSaucesButton = document.getElementById('back-to-sauces');

    // Показуємо соуси, коли натискаємо "Назад"
    backToSaucesButton.addEventListener('click', () => {
        saucesStep.style.display = 'block';
        toppingsStep.style.display = 'none';
    });

    // При виборі "Перейти до добавок" соуси ховаються
    document.getElementById('to-toppings').addEventListener('click', () => {
        saucesStep.style.display = 'none';
        toppingsStep.style.display = 'block';
    });
});

function clearCart() {
    cart = []; 
    itemCount = 0; 
    updateCart(); 

    const itemCountDisplay = document.getElementById('item-count');
    itemCountDisplay.textContent = itemCount;
}

document.addEventListener('DOMContentLoaded', () => {
    const clearCartButton = document.getElementById('clear-cart-btn');
    clearCartButton.addEventListener('click', () => {
        const confirmation = confirm("Ви впевнені, що хочете очистити кошик?");
        if (confirmation) {
            clearCart();
        }
    });
});

// Функція для відображення тільки відповідних цін
function updateToppingsForSelectedSize(size) {
    const extras = document.querySelectorAll('.extras-list label'); // Знаходимо всі добавки

    extras.forEach(extra => {
        const input = extra.querySelector('input'); // Отримуємо чекбокс
        const priceElement = extra.querySelector('.price'); // Елемент для відображення ціни
        const price30 = input.getAttribute('data-price-30'); // Ціна для 30 см
        const price40 = input.getAttribute('data-price-40'); // Ціна для 40 см

        if (size === '30') {
            // Показуємо лише 30 см
            input.setAttribute('data-price', price30); // Оновлюємо атрибут data-price
            if (priceElement) {
                priceElement.textContent = `${price30} грн`; // Встановлюємо текст для 30 см
            }
            extra.style.display = 'block'; // Показуємо елемент
        } else if (size === '40') {
            // Показуємо лише 40 см
            input.setAttribute('data-price', price40); // Оновлюємо атрибут data-price
            if (priceElement) {
                priceElement.textContent = `${price40} грн`; // Встановлюємо текст для 40 см
            }
            extra.style.display = 'block'; // Показуємо елемент
        } else {
            // Приховуємо все інше
            extra.style.display = 'none';
        }
    });
}

function selectPizzaSize(size) {
    const toppingsStep = document.getElementById('toppings-step');
    console.log(`Вибрано розмір: ${size}`);

    // Видаляємо всі класи розмірів
    toppingsStep.classList.remove('size-30', 'size-40');

    // Додаємо клас відповідного розміру
    if (size === '30') {
        toppingsStep.classList.add('size-30');
    } else if (size === '40') {
        toppingsStep.classList.add('size-40');
    }
}

// Початкова ініціалізація: вибір розміру 30 см
document.addEventListener('DOMContentLoaded', () => {
    selectPizzaSize('30'); // Встановлюємо розмір 30 см за замовчуванням
});

// Обробка подій для кнопок вибору розміру
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
        const size = button.textContent.includes('30') ? '30' : '40'; // Визначення розміру
        selectPizzaSize(size);
    });
});

// Відображення полів для "Самовивозу" або "Доставки"
document.querySelectorAll('input[name="delivery-option"]').forEach((radio) => {
    radio.addEventListener('change', function () {
        const pickupFields = document.getElementById('pickup-fields');
        const deliveryFields = document.getElementById('delivery-fields');
        
        if (this.value === 'Доставка') {
            deliveryFields.style.display = 'block';
            pickupFields.style.display = 'none';
        } else {
            deliveryFields.style.display = 'none';
            pickupFields.style.display = 'block';
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const snackButtons = document.querySelectorAll('.add-to-cart-snack');
    const saucesModal = document.querySelector('.extras-container2');
    const addToCartWithExtrasButton = document.getElementById('add-to-cart-with-extras2');
    const closeExtrasModalButton = document.getElementById('close-extras-modal2');

    let currentSnackName = '';
    let currentSnackPrice = 0;

    snackButtons.forEach(button => {
        button.addEventListener('click', () => {
            currentSnackName = button.dataset.name;
            currentSnackPrice = parseFloat(button.dataset.price);

            // Скидаємо вибір соусів
            document.querySelectorAll('.extras-list.sauces-list2 input').forEach(extra => {
                extra.checked = false;
            });

            // Показуємо модальне вікно з соусами
            saucesModal.style.display = 'flex';
        });
    });

    // Додавання снека з вибраними соусами до кошика
    addToCartWithExtrasButton.addEventListener('click', () => {
        const selectedExtras = [];
        let extraCost = 0;

        document.querySelectorAll('.extras-list.sauces-list2 input:checked').forEach(extra => {
            const extraName = extra.dataset.extra;
            const extraPrice = parseFloat(extra.dataset.price);
            selectedExtras.push(extraName);
            extraCost += extraPrice;
        });

        const snackWithExtras = selectedExtras.length > 0
            ? `${currentSnackName} (Соуси: ${selectedExtras.join(", ")})`
            : currentSnackName;

        cart.push({
            name: snackWithExtras,
            price: currentSnackPrice + extraCost
        });

        updateCart();

        // Ховаємо модальне вікно
        saucesModal.style.display = 'none';
    });

    // Закриття модального вікна
    closeExtrasModalButton.addEventListener('click', () => {
        saucesModal.style.display = 'none';
    });
});

