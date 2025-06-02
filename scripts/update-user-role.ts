import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const updatedUser = await prisma.user.update({
      where: {
        email: 'admin3@hakim.com',
      },
      data: {
        role: 'ADMIN',
      },
    });

    console.log('User updated successfully:', updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 