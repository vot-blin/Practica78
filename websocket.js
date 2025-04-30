const WebSocket = require('ws');

// Создаем WebSocket сервер
const wss = new WebSocket.Server({ port: 8081 });

wss.on('connection', (ws) => {
    console.log('Новое соединение');

    // Обработка сообщений от клиента
    ws.on('message', message => {
        textMessage = message.toString();
        console.log("Получено сообщение: ", textMessage);
        // Отправляем сообщение всем подключенным клиентам
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(textMessage);
            }
        });
    });

    // Обработка закрытия соединения
    ws.on('close', () => {
        console.log('Соединение закрыто');
    });
});

console.log('Сервер запущен на http://localhost:8081');