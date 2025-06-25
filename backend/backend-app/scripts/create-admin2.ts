import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash('Admin123', 10);
    
    // Create admin user
    const admin = await prisma.user.upsert({
      where: { email: 'admin2@hakim.com' },
      update: {
        password: hashedPassword,
        role: UserRole.ADMIN,
      },
      create: {
        email: 'admin2@hakim.com',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        phoneNumber: '1234567890',
        role: UserRole.ADMIN,
      },
    });

    console.log('Admin user created/updated successfully:', {
      id: admin.id,
      email: admin.email,
      firstName: admin.firstName,
      lastName: admin.lastName,
      role: admin.role,
      createdAt: admin.createdAt,
    });
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 