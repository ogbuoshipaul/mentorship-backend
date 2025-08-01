// src/routes/test.route.ts
import express from 'express';
import { testDbConnection } from '../controllers/test.controller';

const router = express.Router();

router.get('/', testDbConnection);

export default router;
