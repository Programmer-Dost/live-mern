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
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const zod_1 = require("zod");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const app = (0, express_1.default)();
app.use(cors());
app.use(express_1.default.json());
const prisma = new client_1.PrismaClient();
// psql -h localhost -p 5432 -d authp   start postgres db server
// brew services start postgresql@14     start postgres
let emailSchema = zod_1.z.string().email();
let passwordSchema = zod_1.z
    .string()
    .min(5, { message: "Must be 5 or more characters long" });
function userMiddleware(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let username = req.headers["username"];
        let password = req.headers["password"];
        let parsedUsername = emailSchema.safeParse(username);
        let parsedPassword = passwordSchema.safeParse(password);
        console.log(username, password, parsedUsername, parsedPassword);
        if (parsedUsername.success && parsedPassword.success) {
            try {
                let result = yield prisma.user.findFirst({
                    where: { email: username, password },
                });
                if (result) {
                    req.body.result = result;
                }
                next();
            }
            catch (err) {
                res.status(500).json({ error: err });
            }
        }
        else {
            console.log(username, password, "err");
            res.status(401).json({ error: "Provide correct username & Password" });
        }
    });
}
app.post("/api/signup", userMiddleware, function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.body.result !== undefined && req.body.result.email !== undefined) {
            res.json({ msg: "User Exists" });
        }
        else {
            let username = req.headers["username"];
            let password = req.headers["password"];
            let { firstName, lastName } = req.body;
            try {
                let result = yield prisma.user.create({
                    data: { email: username, password, firstName, lastName },
                    select: { email: true, password: true, firstName: true },
                });
                console.log("Created user: ", result);
                res.json({ result, msg: "user created" });
            }
            catch (err) {
                console.group(err);
                res.status(500).json({ err });
            }
        }
    });
});
app.get("/api/signin", userMiddleware, function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let username = req.headers["username"];
        let password = req.headers["password"];
        try {
            let result = yield prisma.user.findFirst({
                where: { email: username, password },
            });
            if (result) {
                console.log("user signed in: ", result);
                let token = jwt.sign({ email: result.email }, 'jwt-sign');
                console.log({ token });
                res.json({ result, token, msg: "Signed In" });
            }
            else {
                res.status(500).json({ msg: "err: NO record found" });
            }
        }
        catch (err) {
            console.log(err);
            res.status(500).json({ err });
        }
    });
});
// insertUser("abhi@example.com", "example123", "Abhijeet", "Shukla");
//Middleware
function adminMiddleware(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let username = req.headers["username"];
        let password = req.headers["password"];
        let parsedUsername = emailSchema.safeParse(username);
        let parsedPassword = passwordSchema.safeParse(password);
        if (parsedUsername.success && parsedPassword.success) {
            try {
                let result = yield prisma.admin.findFirst({
                    where: { email: username, password },
                });
                if (result) {
                    req.body.result = result;
                    next();
                }
                else {
                    res.status(500).json({ msg: "err: NO Admin found" });
                }
            }
            catch (err) {
                res.status(500).json({ error: err });
            }
        }
        else {
            res.status(401).json({ error: "Unauthorized" });
        }
    });
}
app.post("/api/admin/signup", adminMiddleware, function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let username = req.headers["username"];
        let password = req.headers["password"];
        try {
            let foundAdmin = req.body.result;
            if (foundAdmin.email) {
                res.json({ foundAdmin, msg: "Admin exists" });
            }
            else {
                let result = yield prisma.admin.create({
                    data: { email: username, password },
                    select: { email: true, password: true },
                });
                console.log("Admin Created", result);
                res.json({ result, msg: "Admin created" });
            }
        }
        catch (err) {
            console.log(err);
            res.status(500).json({ err });
        }
    });
});
app.get("/api/admin", adminMiddleware, function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = req.body.result;
        console.log("Admin Signed In", result);
        try {
            const users = yield prisma.user.findMany();
            res.json({ users });
        }
        catch (err) {
            console.log(err);
            res.status(500).json({ err });
        }
    });
});
//Update sql query
// UPDATE "User"
// SET email='testing@gmail.com'
// WHERE id = 1;
app.listen(8080, function () {
    console.log("listening on port 8080");
});
