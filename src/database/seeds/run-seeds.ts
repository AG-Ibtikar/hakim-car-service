import { DataSource } from 'typeorm';
import { seedUsers } from './users.seed';
import { config } from 'dotenv';

config(); // Load environment variables

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'hakim_car_service',
  entities: ['src/**/*.entity{.ts,.js}'],
  synchronize: true,
});

async function runSeeds() {
  try {
    await dataSource.initialize();
    console.log('Running database seeds...');

    await seedUsers(dataSource);

    console.log('Seeds completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error running seeds:', error);
    process.exit(1);
  }
}

runSeeds(); 