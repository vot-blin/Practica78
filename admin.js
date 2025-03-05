const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const port = 8080;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

const productsPath = path.join(__dirname, 'products.json');

function readProducts() {
    const data = fs.readFileSync(productsPath, 'utf8');
    return JSON.parse(data);
}

function writeProducts(products) {
    fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
}

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'index1.html'));
});

app.get('/api/products', (req, res) => {
    const products = readProducts();
    res.json(products);
});

// Маршрут для добавления товара
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

// Маршрут для редактирования товара
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

// Маршрут для удаления товара
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

app.listen(port, () => {
    console.log(`Admin server is running on http://localhost:${port}`);
});