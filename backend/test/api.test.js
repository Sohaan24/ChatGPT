const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../server"); 
require("dotenv").config();


beforeAll(async () => {
    
    await mongoose.connect(process.env.MONGO_URL);
});

afterAll(async () => {
    
    await mongoose.connection.collection("users").deleteOne({ email: "test@example.com" });
    await mongoose.connection.close();
});

describe("API Endpoints Testing", () => {
    
    it("POST /api/guest - Should return AI reply", async () => {
        const res = await request(app)
            .post("/api/guest")
            .send({
                messages: [{ role: "user", content: "Hello, say hi!" }]
            });
        
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("reply");
    });


    it("POST /api/auth/signup - Should register a new user", async () => {
        const res = await request(app)
            .post("/api/auth/signup")
            .send({
                name: "Test User",
                email: "test@example.com",
                password: "password123"
            });

        
        expect(res.statusCode).toBeOneOf([200, 201]); 
        expect(res.body).toHaveProperty("token");
        expect(res.body.user).toHaveProperty("email", "test@example.com");
    });

 
    it("POST /api/auth/login - Should login the user", async () => {
        const res = await request(app)
            .post("/api/auth/login")
            .send({
                email: "test@example.com",
                password: "password123"
            });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("token");
        expect(res.body.status).toBe(true);
    });

   
    it("POST /api/auth/login - Should fail with wrong password", async () => {
        const res = await request(app)
            .post("/api/auth/login")
            .send({
                email: "test@example.com",
                password: "wrongpassword"
            });

       
        expect(res.body.status).toBe(false);
    });
});


expect.extend({
    toBeOneOf(received, expected) {
        const pass = expected.includes(received);
        if (pass) {
            return { message: () => `expected ${received} to be one of ${expected}`, pass: true };
        } else {
            return { message: () => `expected ${received} to be one of ${expected}`, pass: false };
        }
    },
});