const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function seed() {
  try {
    await prisma.role.deleteMany();
    console.log("All roles destroyed!");
    await prisma.role.createMany({
      data: [
        {
          title: "user",
        },
        {
          title: "streamer",
        },
        {
          title: "admin",
        },
      ],
    });
  } catch (error) {
    console.log(error);
  }
  try {
    await prisma.profile.deleteMany();
    await prisma.user.deleteMany();
    console.log("All users destroyed!");
    await prisma.user.create({
      data: {
        email: "umer@gmail.com",
        password: "12345678",
        user_name: "umery",
        role: "admin",
        profile: {
          create: {
            first_name: "umer",
            last_name: "nadeem",
            phone_number: "2345",
            gender: "male",
          },
        },
      },
    });
    await prisma.user.create({
      data: {
        email: "munyyb@gmail.com",
        password: "12345678",
        user_name: "Munyyb",
        role: "admin",
        profile: {
          create: {
            first_name: "Munyyb",
            last_name: "Ur Rehman",
            phone_number: "2345",
            gender: "male",
          },
        },
      },
    });
    console.log("All users Added!");
  } catch (error) {
    console.log(error);
  }
}
seed();
