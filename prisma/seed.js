const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function seed() {
  try {
    await prisma.role.deleteMany();
    console.log("All roles destroyed!");
    await prisma.role.createMany({
      data: [
        {
          title: "user"
        },
        {
          title: "streamer"
        },
        {
          title: "admin"
        }
      ]
    })
  } catch (error) {
    console.log(error);
  }
  try {
    await prisma.user.deleteMany();
    console.log("All users destroyed!");
    await prisma.user.create({
      data: {
        email: "umer@gmail.com",
        password: "12345678",
        user_name: "umery",
        profile: {
          create: {
            first_name: "umer",
            last_name: "nadeem",
            phone_number: "2345",
            role: "admin",
            gender: "male",
          }
        }
      }
    });
    console.log("User Added in users table!\n");
  } catch (error) {
    console.log(error);
  }
}
seed();
