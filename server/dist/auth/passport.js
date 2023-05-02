"use strict";
// import { PassportStatic } from "passport";
// import { Strategy as LocalStrategy } from "passport-local";
// import { AppUser, users } from "./User";
// import { getUserByUsername, getUserById } from "./userModel";
// import bcrypt from "bcryptjs";
// export const configurePassport = (passport: PassportStatic) => {
//   passport.use(
//     new LocalStrategy(async (username, password, done) => {
//       const user = getUserByUsername(username);
//       if (!user) {
//         return done(null, false, { message: "Incorrect username." });
//       }
//       const isPasswordValid = await bcrypt.compare(password, user.password);
//       if (!isPasswordValid) {
//         return done(null, false, { message: "Incorrect password." });
//       }
//       return done(null, user);
//     })
//   );
//   passport.serializeUser((user: AppUser, done) => {
//     done(null, (user as Express.User).id);
//   });
//   passport.deserializeUser((id: number, done) => {
//     const user = users.find((user) => user.id === id);
//     done(null, user);
//   });
// };
