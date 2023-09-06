const {faker} = require('@faker-js/faker');

function generateRandomProduct() {
  const productName = faker.commerce.productName();
  const description = faker.lorem.sentence();
  const price = faker.number.int({ min: 1, max: 1000 });
  const thumbnail = [faker.image.url()];
  const code = faker.string.uuid();
  const stock = faker.number.int({ min: 0, max: 100 });
  const status = faker.datatype.boolean();
  const id = faker.number.int();
  const category = faker.commerce.department();

  return {
    title: productName || 'Default Product Name',
    description: description || 'Default Description',
    price: price || 0,
    thumbnail: thumbnail || [],
    code: code || 'Default Code',
    stock: stock || 0,
    status: status || false,
    id: id || 0,
    category: category || 'Default Category',
  };
}

function generateRandomProducts(count) {
  const products = [];
  for (let i = 0; i < count; i++) {
    products.push(generateRandomProduct());
  }
  return products;
}

module.exports = {
  generateRandomProducts,
};
