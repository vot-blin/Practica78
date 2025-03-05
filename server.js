const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./schema");
const resolvers = require("./resolvers");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const app = express();
const port = 3000;

// Используем CORS для разрешения кросс-доменных запросов
app.use(cors());

// Middleware для обработки JSON
app.use(express.json());

// Отдача статических файлов (HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

// Путь к файлу с товарами
const productsPath = path.join(__dirname, 'products.json');

// Функция для чтения товаров из файла
function readProducts() {
    try {
        const data = fs.readFileSync(productsPath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error reading products.json:', err);
        return []; // Если файл не существует или пуст, возвращаем пустой массив
    }
}

// Функция для записи товаров в файл
function writeProducts(products) {
    fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
}

// REST API для получения списка товаров
app.get('/api/products', (req, res) => {
    const products = readProducts();
    res.json(products);
});

// REST API для добавления товара
app.post('/api/products', (req, res) => {
    const products = readProducts();
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1; // Новый ID
    const newProduct = {
        id: newId,
        title: req.body.title,
        price: req.body.price
    };
    products.push(newProduct);
    writeProducts(products);
    res.json(newProduct);
});

// REST API для редактирования товара
app.post('/api/products/:id', (req, res) => {
    const products = readProducts();
    const productId = parseInt(req.params.id);
    const updatedProduct = req.body;
    const index = products.findIndex(p => p.id === productId);
    if (index !== -1) {
        products[index] = { ...products[index], ...updatedProduct };
        writeProducts(products);
        res.json(products[index]);
    } else {
        res.status(404).send('Product not found');
    }
});

// REST API для удаления товара
app.delete('/api/products/:id', (req, res) => {
    const products = readProducts();
    const productId = parseInt(req.params.id);
    const filteredProducts = products.filter(p => p.id !== productId);

    // Пересчитываем ID оставшихся товаров
    const updatedProducts = filteredProducts.map((product, index) => ({
        ...product,
        id: index + 1, // Новый ID
    }));

    writeProducts(updatedProducts);
    res.status(204).send();
});

// GraphQL endpoint
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: resolvers,
    graphiql: true, // Включить GraphiQL для тестирования
}));

// Запуск сервера
app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});