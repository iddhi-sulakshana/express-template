import { users } from '@/database/schema/schema';
import type { InsertUser, User } from '@/database/entities';
import { db } from '@/config/database.config';
import { eq } from 'drizzle-orm';

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0] || null;
  }

  async findById(id: string): Promise<User | null> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0] || null;
  }

  async create(data: InsertUser): Promise<InsertUser> {
    const result = await db.insert(users).values(data).returning();
    return result[0] as User;
  }
}
