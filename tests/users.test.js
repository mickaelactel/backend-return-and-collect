const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/users');

const newUser = {
  firstName: 'Mickael',
  lastName: 'LeGrandTesteur',
  email: 'test@ouiouitest.com',
  phone: '1234567890',
  password: 'test123',
  confirmPassword: 'test123',
  userType: 'SENDER',
  address: '18, rue de la Paix',
  city: 'Brest',
  zipcode: '29200',
};

beforeEach(async () => {
  await User.deleteOne({ email: newUser.email });
});

it('User', () => {
  expect(User).toBeDefined();

  const newFakeUser = new User(newUser);

  expect(newFakeUser).toHaveProperty('_id');
  expect(newFakeUser).toHaveProperty('token', newUser.token);
  expect(newFakeUser).toHaveProperty('firstName', newUser.firstName);
  expect(newFakeUser).toHaveProperty('lastName', newUser.lastName);
  expect(newFakeUser).toHaveProperty('email', newUser.email);
  expect(newFakeUser).toHaveProperty('phone', newUser.phone);
  expect(newFakeUser).toHaveProperty('password', newUser.password);
  expect(newFakeUser).toHaveProperty('confirmPassword', newUser.confirmPassword);
  expect(newFakeUser).toHaveProperty('userType', newUser.userType);
  expect(newFakeUser).toHaveProperty('address', newUser.address);
  expect(newFakeUser).toHaveProperty('city', newUser.city);
  expect(newFakeUser).toHaveProperty('zipcode', newUser.zipcode);
});

it('POST /users/signup', async () => {
  const res = await request(app).post('/users/signup').send(newUser);

  expect(res.statusCode).toBe(200);
  expect(res.body.result).toBe(true);
  expect(res.body.token).toEqual(expect.any(String));
});

it('POST /users/signin', async () => {
  const res = await request(app).post('/users/signup').send(newUser);
  expect(res.statusCode).toBe(200);
  expect(res.body.result).toBe(true);
  expect(res.body.token).toEqual(expect.any(String));

  const res2 = await request(app).post('/users/signin').send({
    email: newUser.email,
    password: newUser.password,
  });
  expect(res2.statusCode).toBe(200);
  expect(res2.body.result).toBe(true);
  expect(res.body.token).toEqual(expect.any(String));
});

afterAll(async () => {
  await User.deleteOne({ email: newUser.email });
  mongoose.connection.close();
});
