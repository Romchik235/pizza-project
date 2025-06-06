// ---- GLOBAL ----
// let cart = [];
window.cart = [];
window.currentPizza = null;

// Глобальна функція для видалення товару з кошика 
window.removeFromCart = function(idx) {
    cart.splice(idx, 1);
    updateCartDisplay();
    if (typeof renderSidepanelCart === 'function') {
        renderSidepanelCart();
    }
};

// Додаємо слухачі для кнопок ПІЦ (тільки для .add-to-cart)
document.addEventListener("DOMContentLoaded", () => {
    // 4.1) Кнопки “add-to-cart” для піц
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', function() {
            window.currentPizza = {
                name: this.getAttribute('data-name'),
                price: parseFloat(this.getAttribute('data-price')),
                extras: []
            };
            document.querySelector('.extras-container').style.display = 'flex';
            document.getElementById('sauces-step').style.display = 'block';
            document.getElementById('toppings-step').style.display = 'none';
        });
    });

    // 4.2) Кнопка “Додати до кошика з extras” (другий крок)
    document.getElementById("add-to-cart-with-extras")?.addEventListener("click", () => {
        handleAddWithExtras("toppings-step");
    });
    document.getElementById("to-toppings")?.addEventListener("click", () => {
        document.getElementById('sauces-step').style.display = 'none';
        document.getElementById('toppings-step').style.display = 'block';
    });
    document.getElementById('back-to-sauces')?.addEventListener('click', () => {
        document.getElementById('toppings-step').style.display = 'none';
        document.getElementById('sauces-step').style.display = 'block';
    });

    // 4.3) Кнопки “Додати соуси окремо”
    document.querySelectorAll('.add-sauces-separately').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelector('.extras-container').style.display = 'none';
            document.querySelector('.extras-container2').style.display = 'flex';
        });
    });
    document.getElementById("add-selected-sauces-to-cart")?.addEventListener("click", function() {
        if (!window.currentPizza) return;
        let sauces = [];
        let saucesTotal = 0;
        document.querySelectorAll('#sauces-step .extra-option:checked').forEach(cb => {
            const name = cb.getAttribute('data-extra');
            const price = parseFloat(cb.getAttribute('data-price'));
            sauces.push({ name, price });
            saucesTotal += price;
        });
        const totalPrice = window.currentPizza.price + saucesTotal;
        cart.push({
            ...window.currentPizza,
            extras: sauces,
            total: totalPrice
        });
        window.currentPizza = null;
        updateCartDisplay();
        document.querySelectorAll('#sauces-step .extra-option').forEach(cb => cb.checked = false);
        document.querySelector('.extras-container').style.display = 'none';
    });

    // 4.4) Додавання тільки соусів (Extras окремо)
    document.getElementById('add-only-sauces-to-cart')?.addEventListener('click', function() {
        let extras = [];
        document.querySelectorAll('.extras-container2 .extra-option:checked').forEach(cb => {
            extras.push({
                name: cb.getAttribute('data-extra'),
                price: parseFloat(cb.getAttribute('data-price'))
            });
        });
        if (extras.length) {
            extras.forEach(ex => {
                cart.push({
                    name: ex.name,
                    price: ex.price,
                    extras: [],
                    total: ex.price
                });
            });
            updateCartDisplay();
        }
        document.querySelectorAll('.extras-container2 .extra-option').forEach(cb => cb.checked = false);
        document.querySelector('.extras-container2').style.display = 'none';
    });

    // 4.5) Закриття всіх модалок extras
    document.querySelectorAll('.close-btn, #close-extras-modal2').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelector('.extras-container').style.display = 'none';
            document.querySelector('.extras-container2').style.display = 'none';
        });
    });

    // 4.6) Відкрити центральну модалку Кошика
    document.getElementById('open-cart-btn')?.addEventListener('click', () => {
        document.getElementById('cart-modal').style.display = 'flex';
        updateCartDisplay();
    });

    // 4.7) Закрити центральну модалку Кошика
    document.getElementById('close-cart-modal')?.addEventListener('click', () => {
        document.getElementById('cart-modal').style.display = 'none';
    });

    // 4.8) Відкрити бокову панель Кошика
    document.getElementById('open-cart-btn').addEventListener('click', function() {
        document.getElementById('cart-sidepanel-overlay').style.display = 'block';
        document.getElementById('cart-sidepanel').classList.add('open');
        renderSidepanelCart();
    
        // приховуємо значок кошика
        document.getElementById('open-cart-btn').style.display = 'none';
    });

    // 4.9) Закрити бокову панель Кошика
    document.getElementById('close-cart-sidepanel').addEventListener('click', function() {
        document.getElementById('cart-sidepanel-overlay').style.display = 'none';
        document.getElementById('cart-sidepanel').classList.remove('open');
    
        // показуємо значок кошика назад
        document.getElementById('open-cart-btn').style.display = '';
    });

    document.getElementById('cart-sidepanel-overlay').addEventListener('click', function() {
        document.getElementById('cart-sidepanel-overlay').style.display = 'none';
        document.getElementById('cart-sidepanel').classList.remove('open');

        // показуємо значок кошика назад
        document.getElementById('open-cart-btn').style.display = '';
    });

    // 4.10) Кнопка “Очистити кошик” лише у центральній модалці
    document.getElementById('clear-cart-btn')?.addEventListener('click', () => {
        if (confirm('Ви дійсно бажаєте очистити кошик?')) {
            cart = [];
            updateCartDisplay();
            renderSidepanelCart && renderSidepanelCart();
        }
    });

    // 4.11) Кнопка “Перейти в кошик і оформити замовлення” (sidebar → центральна)
    document.getElementById('open-order-modal')?.addEventListener('click', () => {
        // Приховуємо sidebar
        document.getElementById('cart-sidepanel-overlay').style.display = 'none';
        document.getElementById('cart-sidepanel').classList.remove('open');
        renderSidepanelCart && renderSidepanelCart();

        // Відкриваємо центральну модалку Кошика
        document.getElementById('cart-modal').style.display = 'flex';
        updateCartDisplay();
    });

    // 4.12) Тут ваша решта логіки — відправка форми, відображення/приховання адреси тощо…
    document.getElementById('order-form')?.addEventListener('submit', function(e) {
        e.preventDefault();
        // … відправка на Telegram, редірект, sessionStorage і т.д. …
    });

    // 4.13) Показати/приховати поле “Адреса” при виборі “Доставка/Самовивіз”
    document.querySelectorAll('input[name="delivery_type"]').forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === "delivery") {
                document.getElementById('address-block').style.display = "block";
                document.getElementById('address').required = true;
            } else {
                document.getElementById('address-block').style.display = "none";
                document.getElementById('address').required = false;
            }
        });
    });
    const checkedRadio = document.querySelector('input[name="delivery_type"]:checked');
    if (checkedRadio && checkedRadio.value === "delivery") {
        document.getElementById('address-block').style.display = "block";
        document.getElementById('address').required = true;
    } else {
        document.getElementById('address-block').style.display = "none";
        document.getElementById('address').required = false;
    }

    // Початковий рендер
    updateCartDisplay();
    renderSidepanelCart && renderSidepanelCart();
});

document.getElementById('clear-cart-btn').onclick = function() {
    if (confirm('Ви дійсно бажаєте очистити кошик?')) {
        cart = [];
        updateCartDisplay();
    }
};

// Відкриває бокову панель кошика
document.getElementById('open-cart-btn').addEventListener('click', function() {
    document.getElementById('cart-sidepanel-overlay').style.display = 'block';
    document.getElementById('cart-sidepanel').classList.add('open');
    renderSidepanelCart();
});

// Закриває бокову панель кошика
document.getElementById('close-cart-sidepanel').addEventListener('click', function() {
    document.getElementById('cart-sidepanel-overlay').style.display = 'none';
    document.getElementById('cart-sidepanel').classList.remove('open');
});
document.getElementById('cart-sidepanel-overlay').addEventListener('click', function() {
    document.getElementById('cart-sidepanel-overlay').style.display = 'none';
    document.getElementById('cart-sidepanel').classList.remove('open');
});

function handleOrderSubmit(e) {
    e.preventDefault();

    // 1) Валідація полів — залишаємо так само, як було
    let isValid = true;
    document.querySelectorAll('.error-message').forEach(span => span.innerText = '');
    document.getElementById('name').classList.remove('input-error');
    document.getElementById('phone').classList.remove('input-error');
    document.getElementById('address').classList.remove('input-error');

    const nameValue = document.getElementById('name').value.trim();
    const phoneValue = document.getElementById('phone').value.trim();
    const addressValue = document.getElementById('address').value.trim();
    const deliveryTypeValue = document.querySelector('input[name="delivery_type"]:checked')?.value;

    if (!nameValue) {
        isValid = false;
        document.getElementById('error-name').innerText = "Заповніть це поле";
        document.getElementById('name').classList.add('input-error');
    }
    if (!phoneValue) {
        isValid = false;
        document.getElementById('error-phone').innerText = "Заповніть це поле";
        document.getElementById('phone').classList.add('input-error');
    }
    if (deliveryTypeValue === "delivery" && !addressValue) {
        isValid = false;
        document.getElementById('error-address').innerText = "Заповніть це поле";
        document.getElementById('address').classList.add('input-error');
    }
    if (!isValid) {
        // Якщо є помилки — зупиняємося
        return;
    }

    // 2) Обчислення загальної суми замовлення (з урахуванням знижки, якщо користувач авторизований)
    let total = 0;
    window.cart.forEach(item => {
        // Якщо є item.total (ціна з добавками), беремо її, інакше — просто item.price
        const priceToShow = (item.total !== undefined ? item.total : item.price);
        total += Number(priceToShow);
    });
    let finalSum;
    if (window.isAuthenticated) {
        // Авторизований — 10% знижка
        finalSum = (total * 0.9).toFixed(2);
    } else {
        // Гість — без знижки
        finalSum = total.toFixed(2);
    }

    // 3) Якщо це гість, то формуємо guestId (щоби в банері показувати "Гість Х")
    // let guestId = null;
    // if (!window.username) {
    //     if (sessionStorage.getItem('guestId')) {
    //         guestId = sessionStorage.getItem('guestId');
    //     } else {
    //         guestId = 'guest_' + Date.now();
    //         sessionStorage.setItem('guestId', guestId);
    //     }
    // }

    fetch("/submit_order/", {
        method : "POST",
        headers: { "Content-Type": "application/json" },
        body   : JSON.stringify({
            name         : nameValue,
            phone        : phoneValue,
            address      : (deliveryTypeValue === "delivery") ? addressValue : "",
            delivery_type: deliveryTypeValue,   // "delivery" | "pickup"
            items        : window.cart.map(i => ({
                name : i.name,
                price: (i.total !== undefined ? i.total : i.price)
            }))
        })
    })
    .then(r => r.ok ? r.json() : Promise.reject(r))
    .then(({ order_id }) =>
        console.log(`✔️  Збережено замовлення №${order_id}`))
    .catch(err =>
        console.error("❌  Помилка запису в БД:", err));

    // 4) Формуємо фінальні дані для банера:
    //    - displayName: або ім’я (window.username), або "Гість XYZ"
    //    - deliveryLabel: "Доставка" або "Самовивіз"
    let displayName = window.username || "Гість";
    const deliveryLabel = (deliveryTypeValue === "delivery") ? "Доставка" : "Самовивіз";

    // 5) Розраховуємо випадковий час очікування від 20 до 40 хвилин
    const waitTime = Math.floor(Math.random() * 21) + 14; // в діапазоні [20..50]

    // 6) Формуємо текст банера (з \n або <br> — щоб розбити на рядки)
    let bannerHTML  = `<strong>Вітаємо, ${displayName}! Ваше замовлення успішно оформлено.</strong><br>`;
        bannerHTML += `Сума: <strong>${finalSum} грн</strong>.<br>`;
        bannerHTML += `Тип доставки: <strong>${deliveryLabel}</strong>`;
    if (deliveryLabel === "Доставка") {
        bannerHTML += `, Адреса: <strong>${addressValue}</strong>`;
    }
        bannerHTML += `.<br>`;
        bannerHTML += `Час очікування: <strong>приблизно ${waitTime} хвилин</strong>.`;

    // 7) Закриваємо модалку(и) з формою:
    //    Якщо у вас є окремі ідентифікатори – закриваємо одразу дві форми:
    const modalSidebar = document.getElementById('order-form-sidepanel');
    const modalMain    = document.getElementById('order-form-modal');
    // Спочатку просто ховаємо самі "вікна", не форму:
    document.getElementById('cart-modal')?.style.setProperty('display', 'none');
    document.getElementById('cart-sidepanel-overlay')?.style.setProperty('display', 'none');
    document.getElementById('cart-sidepanel')?.classList.remove('open');
    // Якщо у вас є окремі «overlay» для модалки — теж ховаємо.
    // (Наприклад: document.getElementById('order-modal-overlay').style.display = 'none';)

    // 8) Очищаємо масив cart і оновлюємо відображення (якщо бокова панель відкрита)
    window.cart = [];
    updateCartDisplay();
    if (typeof renderSidepanelCart === 'function') {
        renderSidepanelCart();
    }
    // Якщо був значок «кошика» схований — показуємо його назад
    const openBtn = document.getElementById('open-cart-btn');
    if (openBtn) openBtn.style.display = '';

    // 9) Виводимо «зелений» банер у контейнер #order-feedback-container
    const feedbackContainer = document.getElementById('order-feedback-container');
    feedbackContainer.innerHTML = `
        <div style="
            background-color: #28a745;
            color: white;
            font-weight: bold;
            padding: 12px;
            text-align: center;
            font-size: 18px;
            margin: 16px auto;
            max-width: 600px;
            border-radius: 6px;
            white-space: pre-line;
        ">
            ${bannerHTML}
        </div>
    `;

    // 10) Якщо ви хочете, щоб це повідомлення зникло через якийсь час (наприклад, через 15 секунд),
    //     можна використати:
    // setTimeout(() => { feedbackContainer.innerHTML = ''; }, 15000);
}

// ---------------------------------------------
// 2) Підвішуємо ту саму функцію обробки на обидві можливі форми 
document.addEventListener("DOMContentLoaded", () => {
    const formSidebar = document.getElementById('order-form-sidepanel');
    if (formSidebar) formSidebar.addEventListener('submit', handleOrderSubmit);

    const formModal = document.getElementById('order-form-modal');
    if (formModal) formModal.addEventListener('submit', handleOrderSubmit);
});

// Якщо треба одразу показати "Адресу" при виборі "Доставка"
window.addEventListener("DOMContentLoaded", () => {
    let checked = document.querySelector('input[name="delivery_type"]:checked');
    if (checked && checked.value === "delivery") {
        document.getElementById('address-block').style.display = "block";
        document.getElementById('address').required = true;
    }
});

// function renderSidepanelCart() {
//     const container = document.getElementById('sidepanel-cart-items');
//     container.innerHTML = '';
//     let total = 0;
//     cart.forEach((item, idx) => {
//         let extrasStr = (item.extras && item.extras.length)
//             ? `<span style="font-size:13px;color:#ffbb99;"> (${item.extras.map(e=>e.name).join(', ')})</span>` : '';
//         container.innerHTML += `
//             <div>
//                 <strong>${item.name}</strong> — ${item.total || item.price} грн ${extrasStr}
//                 <button class="remove-item-btn" onclick="removeFromCart(${idx})">Видалити</button>
//             </div>
//         `;
//         total += item.total || item.price;
//     });
//     let discountedTotal = total;
//     if (window.isAuthenticated) {
//         discountedTotal = (total * 0.9).toFixed(2);
//         document.getElementById("sidepanel-discount-text").innerText = `Знижка 10%: ${discountedTotal} грн`;
//     } else {
//         document.getElementById("sidepanel-discount-text").innerText = "";
//     }
//     document.getElementById('sidepanel-cart-total').innerHTML = `<strong>Сума: ${discountedTotal} грн</strong>`;

//     // Оновлення бейджа
//     const badge = document.getElementById("item-count");
//     const count = cart.length;
//     if (count > 0) {
//         badge.style.display = "inline-block";
//         badge.textContent = count;
//     } else {
//         badge.style.display = "none";
//         badge.textContent = "";
//     }
// }

function renderSidepanelCart() {
    const container         = document.getElementById('sidepanel-cart-items');
    const totalContainer    = document.getElementById('sidepanel-cart-total');
    const discountContainer = document.getElementById('sidepanel-discount-text');

    container.innerHTML = ''; // очищуємо
    let total = 0;

    cart.forEach((item, idx) => {
        const priceToShow = (item.total !== undefined ? item.total : item.price);
        total += Number(priceToShow);

        let extrasStr = '';
        if (item.extras && item.extras.length > 0) {
            extrasStr = `
                <span style="font-size:13px; color:#ffbb99;">
                  (${ item.extras.map(e => e.name).join(', ') })
                </span>
            `;
        }

        container.innerHTML += `
            <div style="margin-bottom: 8px; color: #000; font-weight: bold;">
                <strong>${item.name}</strong> — ${priceToShow} грн ${extrasStr}
                <button class="remove-item-btn" onclick="removeFromCart(${idx})">
                  Видалити
                </button>
            </div>
        `;
    });

    if (window.isAuthenticated) {
        // Якщо авторизовані — показуємо суму без знижки та знижку 10%
        discountContainer.innerHTML = `
            <div style="color: #fff; font-size: 18px; font-weight: bold; margin-top: 8px;">
                Сума без знижки: ${total.toFixed(2)} грн
            </div>
        `;
        const discounted = (total * 0.9).toFixed(2);
        totalContainer.innerHTML = `
            <div style="color: #00cc44; font-size: 18px; font-weight: bold; margin-top: 4px;">
                Загальна сума зі знижкою 10%: ${discounted} грн
            </div>
        `;
    } else {
        // Якщо неавторизовані — просто показати загальну суму
        discountContainer.innerHTML = '';
        totalContainer.innerHTML = `
            <div style="color: #00cc44; font-size: 18px; font-weight: bold; margin-top: 7px;">
                Загальна сума: ${total.toFixed(2)} грн
            </div>
        `;
    }

    // Оновлюємо бейдж
    const badge = document.getElementById("item-count");
    const count = cart.length;
    if (count > 0) {
        badge.style.display = "inline-block";
        badge.textContent = count;
    } else {
        badge.style.display = "none";
        badge.textContent = "";
    }
}


// Показати/сховати поле "Адреса"
document.querySelectorAll('input[name="delivery_type"]').forEach((elem) => {
    elem.addEventListener("change", function() {
        if (this.value === "delivery") {
            document.getElementById('address-block').style.display = "block";
            document.getElementById('address').required = true;
        } else {
            document.getElementById('address-block').style.display = "none";
            document.getElementById('address').required = false;
        }
    });
});




// Основна функція — додати піцу з добавками
function handleAddWithExtras(stepId) {
    if (!window.currentPizza) return;

    let extras = [];

    document.querySelectorAll('#sauces-step .extra-option:checked').forEach(cb => {
        extras.push({
            name: cb.getAttribute('data-extra'),
            price: parseFloat(cb.getAttribute('data-price'))
        });
    });
    document.querySelectorAll('#toppings-step .extra-option:checked').forEach(cb => {
        let pr = cb.getAttribute('data-price') || cb.getAttribute('data-price-30') || cb.getAttribute('data-price-40');
        extras.push({
            name: cb.getAttribute('data-extra'),
            price: parseFloat(pr || 0)
        });
    });

    const total = window.currentPizza.price + extras.reduce((sum, e) => sum + e.price, 0);
    cart.push({
        ...window.currentPizza,
        extras,
        total
    });
    window.currentPizza = null;

    document.querySelector('.extras-container').style.display = 'none';
    document.querySelector('.extras-container2').style.display = 'none';
    document.querySelectorAll('.extras-step .extra-option').forEach(cb => cb.checked = false);

    updateCartDisplay();
    renderSidepanelCart && renderSidepanelCart();
}

document.getElementById('close-cart-modal').addEventListener('click', function() {
    document.getElementById('cart-modal').style.display = 'none';
});

function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = ''; // очищуємо перед перерендером

    let total = 0;

    cart.forEach((item, idx) => {
        const priceToShow = (item.total !== undefined ? item.total : item.price);
        total += Number(priceToShow);

        // Якщо є extras (додаткові соуси/добавки) — формуємо рядок extrasStr
        let extrasStr = '';
        if (item.extras && item.extras.length > 0) {
            extrasStr = `
                <span style="font-size:13px; color:#ffbb99;">
                  (${ item.extras.map(e => e.name).join(', ') })
                </span>
            `;
        }

        // Додаємо один рядок із назвою, ціною та кнопкою “Видалити”
        cartItems.innerHTML += `
            <div style="margin-bottom: 8px; color: #000; font-weight: bold;">
                <strong>${item.name}</strong> — ${priceToShow} грн ${extrasStr}
                <button class="remove-item-btn" onclick="removeFromCart(${idx})">
                  Видалити
                </button>
            </div>
        `;
    });

    // Показуємо суму та знижку / звичайну ціну
    if (window.isAuthenticated) {
        // Якщо авторизовані — 10% знижка
        const discounted = (total * 0.9).toFixed(2);
        document.getElementById("discount-text").innerHTML = `
            <div style="color: #00cc44; font-size: 18px; font-weight: bold; margin-top: 8px;">
                Загальна сума зі знижкою 10%: ${discounted} грн
            </div>
        `;
        document.getElementById('cart-total').innerHTML = `
            <div style="color: #fff; font-size: 18px; font-weight: bold; margin-top: 4px;">
                Сума без знижки: ${total.toFixed(2)} грн
            </div>
        `;
    } else {
        // Якщо неавторизовані — просто одна фраза "Сума: ..."
        document.getElementById("discount-text").innerText = '';
        document.getElementById('cart-total').innerHTML = `
            <div style="color: #fff; font-size: 18px; font-weight: bold; margin-top: 8px;">
                Сума: ${total.toFixed(2)} грн
            </div>
        `;
    }

    // Оновлюємо бейдж з кількістю товарів
    const badge = document.getElementById("item-count");
    const count = cart.length;
    if (count > 0) {
        badge.style.display = "inline-block";
        badge.textContent = count;
    } else {
        badge.style.display = "none";
        badge.textContent = "";
    }
}

document.getElementById('add-only-sauces-to-cart').addEventListener('click', function() {
    let extras = [];
    document.querySelectorAll('.extras-container2 .extra-option:checked').forEach(cb => {
        extras.push({
            name: cb.getAttribute('data-extra'),
            price: parseFloat(cb.getAttribute('data-price')),
        });
    });
    if (extras.length) {
        extras.forEach(ex => {
            cart.push({
                name: ex.name,
                price: ex.price,
                extras: [],
                total: ex.price,
            });
        });
        updateCartDisplay();
    }
    // Очищення чекбоксів:
    document.querySelectorAll('.extras-container2 .extra-option').forEach(cb => cb.checked = false);
    document.querySelector('.extras-container2').style.display = 'none';
});


// document.getElementById('order-form').addEventListener('submit', function(e) {
//     let isValid = true;
//     // Очистити всі попередні помилки
//     document.querySelectorAll('.error-message').forEach(span => span.innerText = '');
//     document.getElementById('name').classList.remove('input-error');
//     document.getElementById('phone').classList.remove('input-error');
//     document.getElementById('address').classList.remove('input-error');

//     const name = document.getElementById('name').value.trim();
//     const phone = document.getElementById('phone').value.trim();
//     const address = document.getElementById('address').value.trim();
//     const delivery = document.querySelector('input[name="delivery_type"]:checked')?.value;

//     if (!name) {
//         document.getElementById('error-name').innerText = "Заповніть це поле";
//         document.getElementById('name').classList.add('input-error');
//         isValid = false;
//     }
//     if (!phone) {
//         document.getElementById('error-phone').innerText = "Заповніть це поле";
//         document.getElementById('phone').classList.add('input-error');
//         isValid = false;
//     }
//     if (delivery === "delivery" && !address) {
//         document.getElementById('error-address').innerText = "Заповніть це поле";
//         document.getElementById('address').classList.add('input-error');
//         isValid = false;
//     }
//     if (!isValid) e.preventDefault();
// });

////////

// document.getElementById('order-form').addEventListener('submit', function(e) {
//     e.preventDefault();  

//     // 1) Валідація так само, як було в оригіналі
//     let isValid = true;
//     document.querySelectorAll('.error-message').forEach(span => span.innerText = '');
//     document.getElementById('name').classList.remove('input-error');
//     document.getElementById('phone').classList.remove('input-error');
//     document.getElementById('address').classList.remove('input-error');

//     const nameValue = document.getElementById('name').value.trim();
//     const phoneValue = document.getElementById('phone').value.trim();
//     const addressValue = document.getElementById('address').value.trim();
//     const deliveryTypeValue = document.querySelector('input[name="delivery_type"]:checked')?.value;

//     if (!nameValue) {
//         isValid = false;
//         document.getElementById('error-name').innerText = "Заповніть це поле";
//         document.getElementById('name').classList.add('input-error');
//     }
//     if (!phoneValue) {
//         isValid = false;
//         document.getElementById('error-phone').innerText = "Заповніть це поле";
//         document.getElementById('phone').classList.add('input-error');
//     }
//     if (deliveryTypeValue === "delivery" && !addressValue) {
//         isValid = false;
//         document.getElementById('error-address').innerText = "Заповніть це поле";
//         document.getElementById('address').classList.add('input-error');
//     }
//     if (!isValid) {
//         // якщо є помилки валідації, не йдемо далі
//         return;
//     }

//     // 2) Обчислення суми (та знижки, якщо потрібно)
//     let total = 0;
//     cart.forEach(item => {
//         const priceToShow = (item.total !== undefined ? item.total : item.price);
//         total += Number(priceToShow);
//     });
//     let finalSum;
//     if (window.isAuthenticated) {
//         // За замовчуванням - 10% знижка для авторизованих
//         finalSum = (total * 0.9).toFixed(2);
//     } else {
//         finalSum = total.toFixed(2);
//     }

//     // 3) Генерація guestId, якщо користувач не залогований
//     let guestId = null;
//     if (!window.username) {
//         // якщо гість, зберігаємо локально однаковий гостьовий ID 
//         // (щоб він був однаковий, поки ми на одній сесії)
//         if (sessionStorage.getItem('guestId')) {
//             guestId = sessionStorage.getItem('guestId');
//         } else {
//             guestId = 'guest_' + Date.now(); 
//             sessionStorage.setItem('guestId', guestId);
//         }
//     }

//     // 4) Який тип доставки будемо показувати у фінальному повідомленні
//     const deliveryLabel = (deliveryTypeValue === "delivery") ? "Доставка" : "Самовивіз";

//     // 5) Збір всіх деталей у об’єкт
//     const orderDetails = {
//         name: nameValue || null,
//         guestId: guestId,              // або null, якщо авторизований
//         totalSum: finalSum,
//         deliveryType: deliveryLabel,
//         address: (deliveryTypeValue === "delivery") ? addressValue : null,
//         comment: document.getElementById('comment').value.trim(),
//         phone: phoneValue,
//         timestamp: Date.now()
//     };

//     // 6) Зберігаємо у SessionStorage, щоб потім на головній вивести повідомлення
//     sessionStorage.setItem('recentOrder', JSON.stringify(orderDetails));

//     // 7) ВІДПРАВЛЯЄМО в Telegram (Fetch у Telegram Bot API).
//     // — замініть 'YOUR_BOT_TOKEN' і 'YOUR_CHAT_ID' на ваші значення
//     const BOT_TOKEN = "ВАШ_КОМАНДНИЙ_ТОКЕН_ІЗ_@BotFather_";
//     const CHAT_ID  = "ВАШ_CHAT_ID";
//     // Формуємо текст повідомлення, яке прийде в Telegram:
//     let displayName = window.username 
//                       ? window.username 
//                       : ("Гість " + (guestId || ""));
//     let telegramText = `📦 *Нове Замовлення!*%0A`
//                      + `*Користувач:* ${displayName}%0A`
//                      + `*Телефон:* ${orderDetails.phone}%0A`
//                      + `*Сума:* ${orderDetails.totalSum} грн%0A`
//                      + `*Тип:* ${orderDetails.deliveryType}%0A`;
//     if (orderDetails.address) {
//         telegramText += `*Адреса:* ${orderDetails.address}%0A`;
//     }
//     telegramText += `*Коментар:* ${orderDetails.comment || "-"}%0A`
//                   + `*Час:* ${new Date(orderDetails.timestamp).toLocaleString()}`;

//     fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//             chat_id: CHAT_ID,
//             parse_mode: "Markdown",
//             text: telegramText
//         })
//     })
//     .then(res => res.json())
//     .then(data => {
//         console.log("Telegram response:", data);
//         // 8) Нарешті – редіректимо користувача на головну:
//         window.location.href = "/";
//     })
//     .catch(err => {
//         console.error("Помилка надсилання в Telegram:", err);
//         // навіть якщо телеграм упав, все одно йдемо на головну
//         window.location.href = "/";
//     });
// });

document.getElementById('order-form').addEventListener('submit', function(e) {
    e.preventDefault();

    // 1) Валідація полів (як було до цього)
    let isValid = true;
    // Очищаємо попередні повідомлення про помилки
    document.querySelectorAll('.error-message').forEach(span => span.innerText = '');
    document.getElementById('name').classList.remove('input-error');
    document.getElementById('phone').classList.remove('input-error');
    document.getElementById('address').classList.remove('input-error');

    const nameValue = document.getElementById('name').value.trim();
    const phoneValue = document.getElementById('phone').value.trim();
    const addressValue = document.getElementById('address').value.trim();
    const deliveryTypeValue = document.querySelector('input[name="delivery_type"]:checked')?.value;

    if (!nameValue) {
        isValid = false;
        document.getElementById('error-name').innerText = "Заповніть це поле";
        document.getElementById('name').classList.add('input-error');
    }
    if (!phoneValue) {
        isValid = false;
        document.getElementById('error-phone').innerText = "Заповніть це поле";
        document.getElementById('phone').classList.add('input-error');
    }
    if (deliveryTypeValue === "delivery" && !addressValue) {
        isValid = false;
        document.getElementById('error-address').innerText = "Заповніть це поле";
        document.getElementById('address').classList.add('input-error');
    }
    if (!isValid) {
        // Якщо є помилки — не продовжуємо
        return;
    }

    // 2) Підрахунок загальної суми (включно із знижкою)
    let total = 0;
    window.cart.forEach(item => {
        const priceToShow = (item.total !== undefined ? item.total : item.price);
        total += Number(priceToShow);
    });
    let finalSum;
    if (window.isAuthenticated) {
        // 10% знижка
        finalSum = (total * 0.9).toFixed(2);
    } else {
        finalSum = total.toFixed(2);
    }

    // 3) Визначаємо guestId (якщо це гість)
    let guestId = null;
    if (!window.username) {
        if (sessionStorage.getItem('guestId')) {
            guestId = sessionStorage.getItem('guestId');
        } else {
            guestId = 'guest_' + Date.now();
            sessionStorage.setItem('guestId', guestId);
        }
    }

    // 4) Формуємо текст для банера
    let displayName = window.username ? window.username : ("Гість " + (guestId || ""));
    const deliveryLabel = (deliveryTypeValue === "delivery") ? "Доставка" : "Самовивіз";

    let bannerText  = `Вітаємо, ${displayName}! Ваше замовлення успішно оформлено.\n`;
        bannerText += `Сума: ${finalSum} грн\n`;
        bannerText += `Тип доставки: ${deliveryLabel}${ deliveryLabel === "Доставка" ? `, Адреса: ${addressValue}` : "" }\n`;
        bannerText += `Час очікування: приблизно 30–40 хвилин.\n`;

    // 5) Закриваємо модальне вікно “Ваш кошик”
    document.getElementById('cart-modal').style.display = 'none';

    // 6) Очищаємо масив cart та оновлюємо обидва відображення (модалка + бічна панель, якщо вона відкрита)
    window.cart = [];
    updateCartDisplay();
    if (typeof renderSidepanelCart === 'function') {
        renderSidepanelCart();
    }

    // 7) Показуємо зелений банер зверху
    const feedbackContainer = document.getElementById('order-feedback-container');
    feedbackContainer.innerHTML = `
        <div style="
            background-color: #28a745;
            color: white;
            font-weight: bold;
            padding: 12px;
            text-align: center;
            font-size: 18px;
            margin-bottom: 16px;
            white-space: pre-line;
        ">
            ${bannerText}
        </div>
    `;

    // 8) (Важливо!) Повертаємо видимість значка кошика, якщо він був захований
    const openBtn = document.getElementById('open-cart-btn');
    if (openBtn) {
        openBtn.style.display = '';
    }
});
