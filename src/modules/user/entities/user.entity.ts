import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

enum UserRole {
  Admin = 1,
  Customer = 2,
}
@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 30 })
  name: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column('text')
  address: string;

  @Column('varchar')
  phone: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.Customer, // Default role is Customer
  })
  role: UserRole;
}
