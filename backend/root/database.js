import { createPool }  from "mysql2";
import dotenv from "dotenv";
dotenv.config();

// create db connection
const pool = createPool({
    user            :   process.env.DATABASE_ROOT,
    host            :   process.env.DATABASE_HOST,
    password        :   process.env.DATABASE_PASSWORD,
    database        :   process.env.DATABASE,
    port            :   process.env.DATABASE_PORT,
    connectionLimit :   10
});

export default pool;