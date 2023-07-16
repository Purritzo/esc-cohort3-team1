import { createTenant } from "../models/landlord_model.js";
import { pool, cleanup } from "../config/database.js";       // test api
// import { controllerCreateTenant } from "../controller/landlord_controller.js";  // test controller
import { genSaltSync, hashSync } from "bcrypt";

async function setup() {
    try {
        pool.query(`
            DELETE FROM tenant_user;`
        );
        pool.query(`
            INSERT INTO tenant_user (email, password)
            VALUES ('tester@email.com.com', 'password')
        `);
    } catch (error) {
        console.error("setup failed. " + error);
        throw error;
    }
}

async function teardown() {
    // TODO restore the table from the backup
    try {
        pool.query(`
        DELETE FROM tenant_user;`);
        cleanup();    // closes connection pool
    } catch (error) {
        console.error("teardown failed. " + error);
        throw error;
    }
}

describe("create tenant api test-suite", () => {
    beforeAll(async () => {
        await setup();
    });

    test("unique email and password >6 char", async () => {
        const salt = genSaltSync(10);
        const password = hashSync("password", salt);
        const expected = {email:'tester1@email.com', password: `${password}`};
        createTenant({email:'tester1@email.com', password:'password'}, (err, results) => {
            expect(results).toEqual(expected);
        });
    })

    test("non-unique email", async () => {
        try {
            createTenant({email:'tester1@email.com', password:'passwords'}, (err, results) => {});
        } catch(e) {
            expect(e.code).toBe('ER_DUP_ENTRY'); // duplicate entry error
        }
    })

    afterAll(async () => {
        await teardown();
    });
})