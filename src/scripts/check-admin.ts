import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function checkAdminUser() {
  try {
    const adminUser = await prisma.user.findUnique({
      where: {
        email: 'admin@hakim.com',
      },
    });

    if (!adminUser) {
      console.log('Admin user not found');
      return;
    }

    console.log('Admin user details:', {
      id: adminUser.id,
      email: adminUser.email,
      role: adminUser.role,
      firstName: adminUser.firstName,
      lastName: adminUser.lastName,
    });

    // Verify role is ADMIN
    if (adminUser.role !== UserRole.ADMIN) {
      console.log('User is not an admin, updating role...');
      const updatedUser = await prisma.user.update({
        where: {
          id: adminUser.id,
        },
        data: {
          role: UserRole.ADMIN,
        },
      });
      console.log('Updated user role to ADMIN:', updatedUser);
    } else {
      console.log('User is already an admin');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAdminUser(); 