const request = require('supertest');
const express = require('express');
const app = require('../index');
const sqlite3 = require('sqlite3').verbose();

let booksDB;
let enquiryDB;

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

beforeAll((done) => {
    booksDB = new sqlite3.Database('./booksDB.db', sqlite3.OPEN_READWRITE, (err) => {
        if (err) return done(err);
        console.log('Connected to booksDB.db for testing');
    });

    enquiryDB = new sqlite3.Database('./enquiryDB.db', sqlite3.OPEN_READWRITE, (err) => {
        if (err) return done(err);
        console.log('Connected to enquiryDB.db for testing');
        done();
    });
});

afterAll((done) => {
    booksDB.close();
    enquiryDB.close();
    done();
});

describe('CozyLight Bookstore Database tests', () => {
    it('Books table should return at least one book', (done) => {
        booksDB.all('SELECT * FROM BOOKS', [], (err, rows) => {
            expect(err).toBeNull();
            expect(rows.length).toBeGreaterThan(0);
            done();
        });
    });

    it('Enquiry insert should succeed with valid data', (done) => {
        enquiryDB.run(
            `INSERT INTO ENQUIRY (reason, fname, sname, email, mobile, address, state, postcode, message)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            ['Question', 'Jane', 'Smith', 'jane@test.com', '0411111111', '456 Another St', 'VIC', '3001', 'Hello!'],
            function(err) {
                expect(err).toBeNull();
                enquiryDB.all('SELECT * FROM ENQUIRY WHERE email = ?', ['jane@test.com'], (err, rows) => {
                    expect(err).toBeNull();
                    expect(rows.length).toBe(1);
                    done();
                });
            }
        );
    });

    it('Enquiry insert should fail with missing required fields', (done) => {
        enquiryDB.run(
            `INSERT INTO ENQUIRY (reason, fname, email) VALUES (?, ?, ?)`,
            ['Q', 'Bad', null],
            function(err) {
                expect(err).not.toBeNull();
                done();
            }
        );
    });
})