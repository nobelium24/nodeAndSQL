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
const pg_promise_1 = __importDefault(require("pg-promise"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const pg = (0, pg_promise_1.default)();
const processes = process.env;
const connection = {
    host: processes.DB_HOST,
    port: parseInt(process.env.PORT || "5432"),
    database: processes.DATABASE,
    user: processes.USER,
    password: processes.PASSWORD,
};
const db = pg(connection);
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Test the connection by running a query
        const result = yield db.one('SELECT NOW()');
        console.log('Connected to the database:', result.now);
    }
    catch (error) {
        console.error('Error connecting to the database:', error);
    }
}))();
exports.default = db;
