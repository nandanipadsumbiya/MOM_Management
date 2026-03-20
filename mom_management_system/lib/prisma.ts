import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
    const adapter = new PrismaMariaDb({
        host: "localhost",
        port: 3306,
        user: "root",
        password: "NP5337@np",
        database: "meetingManegment",
        connectionLimit: 10 // Increased from 5 to 10 for better concurrency
    });

    console.log("Initializing new Prisma Client instance...");
    return new PrismaClient({ adapter });
};

const globalForPrisma = global as unknown as {
  prisma: PrismaClient
}

export const prisma =
  globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production')
  globalForPrisma.prisma = prisma
