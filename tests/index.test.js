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

    it('POST /search should return 200 and render search results for a valid book', async () => {
        const res = await request(app)
            .post('/search')
            .send({ search: 'Intermezzo' })
            .set('Accept', 'application/json');

        expect(res.statusCode).toBe(200);
        expect(res.text).toContain('Showing results');
        expect(res.text).toContain('Intermezzo');
    });

    it('POST /search should return 200 and render empty results for no matching book', async () => {
        const res = await request(app)
            .post('/search')
            .send({ search: 'Fake Book Title' })
            .set('Accept', 'application/json');

        expect(res.statusCode).toBe(200);
        expect(res.text).toContain('No book found');
        expect(res.text).toContain('Fake Book Title');
    });

    it('POST /recentlyviewed should return 400 when no IDs are provided', async () => {
        const res = await request(app)
            .post('/recentlyviewed')
            .send({ ids: [] })
            .set('Accept', 'application/json');

        expect(res.statusCode).toBe(400);
    });

    it('POST /recentlyviewed should return 200 and books when valid IDs are provided', async () => {
        const res = await request(app)
            .post('/recentlyviewed')
            .send({ ids: [1, 2] })   // assumes books with IDs 1 and 2 exist
            .set('Accept', 'application/json');

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
    });

    it('POST /wishlist should return 400 when no IDs are provided', async () => {
        const res = await request(app)
            .post('/wishlist')
            .send({ ids: [] })
            .set('Accept', 'application/json');

        expect(res.statusCode).toBe(400);
    });

    it('POST /wishlist should return 200 and books when valid IDs are provided', async () => {
        const res = await request(app)
            .post('/wishlist')
            .send({ ids: [1] })
            .set('Accept', 'application/json');

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('POST /drafts should return 400 when no IDs are provided', async () => {
        const res = await request(app)
            .post('/drafts')
            .send({ ids: [] })
            .set('Accept', 'application/json');

        expect(res.statusCode).toBe(400);
    });

    it('POST /drafts should return 200 and books when valid IDs are provided', async () => {
        const res = await request(app)
            .post('/drafts')
            .send({ ids: [1, 2] })
            .set('Accept', 'application/json');

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
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
});

describe('POST /submitenquiry DB error handling', () => {
    let runSpy, allSpy;

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should handle DB insertion error gracefully', async () => {
        runSpy = jest.spyOn(enquiryDB, 'run').mockImplementation((query, params, cb) => cb(new Error('Insertion failed')));

        const res = await request(app)
            .post('/submitenquiry')
            .send({
                firstname: 'John',
                surname: 'Doe',
                email: 'john@test.com',
                mobile: '0412345678',
                address: '123 St',
                state: 'VIC',
                postcode: '3000',
                message: 'Hello',
                reason: 'General'
            });

        expect(res.statusCode).toBe(200);
    });

    it('should handle DB fetch error after insertion', async () => {
        runSpy = jest.spyOn(enquiryDB, 'run').mockImplementation((query, params, cb) => cb(null));
        allSpy = jest.spyOn(enquiryDB, 'all').mockImplementation((query, params, cb) => cb(new Error('Fetch failed')));

        const res = await request(app)
            .post('/submitenquiry')
            .send({
                firstname: 'John',
                surname: 'Doe',
                email: 'john@test.com',
                mobile: '0412345678',
                address: '123 St',
                state: 'VIC',
                postcode: '3000',
                message: 'Hello',
                reason: 'General'
            });

        expect(res.statusCode).toBe(200);
    });
});