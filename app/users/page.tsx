import prisma from "@/lib/prisma";

export default async function Users() {
  const users = await prisma.user.findMany();
  console.log(users);
  return (
    <div>
      hello
    </div>
  );
}