import { Request, Response, NextFunction } from "express";
import * as argon2 from "argon2";
import {
    fetchAllTodo, createTodoTable, createUserTable,
    createUser, createTodo, updateTodo,
    deleteTodo, fetchUser, getSingleTodo
} from "../models/appModel";
import { Todo, User } from "../types/interfaces";

const register = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        let { username, email, password }: User = req.body
        password = await argon2.hash(password)
        const user = await createUser(username, email, password)
        return res.status(201).send(user)
    } catch (error) {
        next(error)
    }
}

const signIn = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        let { email, password, username }: User = req.body
        const user = await fetchUser(email || username)
        if (!user) return res.status(404).send({ message: "User not found" })
        const verifyPassword = await argon2.verify(user.password, password)
        if (!verifyPassword) return res.status(401).send({ message: "Invalid password" })
        return res.status(200).send({ message: "Login successful" })
    } catch (error) {
        next(error)
    }
}

const fetchAllList = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const user_id = Number(req.params.user_id);
        const todos: Array<Todo> = await fetchAllTodo(user_id);
        return res.status(200).send(todos)
    } catch (error) {
        next(error)
    }
}

const fetchSingleTodo = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const todo: Todo | null = await getSingleTodo(Number(req.params.id))
        console.log(todo, 77)
        if (!todo) return res.status(404).send({ message: "Todo not found" })
        return res.status(200).send(todo)
    } catch (error) {
        next(error)
    }
}

const createNewTodo = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { title, description, user_id }: Todo = req.body;
        const todo = await createTodo(title, false, description, user_id)
        return res.status(201).send(todo)
    } catch (error) { next(error) }
}

const updateOneTodo = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { title, status, description, user_id, id }: Todo = req.body;
        const update = await updateTodo(title, status, description, user_id, id);
        return res.status(200).send(update)
    } catch (error) {
        next(error)
    }
}

const deletedOneTodo = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { id, user_id }:Todo = req.body
        const deleted = await deleteTodo(id, user_id)
        return res.status(200).send(deleted)
    } catch (error) {
        next(error)
    }
}
export { register, signIn, fetchAllList, fetchSingleTodo, createNewTodo, updateOneTodo, deletedOneTodo }