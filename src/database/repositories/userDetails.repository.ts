import type { DbTransaction } from '@/config';
import type { InsertUserDetails, UserDetails } from '../entities/userDetails.entity';
import { BaseRepository } from './sample.repository';
import { userDetails } from '../schema/schema';
import { eq } from 'drizzle-orm';
import { configDatabase } from '@/config';

const db = configDatabase.db;

export class UserDetailsRepository extends BaseRepository<UserDetails, InsertUserDetails> {
  async findAll(tx?: DbTransaction): Promise<UserDetails[]> {
    const dbInstance = tx || db;
    const result = await dbInstance.select().from(userDetails);
    return result;
  }
  async findById(id: number, tx?: DbTransaction): Promise<UserDetails | null> {
    const dbInstance = tx || db;
    const result = await dbInstance.select().from(userDetails).where(eq(userDetails.userId, id));
    return result[0] || null;
  }
  async create(data: InsertUserDetails, tx?: DbTransaction): Promise<UserDetails> {
    const dbInstance = tx || db;
    const result = await dbInstance.insert(userDetails).values(data).returning();
    return result[0] as UserDetails;
  }
  async updateById(
    id: number,
    data: InsertUserDetails,
    tx?: DbTransaction,
  ): Promise<UserDetails | null> {
    const dbInstance = tx || db;
    const result = await dbInstance
      .update(userDetails)
      .set(data)
      .where(eq(userDetails.userId, id))
      .returning();
    return result[0] || null;
  }
  async deleteById(id: number, tx?: DbTransaction): Promise<void> {
    const dbInstance = tx || db;
    await dbInstance.delete(userDetails).where(eq(userDetails.userId, id));
  }
}
