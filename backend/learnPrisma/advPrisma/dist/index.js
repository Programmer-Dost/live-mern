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
// Some advanced features
//Start psql server (locally): psql -h localhost -p 5432 -d dbname
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
        let username = req.headers["email"];
        let password = req.headers["password"];
        let parsedUsername = emailSchema.safeParse(username);
        let parsedPassword = passwordSchema.safeParse(password);
        console.log(username, password, parsedUsername, parsedPassword);
        if (parsedUsername.success && parsedPassword.success) {
            try {
                let result = yield prisma.users.findFirst({
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
            let username = req.headers["email"];
            let password = req.headers["password"];
            let { name } = req.body;
            try {
                let result = yield prisma.users.create({
                    data: { email: username, password, name },
                    select: { email: true, password: true, name: true },
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
        let username = req.headers["email"];
        let password = req.headers["password"];
        try {
            let result = yield prisma.users.findFirst({
                where: { email: username, password },
                select: { name: true, email: true, password: true, orders: true }, //access user's order
            });
            if (result) {
                console.log("user signed in: ", result);
                let token = jwt.sign({ email: result.email }, "jwt-sign");
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
// T-Shirt	Comfortable and stylish t-shirt	19.99
app.post("/api/products", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let { name, description, priceString } = req.body;
        //   let description = req.headers["description"] as string;
        //   let priceString  = req.headers["price"] as string;
        let price = parseInt(priceString);
        try {
            let result = yield prisma.products.findFirst({
                where: { name, description },
            });
            if (result) {
                console.log("product exists: ", result);
                //   let token = jwt.sign({ email: result.email }, "jwt-sign");
                res.json({ result, msg: "Product Exists" });
            }
            else {
                let result = yield prisma.products.create({
                    data: { name, description, price: price },
                    select: { name: true, description: true, price: true },
                });
                console.log("Created product: ", result);
                res.json({ result, msg: "product created" });
            }
        }
        catch (err) {
            console.log(err);
            res.status(500).json({ err });
        }
    });
});
//orders
app.post("/api/orders", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let { user_id, total_price, status } = req.body;
        //   let description = req.headers["description"] as string;
        //   let priceString  = req.headers["price"] as string;
        try {
            // let result = await prisma.products.findFirst({
            //   where: { name, description, price },
            // });
            // if (result) {
            //   console.log("product exists: ", result);
            //   //   let token = jwt.sign({ email: result.email }, "jwt-sign");
            //   res.json({ result, msg: "Product Exists" });
            // } else {
            let result = yield prisma.orders.create({
                data: { user_id, total_price, status },
                select: { user_id: true, total_price: true, status: true, user: true },
            });
            console.log("Created order: ", result);
            res.json({ result, msg: "order created" });
            // }
        }
        catch (err) {
            console.log(err);
            res.status(500).json({ err });
        }
    });
});
//get to know about data
// listening on port 8080
// obama@mailme.com obama { success: true, data: 'obama@mailme.com' } { success: true, data: 'obama' }
// Created user:  { email: 'obama@mailme.com', password: 'obama', name: 'Obama' }
// Created product:  {
//   user_id: 1,
//   total_price: 789.4400000000001,
//   status: 'PENDING',
//   user: {
//     id: 1,
//     name: 'Obama',
//     email: 'obama@mailme.com',
//     password: 'obama',
//     created_at: 2024-02-15T09:56:34.399Z,
//     updated_at: 2024-02-15T09:56:34.399Z
//   }
// }
app.post("/api/order_items", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let { order_id, quantity, product_id } = req.body;
        //   let description = req.headers["description"] as string;
        //   let priceString  = req.headers["price"] as string;
        try {
            let result = yield prisma.orders.findFirst({
                where: { id: order_id },
            });
            console.log(result);
            let price;
            if (result) {
                console.log("order found: ", result);
                //   let token = jwt.sign({ email: result.email }, "jwt-sign");
                price = parseFloat(result.total_price.toString()) * quantity;
                if (price !== undefined) {
                    let newresult = yield prisma.order_items.create({
                        data: { order_id, quantity, price, product_id },
                        select: {
                            order_id: true,
                            price: true,
                            quantity: true,
                            product_id: true,
                            product: true,
                            order: true,
                        },
                    });
                    console.log("Assigned order_items to orders: ", newresult);
                    res.json({ newresult, msg: "Assigned order_items to orders" });
                }
                else {
                    res.json({ msg: "undefined price" });
                }
            }
            else {
                res.json({ msg: "Wrong order_id" });
            }
        }
        catch (err) {
            console.log(err);
            res.status(500).json({ err });
        }
    });
});
//Middleware
// async function adminMiddleware(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   let username = req.headers["username"] as string;
//   let password = req.headers["password"] as string;
//   let parsedUsername = emailSchema.safeParse(username);
//   let parsedPassword = passwordSchema.safeParse(password);
//   if (parsedUsername.success && parsedPassword.success) {
//     try {
//       let result = await prisma.admin.findFirst({
//         where: { email: username, password },
//       });
//       if (result) {
//         req.body.result = result;
//         next();
//       } else {
//         res.status(500).json({ msg: "err: NO Admin found" });
//       }
//     } catch (err) {
//       res.status(500).json({ error: err });
//     }
//   } else {
//     res.status(401).json({ error: "Unauthorized" });
//   }
// }
// app.post(
//   "/api/admin/signup",
//   adminMiddleware,
//   async function (req: Request, res: Response) {
//     let username = req.headers["username"] as string;
//     let password = req.headers["password"] as string;
//     try {
//       let foundAdmin = req.body.result;
//       if (foundAdmin.email) {
//         res.json({ foundAdmin, msg: "Admin exists" });
//       } else {
//         let result = await prisma.admin.create({
//           data: { email: username, password },
//           select: { email: true, password: true },
//         });
//         console.log("Admin Created", result);
//         res.json({ result, msg: "Admin created" });
//       }
//     } catch (err) {
//       console.log(err);
//       res.status(500).json({ err });
//     }
//   }
// );
// app.get(
//   "/api/admin",
//   adminMiddleware,
//   async function (req: Request, res: Response) {
//     let result = req.body.result;
//     console.log("Admin Signed In", result);
//     try {
//       const users = await prisma.users.findMany();
//       res.json({ users });
//     } catch (err) {
//       console.log(err);
//       res.status(500).json({ err });
//     }
//   }
// );
function filterData() {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield prisma.users.findMany({
            where: {
                email: {
                    startsWith: "a",
                },
                orders: {
                    some: {
                        status: "DELIVERED",
                    },
                },
            },
            include: {
                orders: {
                    where: {
                        order_items: {
                            some: {
                                product_id: 2,
                            },
                        },
                    },
                },
            },
        });
        console.log({ result }, result[0].orders);
    });
}
// filterData();
function filterData_pt2() {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield prisma.users.findMany({
            where: {
                email: {
                    startsWith: "a",
                },
                //   orders: {
                //     some: {
                //       status: "DELIVERED",
                //     },
                //   },
            },
            include: {
                orders: {
                    where: {
                        OR: [
                            {
                                order_items: {
                                    some: {
                                        product_id: 461,
                                    },
                                },
                            },
                            {
                                order_items: {
                                    some: {
                                        price: {
                                            lt: 900,
                                        },
                                    },
                                },
                            },
                        ],
                    },
                },
            },
        });
        console.log("hi", result, result[0].orders);
    });
}
// filterData_pt2();
function filterData_pt3() {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield prisma.orders.findMany({
            where: {
                user: {
                    email: {
                        startsWith: "A",
                        mode: "insensitive", //case insensitive
                    },
                },
            },
            include: {
                order_items: {
                    include: {
                        product: true,
                    },
                    where: {
                        product: {
                            name: { contains: "F-sh" },
                        },
                    },
                },
            },
        });
        console.log("hi", result, result[0].order_items);
    });
}
// filterData_pt3();
function getUsersByRelevance() {
    return __awaiter(this, void 0, void 0, function* () {
        let product = yield prisma.products.findMany({
            take: 10,
            orderBy: {
                id: "desc",
            },
            select: { name: true },
        });
        console.log({ product });
    });
}
// getUsersByRelevance();
function getUsersByCursor(myCursor) {
    return __awaiter(this, void 0, void 0, function* () {
        //   let cursorArg = myCursor ? { id: myCursor } : undefined;
        let product = yield prisma.products.findMany({
            take: 10,
            cursor: myCursor !== undefined ? { id: myCursor } : undefined,
            orderBy: {
                id: "desc",
            },
            select: { id: true, name: true },
        });
        console.log({ product });
        return product;
    });
}
function runme() {
    return __awaiter(this, void 0, void 0, function* () {
        const lastPostInResults = yield getUsersByCursor(undefined); // Remember: zero-based index! :)
        const myCursor = lastPostInResults.length > 0
            ? lastPostInResults[lastPostInResults.length - 1].id
            : undefined;
        getUsersByCursor(myCursor);
        let dataUploaded = yield prisma.products.createMany({
            data: [
                {
                    name: "T-Jeans",
                    description: "Blue T-jeans with curly fit",
                    price: 49.99,
                },
            ],
        });
        console.log(dataUploaded);
    });
}
// runme();
//Aggregation in prisma
function aggregatingmyself() {
    return __awaiter(this, void 0, void 0, function* () {
        const aggregations = yield prisma.products.aggregate({
            _avg: {
                price: true,
            },
            // where: { //run aggregation on filtered data
            //   name: {
            //     contains: 'shirt',
            //   },
            // },
            orderBy: {
                price: "asc",
            },
            _count: {
                name: true,
            },
            take: 10,
        });
        console.log("Average age:" + aggregations._avg.price, { aggregations });
    });
}
// aggregatingmyself();
function usingGroupBy() {
    return __awaiter(this, void 0, void 0, function* () {
        const groupUsers = yield prisma.products.groupBy({
            by: ["created_at"], //group by created_at date after filtering data using below where stage
            where: {
                //use where clause for grouping only filtered data and not whole dataset
                OR: [
                    {
                        name: {
                            contains: "Dining",
                        },
                    },
                    {
                        name: {
                            contains: "shirt",
                        },
                    },
                    {
                        name: {
                            contains: "Blender",
                        },
                    },
                ],
            },
            _sum: {
                //at last find sum of all rows in same group and for each group
                price: true,
            },
            having: {
                price: {
                    _max: {
                        lte: 600,
                    },
                },
            },
            orderBy: {
                created_at: "desc", //order the final result by date
            },
            skip: 1, //skipped the newest one just for fun
        });
        console.log("Group users:" + JSON.stringify(groupUsers, null, 2)); //return data in json else it will be [object,object]
    });
}
// usingGroupBy();
function totalProducts() {
    return __awaiter(this, void 0, void 0, function* () {
        const productsCount = yield prisma.products.count(); //returns the total number of records
        console.log(productsCount);
    });
}
// totalProducts()
function relationCount() {
    return __awaiter(this, void 0, void 0, function* () {
        const usersWithCount = yield prisma.users.findMany({
            include: {
                //use select to only return _count field
                _count: {
                    select: { orders: true }, //count nested relations
                },
            },
            orderBy: {
                id: "asc",
            },
        });
        console.log(usersWithCount);
    });
}
// relationCount()
function relationCount1() {
    return __awaiter(this, void 0, void 0, function* () {
        const usersWithCount = yield prisma.users.count({
            select: { _all: true }, //count all records even null ones. If you specified any field then it will only count non-null records.
            //We don't have null records so it will return same as counting non-null records
            orderBy: {
                id: "asc",
            },
        });
        console.log(usersWithCount);
    });
}
// relationCount1();    
function filteredCount() {
    return __awaiter(this, void 0, void 0, function* () {
        const usersCount = yield prisma.users.count({
            where: {
                orders: {
                    some: {
                        total_price: {
                            gte: 430,
                        },
                    },
                },
            },
        });
        console.log(usersCount);
    });
}
filteredCount();
function distinctFilter() {
    return __awaiter(this, void 0, void 0, function* () {
        const distinctProducts = yield prisma.products.findMany({
            distinct: ['name'],
            select: {
                name: true,
            },
        });
        console.log(distinctProducts);
    });
}
distinctFilter();
//Update sql query
// UPDATE "User"
// SET email='testing@gmail.com'
// WHERE id = 1;
app.listen(8080, function () {
    console.log("listening on port 8080");
});
