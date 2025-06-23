import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function updateAdminPassword() {
  try {
    // Get email and password from command line arguments
    const email = process.argv[2] || 'admin@hakim.com';
    const newPassword = process.argv[3] || 'admin123';
    
    console.log(`Updating password for user: ${email}`);
    
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
          firstName: 'Super',
          lastName: 'Admin',
          phoneNumber: '1234567890'
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