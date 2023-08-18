import express from "express";
import router from "./routes/appRoutes";
import { Request, Response, NextFunction } from "express";
import { errorHandler } from "./middlewares/errorHandlers";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import { createTodoTable, createUserTable } from "./models/appModel";


const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({ origin: "*" }));

app.use("/user", router)

app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).send({ status: "Route not found" })
    next()
})

const initializeApp = async () => {
    try {
        await createUserTable()
        await createTodoTable()
    } catch (error) {
        console.log(error)
    }
}
initializeApp()

app.use(errorHandler);

let port = 7770;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});