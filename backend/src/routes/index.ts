import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient(); //client generated based on schema.prisma
//prisma.user // use client to perform operations over all tables automatically without needing to specify from where 'user' or 'todo' table is coming from
//npx prisma studio for watching tables visually like mongo db compass
async function insertUser(
  email: string,
  password: string,
  firstName: string,
  lastName: string
) {
  let res = await prisma.user.create({
    data: { email, password, firstName, lastName },
    select: { email: true, password: true, firstName: true },
  });
  console.log(res);
}
// insertUser("abhi@example.com", "example123", "Abhijeet", "Shukla");
// Update
interface UpdateParams {
  firstName: string;
  lastName: string;
}

async function updateUser(
  username: string,
  { firstName, lastName }: UpdateParams
) {
  let res = await prisma.user.update({
     where: { email: username }, //find by email
    data: { firstName, lastName }, // data to update
  });

  console.log(res);
}
updateUser("abhi@example.com", {
  firstName: "updatedName",
  lastName: "updatedLastName",
});
