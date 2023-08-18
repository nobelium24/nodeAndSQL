"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSingleTodo = exports.fetchUser = exports.deleteTodo = exports.updateTodo = exports.createTodo = exports.createUser = exports.createUserTable = exports.createTodoTable = exports.fetchAllTodo = void 0;
const database_1 = __importDefault(require("../database/database"));
const fetchAllTodo = (user_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const todos = yield database_1.default.any(`SELECT * FROM todos WHERE user_id = $1`, [user_id]);
        console.log(todos);
        return todos;
    }
    catch (error) {
        throw {
            name: "DatabaseQueryError",
            message: "Error fetching todos",
            cause: error
        };
    }
});
exports.fetchAllTodo = fetchAllTodo;
const createTodoTable = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const createTodoTable = yield database_1.default.none(`CREATE TABLE IF NOT EXISTS todos (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                status BOOLEAN NOT NULL,
                description TEXT NOT NULL,
                user_id INTEGER NOT NULL REFERENCES users(id)
            )`);
        console.log(createTodoTable, "success2");
        return { message: "Todo table created successfully", status: true };
    }
    catch (error) {
        console.log(error, 44);
        throw {
            name: "TableCreationError",
            message: "Error creating todo table",
            cause: error
        };
    }
});
exports.createTodoTable = createTodoTable;
const createUserTable = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const createUserTable = yield database_1.default.none(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) NOT NULL UNIQUE,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL
        )
        `);
        console.log(createUserTable, "success");
        return { message: "User table created successfully", status: true };
    }
    catch (error) {
        console.log(error, 33);
        throw {
            name: "TableCreationError",
            message: "Error creating user table",
            cause: error
        };
    }
});
exports.createUserTable = createUserTable;
const createUser = (username, email, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const checkUser = yield database_1.default.oneOrNone(`SELECT * FROM users WHERE email = $1`, [email]);
        if (checkUser)
            throw { name: "DuplicateKeyError", message: "Email already in use", status: false };
        const checkUsername = yield database_1.default.oneOrNone(`SELECT * FROM users WHERE username = $1`, [username]);
        if (checkUsername)
            throw { name: "DuplicateKeyError", message: "Username already in use", status: false };
        const createUser = yield database_1.default.one(`
        INSERT INTO users (username, email, password)
        VALUES($1, $2, $3)
        RETURNING *
        `, [username, email, password]);
        return { message: "User created successfully", status: true, user: createUser };
    }
    catch (error) {
        if (error.name === "DuplicateKeyError") {
            throw error;
        }
        else {
            throw {
                name: "DatabaseQueryError",
                message: "Error creating user",
                cause: error
            };
        }
    }
});
exports.createUser = createUser;
const createTodo = (title, status, description, user_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const verifyUser = yield database_1.default.oneOrNone(`
        SELECT * FROM USERS WHERE id = $1
        `, [user_id]);
        if (!verifyUser)
            return { message: "User not found", status: false };
        const createTodo = yield database_1.default.one(`
        INSERT INTO todos (title, status, description, user_id)
        VALUES($1, $2, $3, $4)
        RETURNING *
        `, [title, status, description, user_id]);
        return { message: "Todo created successfully", status: true, todo: createTodo };
    }
    catch (error) {
        throw {
            name: "DatabaseQueryError",
            message: "Error creating todo",
            cause: error
        };
    }
});
exports.createTodo = createTodo;
const updateTodo = (title, status, description, user_id, id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const verifyUser = yield database_1.default.oneOrNone(`
        SELECT * FROM USERS WHERE id = $1
        `, [user_id]);
        if (!verifyUser)
            return { message: "User not found", status: false };
        const updateTodo = yield database_1.default.one(`
        UPDATE todos SET title = $1, status = $2, description = $3, user_id = $4
        WHERE id = $5
        RETURNING *
        `, [title, status, description, user_id, id]);
        return { message: "Todo updated successfully", status: true, todo: updateTodo };
    }
    catch (error) {
        console.log(error);
        throw {
            name: "DatabaseQueryError",
            message: "Error updating todo",
            cause: error
        };
    }
});
exports.updateTodo = updateTodo;
const deleteTodo = (id, user_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const verifyUser = yield database_1.default.oneOrNone(`
        SELECT * FROM USERS WHERE id = $1
        `, [user_id]);
        if (!verifyUser)
            return { message: "User not found", status: false };
        const deleteTodo = yield database_1.default.none(`
        DELETE FROM todos WHERE id = $1
        `, [id]);
        console.log(deleteTodo, 55);
        return { message: "Todo deleted successfully", status: true };
    }
    catch (error) {
        console.log(error);
        throw {
            name: "DatabaseQueryError",
            message: "Error deleting todo",
            cause: error
        };
    }
});
exports.deleteTodo = deleteTodo;
const fetchUser = (identifier) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fetchUser = yield database_1.default.oneOrNone(`SELECT * FROM users WHERE email = $1 OR username = $1`, [identifier]);
        return fetchUser;
    }
    catch (error) {
        throw {
            name: "DatabaseQueryError",
            message: "Error fetching user",
            cause: error
        };
    }
});
exports.fetchUser = fetchUser;
const getSingleTodo = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getSingleTodo = yield database_1.default.oneOrNone(`SELECT * FROM todos WHERE id = $1`, [id]);
        return getSingleTodo;
    }
    catch (error) {
        throw {
            name: "DatabaseQueryError",
            message: "Error fetching todo",
            cause: error
        };
    }
});
exports.getSingleTodo = getSingleTodo;
