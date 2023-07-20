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
          success: 1,
          message: "This is a working REST API",
        });
      });
  });
  test("POST/tenant/createTicket", () => {});
});
