import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    // Delete existing admin users
    await prisma.user.deleteMany({
      where: {
        email: {
          in: ['admin22@hakim.com', 'admin@hakim.com']
        }
      }
    });

    const hashedPassword = await bcrypt.hash('Admin@123', 10);

    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@hakim.com',
        password: hashedPassword,
        firstName: 'Super',
        lastName: 'Admin',
        role: UserRole.ADMIN,
        phoneNumber: '1234567890',
      },
    });

    console.log('New admin user created:', {
      id: adminUser.id,
      email: adminUser.email,
      role: adminUser.role,
      password: 'Admin@123' // Only for testing, remove in production
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser(); 