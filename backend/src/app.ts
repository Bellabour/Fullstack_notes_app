import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import notesRoutes from "./routes/notes";
import tagsRoutes from './routes/tags';
import userRoutes from "./routes/users";
import categorieRouter from './routes/categories';
import folderRoutes from './routes/folders';
import morgan from "morgan";
import createHttpError, { isHttpError } from "http-errors";
import session from "express-session";
import env from "./util/validate";
import MongoStore from "connect-mongo";
import { requiresAuth } from "./middleware/auth";

const app = express();

app.use(morgan("dev"));

app.use(express.json());

app.use(session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60 * 60 * 1000,
    },
    rolling: true,
    store: MongoStore.create({
        mongoUrl: env.MONGO_CONNECTION_STRING
    }),
}));

app.use("/api/users", userRoutes);
app.use("/api/notes", requiresAuth, notesRoutes);
app.use('/api/tags',requiresAuth,tagsRoutes)
app.use('/api/category',requiresAuth, categorieRouter);
app.use('/api/folder',requiresAuth, folderRoutes)

app.use((req, res, next) => {
    next(createHttpError(404, "Endpoint not found"));
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
    console.error(error);
    let errorMessage = "An unknown error occurred";
    let statusCode = 500;
    if (isHttpError(error)) {
        statusCode = error.status;
        errorMessage = error.message;
    }
    res.status(statusCode).json({ error: errorMessage });
});

export default app;