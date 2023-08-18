import express from "express";
import {register, signIn, fetchAllList, fetchSingleTodo, createNewTodo, updateOneTodo, deletedOneTodo} from "../controllers/controller1"

const router = express.Router()
router.post("/register", register);
router.post("/login", signIn);
router.get("/fetchtodos/:user_id", fetchAllList);
router.get("/fetchtodo/:id", fetchSingleTodo);
router.post("/todos", createNewTodo);
router.put("/updatetodo", updateOneTodo);
router.delete("/deletetodo", deletedOneTodo);



export default router