// Some advanced features
//Start psql server (locally): psql -h localhost -p 5432 -d dbname
import { PrismaClient, Prisma } from "@prisma/client";
import express, { Request, Response, NextFunction } from "express";
import { z } from "zod";
import axios from "axios";
import { products } from "@prisma/client";
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
  let username = req.headers["email"] as string;
  let password = req.headers["password"] as string;
  let parsedUsername = emailSchema.safeParse(username);
  let parsedPassword = passwordSchema.safeParse(password);
  console.log(username, password, parsedUsername, parsedPassword);
  if (parsedUsername.success && parsedPassword.success) {
    try {
      let result = await prisma.users.findFirst({
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
    } else {
      let username = req.headers["email"] as string;
      let password = req.headers["password"] as string;
      let { name } = req.body;
      try {
        let result = await prisma.users.create({
          data: { email: username, password, name },
          select: { email: true, password: true, name: true },
        });
        console.log("Created user: ", result);
        res.json({ result, msg: "user created" });
      } catch (err) {
        console.group(err);
        res.status(500).json({ err });
      }
    }
  }
);

app.get(
  "/api/signin",
  userMiddleware,
  async function (req: Request, res: Response) {
    let username = req.headers["email"] as string;
    let password = req.headers["password"] as string;
    try {
      let result = await prisma.users.findFirst({
        where: { email: username, password },
        select: { name: true, email: true, password: true, orders: true }, //access user's order
      });
      if (result) {
        console.log("user signed in: ", result);
        let token = jwt.sign({ email: result.email }, "jwt-sign");
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

// T-Shirt	Comfortable and stylish t-shirt	19.99
app.post("/api/products", async function (req: Request, res: Response) {
  let { name, description, priceString } = req.body;
  //   let description = req.headers["description"] as string;
  //   let priceString  = req.headers["price"] as string;
  let price = parseInt(priceString);
  try {
    let result = await prisma.products.findFirst({
      where: { name, description },
    });
    if (result) {
      console.log("product exists: ", result);
      //   let token = jwt.sign({ email: result.email }, "jwt-sign");
      res.json({ result, msg: "Product Exists" });
    } else {
      let result = await prisma.products.create({
        data: { name, description, price: price },
        select: { name: true, description: true, price: true },
      });
      console.log("Created product: ", result);
      res.json({ result, msg: "product created" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ err });
  }
});

//orders
app.post("/api/orders", async function (req: Request, res: Response) {
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
    let result = await prisma.orders.create({
      data: { user_id, total_price, status },
      select: { user_id: true, total_price: true, status: true, user: true },
    });
    console.log("Created order: ", result);
    res.json({ result, msg: "order created" });
    // }
  } catch (err) {
    console.log(err);
    res.status(500).json({ err });
  }
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

app.post("/api/order_items", async function (req: Request, res: Response) {
  let { order_id, quantity, product_id } = req.body;
  //   let description = req.headers["description"] as string;
  //   let priceString  = req.headers["price"] as string;

  try {
    let result = await prisma.orders.findFirst({
      where: { id: order_id },
    });
    console.log(result);
    let price;
    if (result) {
      console.log("order found: ", result);
      //   let token = jwt.sign({ email: result.email }, "jwt-sign");
      price = parseFloat(result.total_price.toString()) * quantity;
      if (price !== undefined) {
        let newresult = await prisma.order_items.create({
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
      } else {
        res.json({ msg: "undefined price" });
      }
    } else {
      res.json({ msg: "Wrong order_id" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ err });
  }
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
async function filterData() {
  const result = await prisma.users.findMany({
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
}
// filterData();
    
async function filterData_pt2() {
  const result = await prisma.users.findMany({
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
}
// filterData_pt2();

async function filterData_pt3() {
  const result = await prisma.orders.findMany({
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
}
// filterData_pt3();

async function getUsersByRelevance() {
  let product = await prisma.products.findMany({
    take: 10,
    orderBy: {
      id: "desc",
    },
    select: { name: true },
  });
  console.log({ product });
}
// getUsersByRelevance();
async function getUsersByCursor(
  myCursor: number | undefined
): Promise<products[]> {
  //   let cursorArg = myCursor ? { id: myCursor } : undefined;
  let product = await prisma.products.findMany({
    take: 10,
    cursor: myCursor !== undefined ? { id: myCursor } : undefined,
    orderBy: {
      id: "desc",
    },
    select: { id: true, name: true },
  });
  console.log({ product });
  return product as products[];
}
async function runme() {
  const lastPostInResults = await getUsersByCursor(undefined); // Remember: zero-based index! :)
  const myCursor =
    lastPostInResults.length > 0
      ? lastPostInResults[lastPostInResults.length - 1].id
      : undefined;
  getUsersByCursor(myCursor);
  let dataUploaded = await prisma.products.createMany({
    data: [
      {
        name: "T-Jeans",
        description: "Blue T-jeans with curly fit",
        price: 49.99,
      },
    ],
  });
  console.log(dataUploaded);
}
// runme();

//Aggregation in prisma
async function aggregatingmyself() {
  const aggregations = await prisma.products.aggregate({
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
}
// aggregatingmyself();

async function usingGroupBy() {
  const groupUsers = await prisma.products.groupBy({
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
}

// usingGroupBy();
async function totalProducts() {
  const productsCount = await prisma.products.count(); //returns the total number of records
  console.log(productsCount);
}
// totalProducts()

async function relationCount() {
  const usersWithCount = await prisma.users.findMany({
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
}

// relationCount()
async function relationCount1() {
  const usersWithCount = await prisma.users.count({
    select: { _all: true }, //count all records even null ones. If you specified any field then it will only count non-null records.
    //We don't have null records so it will return same as counting non-null records

    orderBy: {
      id: "asc",
    },
  });
  console.log(usersWithCount);
}

// relationCount1();

async function filteredCount() {
  const usersCount = await prisma.users.count({
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
}
// filteredCount();

async function distinctFilter() {
  const distinctProducts = await prisma.products.findMany({
    distinct: ["name"], //return products having different names i.e Watch will be returned once if multiple products with same name exists
    // distinct: ["name", "price"], multiple fields can be passed
    select: {
      name: true,
    },
  });
  console.log(distinctProducts);
}

// distinctFilter();
//Update sql query
// UPDATE "User"
// SET email='testing@gmail.com'
// WHERE id = 1;

app.listen(8080, function () {
  console.log("listening on port 8080");
});
