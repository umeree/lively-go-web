const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function seed() {
  try {
    await prisma.user.deleteMany();
    console.log("All users destroyed!");
    await prisma.user.createMany({
      data: [
        {
          email: "munyyb@gmail.com",
          first_name: "Muneeb",
          last_name: "ur rehman",
          password: "admin1234",
        },
        {
          email: "samran@gmail.com",
          first_name: "samran",
          last_name: "Ahmed",
          password: "admin1234",
        },
        {
          email: "umer@gmail.com",
          first_name: "umer",
          last_name: "Nadeem",
          password: "admin1234",
        },
      ],
    });
    console.log("Users Added in users table!\n");
  } catch (error) {
    console.log(error);
  }
}
seed();
