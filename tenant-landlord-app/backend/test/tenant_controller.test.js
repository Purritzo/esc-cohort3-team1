//import '@babel/polyfill'  // support for async/await
// import request from "supertest";
// import assert from "assert";
// import express from "express";
// import app from "../app.js";
import { controllerAddFeedbackRating } from "../controller/tenant_controller";
import { addFeedbackRating } from '../models/tenant_model';
import router from "../routes/tenant_router";
//var http = require('http');

// const requestWithSupertest = supertest(controllerAddFeedbackRating)

// describe('testing_tenant_controller_viahttp', () => {

// })

// describe('testing tenant_controller', () => {
//     test('add feedback rating, responding with 200 status code', async () => {
//         // const id = 5;
//         // const body = {feedback_rating : 4}
//         // const token = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZXN1bHQiOnsibGFuZGxvcmRfdXNlcl9pZCI6MTAsImVtYWlsIjoibmludGhsYW5kbG9yZEBnbWFpbC5jb20iLCJ0aWNrZXRfdHlwZSI6IjEifSwiaWF0IjoxNjg5NDk5NDMyLCJleHAiOjE2ODk1MDMwMzJ9.tdJBnSX1_ovTaWchDFvCdy2vBb7J1nnVPoKPA2Ws1wU;
//         // const response = addFeedbackRating(id, body)
//         const login = await request(app).post("api/landlord/login").send({
//             "email" : "ninthlandlord@gmail.com",
//             "password" : "password"
//         })
//         const token = login.token
//         console.log(token)
//         const response = await request(app).patch("/api/tenant/addFeedbackRating/2", token ,controllerAddFeedbackRating).send({
//             "feedback_rating" : 3
//         })
//         expect(response.statusCode).toBe(200)
//     })
// });

// describe('GET /user', function() {
//     it('responds with json', function(done) {
//       request(app)
//         .get('/user')
//         .auth('username', 'password')
//         .set('Accept', 'application/json')
//         .expect('Content-Type', /json/)
//         .expect(200, done);
//     });
//   });