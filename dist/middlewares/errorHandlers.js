"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const internal = "Internal server error";
const internal2 = "Duplicate key error";
const errorHandler = (error, req, res, next) => {
    if (error.name === "TableCreationError") {
        return res.status(500).send({ message: error.message || internal });
    }
    else if (error.name === "DatabaseQueryError") {
        return res.status(500).send({ message: error.message || internal });
    }
    else if (error.name === "DuplicateKeyError") {
        return res.status(409).send({ message: error.message || internal2 });
    }
    else {
        return res.status(500).send({ message: error.message || internal });
    }
};
exports.errorHandler = errorHandler;
