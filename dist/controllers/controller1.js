"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletedOneTodo = exports.updateOneTodo = exports.createNewTodo = exports.fetchSingleTodo = exports.fetchAllList = exports.signIn = exports.register = void 0;
const argon2 = __importStar(require("argon2"));
const appModel_1 = require("../models/appModel");
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { username, email, password } = req.body;
        password = yield argon2.hash(password);
        const user = yield (0, appModel_1.createUser)(username, email, password);
        return res.status(201).send(user);
    }
    catch (error) {
        next(error);
    }
});
exports.register = register;
const signIn = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { email, password, username } = req.body;
        const user = yield (0, appModel_1.fetchUser)(email || username);
        if (!user)
            return res.status(404).send({ message: "User not found" });
        const verifyPassword = yield argon2.verify(user.password, password);
        if (!verifyPassword)
            return res.status(401).send({ message: "Invalid password" });
        return res.status(200).send({ message: "Login successful" });
    }
    catch (error) {
        next(error);
    }
});
exports.signIn = signIn;
const fetchAllList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user_id = Number(req.params.user_id);
        const todos = yield (0, appModel_1.fetchAllTodo)(user_id);
        return res.status(200).send(todos);
    }
    catch (error) {
        next(error);
    }
});
exports.fetchAllList = fetchAllList;
const fetchSingleTodo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const todo = yield (0, appModel_1.getSingleTodo)(Number(req.params.id));
        console.log(todo, 77);
        if (!todo)
            return res.status(404).send({ message: "Todo not found" });
        return res.status(200).send(todo);
    }
    catch (error) {
        next(error);
    }
});
exports.fetchSingleTodo = fetchSingleTodo;
const createNewTodo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, user_id } = req.body;
        const todo = yield (0, appModel_1.createTodo)(title, false, description, user_id);
        return res.status(201).send(todo);
    }
    catch (error) {
        next(error);
    }
});
exports.createNewTodo = createNewTodo;
const updateOneTodo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, status, description, user_id, id } = req.body;
        const update = yield (0, appModel_1.updateTodo)(title, status, description, user_id, id);
        return res.status(200).send(update);
    }
    catch (error) {
        next(error);
    }
});
exports.updateOneTodo = updateOneTodo;
const deletedOneTodo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, user_id } = req.body;
        const deleted = yield (0, appModel_1.deleteTodo)(id, user_id);
        return res.status(200).send(deleted);
    }
    catch (error) {
        next(error);
    }
});
exports.deletedOneTodo = deletedOneTodo;
