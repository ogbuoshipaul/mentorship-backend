"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/test.route.ts
const express_1 = __importDefault(require("express"));
const test_controller_1 = require("../controllers/test.controller");
const router = express_1.default.Router();
router.get('/', test_controller_1.testDbConnection);
exports.default = router;
