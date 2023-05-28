const express = require("express");
const myPlan = express.Router();
const MyPlan = require("../model/myPlan").MyPlan;

let username;

myPlan.post("/", async (req, res) => {
  let newPlan = new MyPlan();
  if (req.body.username) {
    newPlan.username = req.body.username;
    newPlan.name = req.body.name;
    newPlan.phone = req.body.phone;
    newPlan.selectedPlan = req.body.selectedPlan;
    newPlan.selectedDays = req.body.selectedDays;
    newPlan.address = req.body.address;
    newPlan.start = req.body.address;
    newPlan.end = req.body.end;
    newPlan.total = req.body.total;
    newPlan.additional = req.body.additional;
    newPlan.subtotal = req.body.subtotal;
    let response = await newPlan.save();
    res.status(200).json({ myPlan: response, success: true });
  } else {
    res
      .status(400)
      .json({ messasge: "Missing required field", success: false });
  }
});

myPlan.get("/getmyPlan", async (req, res) => {
  let data = await MyPlan.find({ username: username });
  if (data[0]) {
    res.json(data);
  } else {
    res.json({ message: "User has no saved plans", plans: 0 });
  }
});

myPlan.post("/getmyPlan", (req, res) => {
  username = req.body.username;
  res.redirect("/customer/myPlan/getmyPlan");
});

module.exports.myPlan = myPlan;