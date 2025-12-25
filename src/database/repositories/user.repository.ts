import { users } from '@/database/schema/schema';
import type { InsertUser, User } from '@/database/entities';
import { configDatabase, type DbTransaction } from '@/config';
import { eq } from 'drizzle-orm';
import { BaseRepository } from './';

const db = configDatabase.db;

export class UserRepository extends BaseRepository<User, InsertUser> {
  async findAll(tx?: DbTransaction): Promise<User[]> {
    const dbInstance = tx || db;
    const result = await dbInstance.select().from(users);
    return result;
  }

  async findByEmail(email: string, tx?: DbTransaction): Promise<User | null> {
    const dbInstance = tx || db;
    const result = await dbInstance.select().from(users).where(eq(users.email, email));
    return result[0] || null;
  }

  async findById(id: number, tx?: DbTransaction): Promise<User | null> {
    const dbInstance = tx || db;
    const result = await dbInstance.select().from(users).where(eq(users.id, id));
    return result[0] || null;
  }

  async create(data: InsertUser, tx?: DbTransaction): Promise<User> {
    const dbInstance = tx || db;
    const result = await dbInstance.insert(users).values(data).returning();
    return result[0] as User;
  }

  async updateById(id: number, data: InsertUser, tx?: DbTransaction): Promise<User | null> {
    const dbInstance = tx || db;
    const result = await dbInstance.update(users).set(data).where(eq(users.id, id)).returning();
    return result[0] || null;
  }

  async deleteById(id: number, tx?: DbTransaction): Promise<void> {
    const dbInstance = tx || db;
    await dbInstance.delete(users).where(eq(users.id, id));
  }
}
