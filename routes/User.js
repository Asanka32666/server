import express from "express";

// Controllers
import { userRegister, userVerification, userLogin, checkToken } from "../controllers/User.js";

const router = express.Router();

router.post("/register", userRegister);
router.patch("/verification", userVerification);
router.post("/login", userLogin);
router.post("/check", checkToken)

export default router;
