import pgPromise from "pg-promise";
import dotenv from "dotenv";
dotenv.config();

const pg = pgPromise()
const processes = process.env
const connection = {
    host: processes.DB_HOST,
    port: parseInt(process.env.PORT || "5432"), 
    database: processes.DATABASE,
    user: processes.USER,
    password: processes.PASSWORD,
}

const db = pg(connection);
(async () => {
    try {
        // Test the connection by running a query
        const result = await db.one('SELECT NOW()');
        console.log('Connected to the database:', result.now);
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
})();
export default db