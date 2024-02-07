import { PrismaClient } from "@prisma/client";
import express, { Request, Response, NextFunction } from "express";
import { z } from "zod";
const cors = require("cors");
const jwt = require("jsonwebtoken");
const app = express();
app.use(cors());
app.use(express.json());
const prisma = new PrismaClient();
// psql -h localhost -p 5432 -d authp   start postgres db server
// brew services start postgresql@14     start postgres
let emailSchema = z.string().email();
let passwordSchema = z
  .string()
  .min(5, { message: "Must be 5 or more characters long" });
async function userMiddleware(req: Request, res: Response, next: NextFunction) {
  let username = req.headers["username"] as string;
  let password = req.headers["password"] as string;
  let parsedUsername = emailSchema.safeParse(username);
  let parsedPassword = passwordSchema.safeParse(password);
  console.log(username, password, parsedUsername, parsedPassword);
  if (parsedUsername.success && parsedPassword.success) {
    try {
      let result = await prisma.user.findFirst({
        where: { email: username, password },
      });
      if (result) {
        req.body.result = result;
      }
      next();
    } catch (err) {
      res.status(500).json({ error: err });
    }
  } else {
    console.log(username, password, "err");
    res.status(401).json({ error: "Provide correct username & Password" });
  }
}
app.post(
  "/api/signup",
  userMiddleware,
  async function (req: Request, res: Response) {
    if (req.body.result !== undefined && req.body.result.email !== undefined) {
      res.json({ msg: "User Exists" });
    }else{
    let username = req.headers["username"] as string;
    let password = req.headers["password"] as string;
    let { firstName, lastName } = req.body;
    try {
      let result = await prisma.user.create({
        data: { email: username, password, firstName, lastName },
        select: { email: true, password: true, firstName: true },
      });
      console.log("Created user: ", result);
      res.json({ result, msg: "user created" });
    } catch (err) {
      console.group(err)
      res.status(500).json({ err });
    }}
  }
);

app.get(
  "/api/signin",
  userMiddleware,
  async function (req: Request, res: Response) {
    let username = req.headers["username"] as string;
    let password = req.headers["password"] as string;
    try {
      let result = await prisma.user.findFirst({
        where: { email: username, password },
      });
      if (result) {
        console.log("user signed in: ", result);
        let token =  jwt.sign({email:result.email}, 'jwt-sign')
        res.json({ result, token, msg: "Signed In" });
      } else {
        res.status(500).json({ msg: "err: NO record found" });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ err });
    }
  }
);
// insertUser("abhi@example.com", "example123", "Abhijeet", "Shukla");

//Middleware
async function adminMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let username = req.headers["username"] as string;
  let password = req.headers["password"] as string;
  let parsedUsername = emailSchema.safeParse(username);
  let parsedPassword = passwordSchema.safeParse(password);
  if (parsedUsername.success && parsedPassword.success) {
    try {
      let result = await prisma.admin.findFirst({
        where: { email: username, password },
      });
      if (result) {
        req.body.result = result;
        next();
      } else {
        res.status(500).json({ msg: "err: NO Admin found" });
      }
    } catch (err) {
      res.status(500).json({ error: err });
    }
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
}

app.post(
  "/api/admin/signup",
  adminMiddleware,
  async function (req: Request, res: Response) {
    let username = req.headers["username"] as string;
    let password = req.headers["password"] as string;
    try {
      let foundAdmin = req.body.result;
      if (foundAdmin.email) {
        res.json({ foundAdmin, msg: "Admin exists" });
      } else {
        let result = await prisma.admin.create({
          data: { email: username, password },
          select: { email: true, password: true },
        });
        console.log("Admin Created", result);
        res.json({ result, msg: "Admin created" });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ err });
    }
  }
);
app.get(
  "/api/admin",
  adminMiddleware,
  async function (req: Request, res: Response) {
    let result = req.body.result;
    console.log("Admin Signed In", result);
    try {
      const users = await prisma.user.findMany();
      res.json({ users });
    } catch (err) {
      console.log(err);
      res.status(500).json({ err });
    }
  }
);
//Update sql query
// UPDATE "User"
// SET email='testing@gmail.com'
// WHERE id = 1;

app.listen(8080, function () {
  console.log("listening on port 8080");
});
