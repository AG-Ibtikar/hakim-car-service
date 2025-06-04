import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function updateAdminPassword() {
  try {
    const email = 'admin2@hakim.com';
    const newPassword = '122333';
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // First check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (!existingUser) {
      console.log('User not found. Creating new admin user...');
      // Create new admin user if doesn't exist
      const newUser = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          role: 'ADMIN',
          firstName: 'Admin',
          lastName: 'User',
          phoneNumber: '+1234567890'
        }
      });
      console.log('New admin user created:', newUser);
    } else {
      console.log('Updating existing user...');
      // Update existing user
      const updatedUser = await prisma.user.update({
        where: { email },
        data: { 
          password: hashedPassword,
          role: 'ADMIN'
        }
      });
      console.log('User updated successfully:', updatedUser);
    }

    console.log('Password reset completed successfully.');
  } catch (error) {
    console.error('Error updating password:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateAdminPassword(); 