import db from "../database/database";
import { Todo, User } from "../types/interfaces";

const fetchAllTodo = async (user_id:number) => {
    try {
        const todos: Array<Todo> = await db.any(`SELECT * FROM todos WHERE user_id = $1`, [user_id])
        console.log(todos)
        return todos
    } catch (error: any) {
        throw {
            name: "DatabaseQueryError",
            message: "Error fetching todos",
            cause: error
        }
    }
}

const createTodoTable = async () => {
    try {
        const createTodoTable = await db.none(
            `CREATE TABLE IF NOT EXISTS todos (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                status BOOLEAN NOT NULL,
                description TEXT NOT NULL,
                user_id INTEGER NOT NULL REFERENCES users(id)
            )`)
        console.log(createTodoTable, "success2")
        return { message: "Todo table created successfully", status: true }
    } catch (error: any) {
        console.log(error, 44)
        throw {
            name: "TableCreationError",
            message: "Error creating todo table",
            cause: error
        }
    }
}

const createUserTable = async () => {
    try {
        const createUserTable = await db.none(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) NOT NULL UNIQUE,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL
        )
        `)
        console.log(createUserTable, "success")
        return { message: "User table created successfully", status: true }
    } catch (error: any) {
        console.log(error, 33)
        throw {
            name: "TableCreationError",
            message: "Error creating user table",
            cause: error
        }
    }
}

const createUser = async (username: string, email: string, password: string) => {
    try {
        const checkUser: User | null = await db.oneOrNone(`SELECT * FROM users WHERE email = $1`, [email])
        if (checkUser)throw { name: "DuplicateKeyError", message: "Email already in use", status: false }


        const checkUsername: User | null = await db.oneOrNone(`SELECT * FROM users WHERE username = $1`, [username])
        if (checkUsername) throw { name: "DuplicateKeyError", message: "Username already in use", status: false }

        const createUser: User = await db.one(`
        INSERT INTO users (username, email, password)
        VALUES($1, $2, $3)
        RETURNING *
        `,
            [username, email, password])
        return { message: "User created successfully", status: true, user: createUser }
    } catch (error: any) {
        if (error.name === "DuplicateKeyError"){
            throw error
        }else{
            throw {
                name: "DatabaseQueryError",
                message: "Error creating user",
                cause: error
            }
        }
    }
}

const createTodo = async (title: string, status: boolean, description: string, user_id: number) => {
    try {
        const verifyUser = await db.oneOrNone(`
        SELECT * FROM USERS WHERE id = $1
        `, [user_id])
        if (!verifyUser) return { message: "User not found", status: false }
        const createTodo: Todo = await db.one(`
        INSERT INTO todos (title, status, description, user_id)
        VALUES($1, $2, $3, $4)
        RETURNING *
        `, [title, status, description, user_id])
        return { message: "Todo created successfully", status: true, todo: createTodo }
    } catch (error: any) {
        throw {
            name: "DatabaseQueryError",
            message: "Error creating todo",
            cause: error
        }
    }
}

const updateTodo = async (title:string, status:boolean, description:string, user_id:number, id:number) => {
    try {
        const verifyUser = await db.oneOrNone(`
        SELECT * FROM USERS WHERE id = $1
        `, [user_id])
        if (!verifyUser) return { message: "User not found", status: false }
        
        const updateTodo: Todo = await db.one(`
        UPDATE todos SET title = $1, status = $2, description = $3, user_id = $4
        WHERE id = $5
        RETURNING *
        `, [title, status, description, user_id, id])
        
        return { message: "Todo updated successfully", status: true, todo: updateTodo };
    } catch (error: any) {
        console.log(error);
        throw {
            name: "DatabaseQueryError",
            message: "Error updating todo",
            cause: error
        };
    }
};


const deleteTodo = async (id: number, user_id:number) => {
    try {
        const verifyUser = await db.oneOrNone(`
        SELECT * FROM USERS WHERE id = $1
        `, [user_id])
        if (!verifyUser) return { message: "User not found", status: false }
        const deleteTodo = await db.none(`
        DELETE FROM todos WHERE id = $1
        `, [id]);
        console.log(deleteTodo, 55)
        return { message: "Todo deleted successfully", status: true }
    } catch (error) {
        console.log(error)
        throw {
            name: "DatabaseQueryError",
            message: "Error deleting todo",
            cause: error
        }
    }
}

const fetchUser = async (identifier: string) => {
    try {
        const fetchUser: User | null = await db.oneOrNone(`SELECT * FROM users WHERE email = $1 OR username = $1`, [identifier]);
        return fetchUser
    } catch (error: any) {
        throw {
            name: "DatabaseQueryError",
            message: "Error fetching user",
            cause: error
        }
    }
}

const getSingleTodo = async (id: number) => {
    try {
        const getSingleTodo: Todo | null = await db.oneOrNone(`SELECT * FROM todos WHERE id = $1`, [id]);
        return getSingleTodo
    } catch (error: any) {
        throw {
            name: "DatabaseQueryError",
            message: "Error fetching todo",
            cause: error
        }
    }
}
export { fetchAllTodo, createTodoTable, createUserTable, createUser, createTodo, updateTodo, deleteTodo, fetchUser, getSingleTodo }
