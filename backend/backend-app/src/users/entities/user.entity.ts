import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Vehicle } from '../../vehicles/entities/vehicle.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 'customer' })
  role: string;

  @OneToMany(() => Vehicle, vehicle => vehicle.user)
  vehicles: Vehicle[];
} 