import request from "supertest";
import app from "../app.js";

describe("API", () => {
  test("GET/api", () => {
    return request(app)
      .get("/api")
      .expect("Content-Type", /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual({
          success: expect.anything(),
          message: expect.any(String),
        });
      });
  });

  test("POST/tenant/createTicketTest", () => {
    // Define the data you want to send in the request body
    const requestBody = {
      name: "John Doe",
      email: "john@example.com",
      request_type: "Technical Support",
      request_description: "I need help with my computer.",
      submitted_date_time: "2023-07-21T12:34:56Z", // Replace with an appropriate date-time
    };
    // Make the POST request to the API endpoint

    return request(app)
      .post("/api/tenant/createTicketTest")
      .send(requestBody)
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual({
          success: 1, // Success is a number (1)
          data: expect.objectContaining({
            fieldCount: expect.any(Number),
            affectedRows: expect.any(Number),
            insertId: expect.any(Number),
            info: expect.any(String),
            serverStatus: expect.any(Number),
            warningStatus: expect.any(Number),
          }),
        });
      });
  });
});
