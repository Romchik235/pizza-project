const botToken = "7852903031:AAFqpvqkSoIl0brvZR_dLP_KTw0MAtRV32g"; // Замість цього тексту вставте свій токен
const chatId = "5962734335"; // Вставте ваш chat_id
const message = "Чіназес";

// Формуємо URL для API Telegram
const apiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

// Відправка запиту
fetch(apiUrl, {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    chat_id: chatId,
    text: message
  })
})
  .then(response => response.json())
  .then(data => {
    if (data.ok) {
      console.log("Повідомлення успішно відправлено:", data);
    } else {
      console.error("Помилка відправки повідомлення:", data.description);
    }
  })
  .catch(error => console.error("Помилка запиту:", error));
