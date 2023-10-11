const { expect } = require('chai');
const request = require('supertest');
const app = "http://localhost:8080"

describe('Product Routes', () => {
  let authToken; 

  before(async () => {
    
    const loginData = {
      email: 'admin@admin.com', 
      password: '123456',
    };

    const res = await request(app)
      .post('/auth/login')
      .send(loginData);

    authToken = res.headers['set-cookie'][0]; 
  });

  it('should get all products', async () => {

    const res = await request(app)
      .get('/products')
      .set('Cookie', [authToken]);

    expect(res.statusCode).to.equal(200);
    expect(res.req._hasBody).to.be.equal(true);
    expect(res.res.statusMessage).to.be.equal('OK');

  });

  it('should get a product by ID', async () => {

    const productId = '64801547fb2af9c5ddb19c65'; //Ladrillo

    const res = await request(app)
      .get(`/products/${productId}`)
      .set('Cookie', [authToken]);

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('object');

  });

  it('should add a new product', async () => {
    const newProduct = {
      title: 'New Product',
      description: 'Description of the new product',
      code: '12345',
      price: 19.99,
      stock: 50,
      category: 'Electronics',
      thumbnail: ['thumbnail1.jpg', 'thumbnail2.jpg'],
    };

    const res = await request(app)
      .post('/products')
      .send(newProduct)
      .set('Cookie', [authToken]);

    expect(res.status).to.equal(201);
    expect(res.body).to.be.an('object');

  });

  it('should update an existing product', async () => {

    const productId = '6515e3150f32227251396d90';//Hacha metal
    const updatedProduct = {
      title: 'Hacha metal b',
      price: 399.99,
    };

    const res = await request(app)
      .put(`/products/${productId}`)
      .send(updatedProduct)
      .set('Cookie', [authToken]);

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('object');

  });
/*
  it('should delete an existing product', async () => {

    const productId = 'id';

    const res = await request(app)
      .delete(`/products/${productId}`)
      .set('Cookie', [authToken]);

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('object');

  });
*/
  after(async () => {

    const res = await request(app)
      .post('/auth/logout')
      .set('Cookie', [authToken]);

    authToken = null;
  });
});
