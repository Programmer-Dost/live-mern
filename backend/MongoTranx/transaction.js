const mongoose = require("mongoose");
const express = require("express");
const app = express();
import { connectDB } from "../../../../backend/database/connect";

connectDB();
async function middleware(req, res, next) {
  let username = req.headers.get("username");
  let password = req.headers.get("password");

  if (username && password) {
    USER.findOne({ username: username, password: password })
      .then(function (user) {
        if (user) {
          req.user = user;
          next();
        } else {
          res.status(401).json({ error: "Unauthorized" });
        }
      })
      .catch(function (err) {
        res.status(500).json({ error: err.message });
      });
  }
}
export async function POST(req, res, next) {
  const amount = req.body.amount;
  const toAccount = req.body.toAccount;
  const fromAccount = req.body.fromAccount;
  const session = client.startSession();
  try {
    let toUser = await USER.findOne({ email: toAccount });
    let fromUser = await USER.findOne({ email: fromAccount });
    if (toUser && fromUser) {
      await USER.UpdateOne({ email: toAccount }, { $inc: +amount });
      await USER.UpdateOne({ email: fromAccount }, { $inc: -amount });
      // await toUser.save(); //We don't need save because it already returns updated user
      // await fromUser.save(); //We don't need save because it already returns updated user
    }
  } catch (err) {}
}
