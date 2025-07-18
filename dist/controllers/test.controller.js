"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testDbConnection = void 0;
const client_1 = require("../prisma/client");
const testDbConnection = async (req, res) => {
    try {
        const users = await client_1.prisma.user.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
        });
        res.status(200).json({
            message: '✅ Prisma is connected!',
            users,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: '❌ Failed to connect to the database.' });
    }
};
exports.testDbConnection = testDbConnection;
