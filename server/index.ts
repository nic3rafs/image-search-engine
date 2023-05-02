import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import imageRoutes from "./routes/imageRoutes";
import multer from "multer";
/*
// For User Authentication
import passport from "passport";
import session from "express-session";
import { configurePassport } from "./auth/passport";
import authRoutes from "./routes/authRoutes";

*/

dotenv.config();
const app: Express = express();
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



app.use(cors());
app.use(express.json());
// app.use()

app.use("/api", imageRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server Edited");
});

app.listen(port, () => {
  console.log(`[server]: ⚡Server is running at http://localhost:${port}`);
});
