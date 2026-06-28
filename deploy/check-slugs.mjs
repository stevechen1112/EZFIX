import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const posts = await prisma.blogPost.findMany({
  where: { isPublished: true },
  select: { id: true, slug: true, updatedAt: true },
});
console.log(JSON.stringify(posts, null, 2));
await prisma.$disconnect();
