const products = require('./products.json');

const resolvers = {
  products: () => products,
  product: ({ id }) => products.find(product => product.id === id),
};

module.exports = resolvers;