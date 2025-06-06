// let cart = [];
// let itemCount = 0;
// let itemCountDisplay;

// function updateCartDisplay() {
//     const cartContainer = document.getElementById("cart-items");
//     const cartTotalDisplay = document.getElementById("cart-total");
//     const discountText = document.getElementById("discount-text");
//     cartContainer.innerHTML = "";
//     let total = 0;

//     cart.forEach(item => {
//         total += item.price * (item.quantity || 1);
//         const row = document.createElement("div");
//         row.innerText = `${item.name} — ${item.price} грн`;
//         cartContainer.appendChild(row);
//     });

//     let discountedTotal = total;
//     if (window.isAuthenticated) {
//         discountedTotal = (total * 0.9).toFixed(2);
//         discountText.innerText = `Знижка 10% для зареєстрованих: ${discountedTotal} грн`;
//     } else {
//         discountText.innerText = "";
//     }

//     cartTotalDisplay.innerText = `Всього: ${discountedTotal} грн`;
// }

// function openExtrasModal(itemName) {
//     const modal = document.getElementById("extrasModal");
//     const itemTitle = document.getElementById("selectedItemName");
//     itemTitle.textContent = itemName;
//     modal.style.display = "flex";

//     document.getElementById('selectedItemName').innerText = itemName;
//     document.querySelector('.extras-container').style.display = 'flex';
// }

// function addToCartWithExtras() {
//     const name = document.getElementById('selectedItemName').innerText;
//     const extras = Array.from(document.querySelectorAll('#extrasModal input:checked')).map(input => input.value);
//     const item = {
//         name: name + " + " + extras.join(", "),
//         price: 0  // Тут можеш додати логіку підрахунку ціни, якщо хочеш
//     };
//     cart.push(item);
//     updateCartDisplay();
//     document.getElementById('extrasModal').style.display = 'none';
// }
  
// function closeExtras() {
//     const extrasContainer = document.querySelector(".extras-container");
//     if (extrasContainer) {
//         extrasContainer.style.display = "none";
//     }
// }
    

// document.getElementById("submit-order-btn").addEventListener("click", function () {
//     const deliveryOption = document.querySelector('input[name="delivery-option"]:checked').value;

//     const name = deliveryOption === "Самовивіз"
//         ? document.getElementById("pickup-name").value
//         : document.getElementById("delivery-name").value;

//     const phone = deliveryOption === "Самовивіз"
//         ? document.getElementById("pickup-phone").value
//         : document.getElementById("delivery-phone").value;

//     const address = deliveryOption === "Доставка"
//         ? document.getElementById("delivery-address").value
//         : "";

//     const comment = document.getElementById("delivery-comment").value;

//     fetch("/submit-order/", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//             "X-CSRFToken": getCookie("csrftoken"),
//         },
//         body: JSON.stringify({
//             name,
//             phone,
//             address,
//             comment,
//             delivery_type: deliveryOption === "Самовивіз" ? "pickup" : "delivery",
//             items: cart,
//         }),
//     })
//     .then(res => res.json())
//     .then(data => {
//         alert(data.message || "Замовлення успішно надіслано!");
//         location.reload();
//     })
//     .catch(err => {
//         console.error(err);
//         alert("Помилка надсилання замовлення.");
//     });
// });

// document.addEventListener("DOMContentLoaded", function () {
//     const openBtn = document.getElementById("open-review-modal");
//     const modal = document.getElementById("reviewModal");
//     const closeBtn = document.getElementById("closeReviewModal");
//     const deliveryRadios = document.querySelectorAll('input[name="delivery_type"]');
//     const addressField = document.getElementById('address-field');

//     deliveryRadios.forEach(radio => {
//         radio.addEventListener('change', () => {
//             if (radio.value === 'pickup') {
//                 addressField.style.display = 'none';
//             } else {
//                 addressField.style.display = 'block';
//             }
//         });
//     });
    
//     if (openBtn && modal && closeBtn) {
//         openBtn.addEventListener("click", () => {
//             modal.style.display = "flex";
//         });

//         closeBtn.addEventListener("click", () => {
//             modal.style.display = "none";
//         });

//         window.addEventListener("click", (event) => {
//             if (event.target === modal) {
//                 modal.style.display = "none";
//             }
//         });
//     } else {
//         console.warn("Кнопка не працює. У модальному вікні не знайдено в DOM функцію.");
//     }
// });

// function closeReviewModal() {
//     setTimeout(() => {
//         const modal = document.getElementById("reviewModal");
//         if (modal) modal.style.display = "none";
//     }, 500); // зачекати, щоб POST відправився
// }

