// import { Router } from "express";
// import passport from "passport";
// import bcrypt from "bcryptjs";
// import { addUser } from "../auth/userModel";
// import { User } from "../auth/User";

// const router = Router();

// router.post("/register", async (req, res) => {
//   const { username, password } = req.body;

//   if (!username || !password) {
//     res.status(400).json({ message: "Please provide username and password." });
//     return;
//   }

//   const hashedPassword = await bcrypt.hash(password, 10);
//   const newUser: User = {
//     id: Date.now(),
//     username,
//     password: hashedPassword,
//   };

//   addUser(newUser);

//   res.status(201).json({ message: "User registered successfully." });
// });

// router.post(
//   "/login",
//   passport.authenticate("local", {
//     failureFlash: true,
//   }),
//   (req, res) => {
//     res.status(200).json({ message: "Logged in successfully." });
//   }
// );

// router.post("/logout", (req, res) => {
//   req.logout();
//   res.status(200).json({ message: "Logged out successfully." });
// });

// router.get("/me", (req, res) => {
//   if (req.user) {
//     res.json(req.user);
//   } else {
//     res.status(401).json({ message: "Not authenticated." });
//   }
// });

// export default router;
