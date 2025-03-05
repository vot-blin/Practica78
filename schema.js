const { buildSchema } = require('graphql');

const schema = buildSchema(`
  type Product {
    id: Int
    title: String
    price: Int
    description: String
    category: [String]
  }

  type Query {
    products: [Product]
    product(id: Int!): Product
  }
`);

module.exports = schema;