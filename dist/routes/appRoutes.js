"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controller1_1 = require("../controllers/controller1");
const router = express_1.default.Router();
router.post("/register", controller1_1.register);
router.post("/login", controller1_1.signIn);
router.get("/fetchtodos/:user_id", controller1_1.fetchAllList);
router.get("/fetchtodo/:id", controller1_1.fetchSingleTodo);
router.post("/todos", controller1_1.createNewTodo);
router.put("/updatetodo", controller1_1.updateOneTodo);
router.delete("/deletetodo", controller1_1.deletedOneTodo);
exports.default = router;
