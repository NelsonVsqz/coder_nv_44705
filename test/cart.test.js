const { expect } = require('chai');
const request = require('supertest');
const app = "http://localhost:8080"; 


describe('Cart Routes', function(){

  let authToken; 
  let cartId; 

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

  it('should create a new cart', async () => {
    const res = await request(app)
      .post('/carts')
      .set('Cookie', [authToken]);

    expect(res.status).to.equal(201);
    expect(res.body).to.be.an('object');
    expect(res.body.id).to.be.a('number');
    cartId = res.body.id; 
  });

  it('should get a cart by ID', async () => {
    const res = await request(app)
      .get(`/carts/${cartId}`)
      .set('Cookie', [authToken]);

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');

  });

  it('should add a product to the cart', async () => {
     
    const productId = '64801547fb2af9c5ddb19c65';
    const quantity = 1; 

    const res = await request(app)
      .post(`/carts/${cartId}/product/${productId}`)
      .send({ quantity })
      .set('Cookie', [authToken]);

    expect(res.status).to.equal(201);
    expect(res.body).to.be.an('array');

  });


  after(async () => {
      
    const res = await request(app)
      .post('/auth/logout')
      .set('Cookie', [authToken]);

    authToken = null;

  });
});
