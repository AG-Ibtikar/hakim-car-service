import { DataSource } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

export async function seedUsers(dataSource: DataSource) {
  const userRepository = dataSource.getRepository(User);

  const testUsers = [
    {
      email: 'admin@hakim.com',
      password: await bcrypt.hash('admin123', 10),
      firstName: 'Admin',
      lastName: 'User',
      phoneNumber: '+1234567890',
      role: 'ADMIN'
    },
    {
      email: 'tech1@hakim.com',
      password: await bcrypt.hash('tech123', 10),
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: '+1234567891',
      role: 'TECHNICIAN'
    },
    {
      email: 'tech2@hakim.com',
      password: await bcrypt.hash('tech123', 10),
      firstName: 'Jane',
      lastName: 'Smith',
      phoneNumber: '+1234567892',
      role: 'TECHNICIAN'
    }
  ];

  for (const userData of testUsers) {
    const existingUser = await userRepository.findOne({
      where: { email: userData.email }
    });

    if (!existingUser) {
      const user = userRepository.create(userData);
      await userRepository.save(user);
      console.log(`Created user: ${userData.email}`);
    }
  }
} 