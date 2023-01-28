// lib/prisma.ts
const prisma = require("@prisma/client");

let PrismaDB;

if (process.env.NODE_ENV === "production") {
  PrismaDB = new prisma.PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new prisma.PrismaClient();
  }
  PrismaDB = global.prisma;
}

module.exports = PrismaDB;
