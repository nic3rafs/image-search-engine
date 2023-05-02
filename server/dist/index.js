"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const imageRoutes_1 = __importDefault(require("./routes/imageRoutes"));
/*
// For User Authentication
import passport from "passport";
import session from "express-session";
import { configurePassport } from "./auth/passport";
import authRoutes from "./routes/authRoutes";

*/
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
/*
// For User Authentication
app.use(
  session({
    secret: process.env.SESSION_SECRET || "mySecret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
configurePassport(passport);
app.use("/api/auth", authRoutes);
*/
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// app.use()
app.use("/api", imageRoutes_1.default);
app.get("/", (req, res) => {
    res.send("Express + TypeScript Server Edited");
});
app.listen(port, () => {
    console.log(`[server]: ⚡Server is running at http://localhost:${port}`);
});
