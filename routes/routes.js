// import { SignUp, Login } from "../controller/controll.js";
// import { Router } from "express";

const express = require("express");
const router = express.Router();

router.post("/Signup");
router.post("/Login", Login);

export default router;
