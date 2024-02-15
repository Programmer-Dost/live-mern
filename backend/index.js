const express = require("express");
const connectDB = require("./database/connect");
const mongoose = require("mongoose");
const app = express();
app.use(express.json());

connectDB();

const userSchema = {
  username: String,
  password: String,
  amount: Number,
};
const USER = mongoose.model("USER", userSchema);

app.post("/api/users", async function (req, res) {
    // username test
    // password test
    // amount 5000
  let username = req.headers["username"];
  let password = req.headers["password"];
  let amount = req.headers["amount"]
  console.log(username, password);
  let newUser = new USER({ username, password, amount });
  await newUser.save();
  res.json({ msg: "user created" });
});
async function middleware(req, res, next) {
  let username = req.headers["username"];
  let password = req.headers["password"];

  if (username && password) {
    USER.findOne({ username: username, password: password })
      .then(function (user) {
        if (user) {
          req.user = user;
          next();
        } 
      })
      .catch(function (err) {
        res.status(500).json({ error: err.message });
      });
  }else {
    res.status(401).json({ error: "Unauthorized" });
  }
}
  app.use(middleware);
app.get("/", function (req, res) {
  res.json({ msg: "get reached" });
});
app.post("/pay", async function (req, res) {
//   test:  {"amount": 2000,
// "toAccount":"test",
// "fromAccount":"test1"
// }
  const session = await mongoose.startSession();
   session.startTransaction();
  const amount = req.body.amount;
  const toAccount = req.body.toAccount;
  const fromAccount = req.body.fromAccount;
  console.log(amount, toAccount, fromAccount);
  try {
    let toUser = await USER.findOne({ username: toAccount }).session(session);
    let fromUser = await USER.findOne({ username: fromAccount }).session(
      session
    );
    if (toUser && fromUser) {
      await USER.updateOne(
        { username: toAccount },
        { $inc: { amount: amount } }
      ).session(session);
      await USER.updateOne(
        { username: fromAccount },
        { $inc: { amount: -amount } }
      ).session(session);
      await session.commitTransaction();
      await toUser.save(); //We don't need save because it already returns updated user
      await fromUser.save(); //We don't need save because it already returns updated user
      res.json({ msg: "payment received" });
    }
  } catch (error) {
    // Handle errors and roll back the transaction if needed
     session.abortTransaction();
    console.error("Transaction failed:", error);
    res.json({ msg: "payment rejected" });
  } finally {
    // session.endSession();
    await session.endSession();
    // await conn.close();
  }
});
app.listen(8080, function () {
  console.log("listening on port 8080");
});
