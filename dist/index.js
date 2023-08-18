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
const express_1 = __importDefault(require("express"));
const appRoutes_1 = __importDefault(require("./routes/appRoutes"));
const errorHandlers_1 = require("./middlewares/errorHandlers");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const appModel_1 = require("./models/appModel");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({ origin: "*" }));
app.use("/user", appRoutes_1.default);
app.use((req, res, next) => {
    res.status(404).send({ status: "Route not found" });
    next();
});
const initializeApp = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, appModel_1.createUserTable)();
        yield (0, appModel_1.createTodoTable)();
    }
    catch (error) {
        console.log(error);
    }
});
initializeApp();
app.use(errorHandlers_1.errorHandler);
let port = 7770;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
