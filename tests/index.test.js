const request = require('supertest');
const express = require('express');
const app = require('../index');

describe('CozyLight Bookstore API tests', () => {

    it('GET / should return 200 and render index page', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toBe(200);
        expect(res.text).toContain('<!DOCTYPE html>');
    });

    it('GET /books should return 200 and render books page', async () => {
        const res = await request(app).get('/books');
        expect(res.statusCode).toBe(200);
        expect(res.text).toContain('<!DOCTYPE html>');
    })

    it('GET /bestseller should return 200 and render bestseller page', async () => {
        const res = await request(app).get('/bestseller');
        expect(res.statusCode).toBe(200);
        expect(res.text).toContain('<!DOCTYPE html>');
    })

    it('GET /product/:id should return 200 for a valid book ID', async () => {
        const res = await request(app).get('/product/2');
        expect(res.statusCode).toBe(200);
        expect(res.text).toContain('<!DOCTYPE html>');
    })

    it('GET /product/:id should return 404 for an invalid book ID', async () => {
        const res = await request(app).get('/product/9999');
        expect(res.statusCode).toBe(404);
    })

    it('POST /submitenquiry should return 200 when data is valid', async () => {
        const enquiryData = {
            reason: 'Question',
            firtname: 'John',
            surname: 'Doe',
            email: 'john@testing.com',
            mobile: '0412345678',
            address: '123 Test St',
            state: 'VIC',
            postcode: '3000',
            message: 'Test enquiry'
        };

        const res = await request(app)
            .post('/submitenquiry')
            .send(enquiryData)
            .set('Accept', 'application/json');
        
            expect(res.statusCode).toBe(200);
            expect(res.text).toContain('<!DOCTYPE html>');
    });

    it('POST /submitenquiry should return 200 with validation errors when data is invalid', async () => {
        const invalidData = {
            reason: '',
            firtname: '',
            surname: 'Doe',
            email: '',
            mobile: '123',
            address: '',
            state: '',
            postcode: '3000',
            message: ''
        };

        const res = await request(app)
            .post('/submitenquiry')
            .send(invalidData)
            .set('Accept', 'application/json');
        
            expect(res.statusCode).toBe(200);
            expect(res.text).toContain('Please');
    });
});