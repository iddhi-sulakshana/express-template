import type { DbTransaction } from '@/config';

export abstract class BaseRepository<T, I> {
  abstract findAll(tx?: DbTransaction): Promise<T[]>;

  abstract findById(id: number, tx?: DbTransaction): Promise<T | null>;

  abstract create(data: I, tx?: DbTransaction): Promise<T>;

  abstract updateById(id: number, data: I, tx?: DbTransaction): Promise<T | null>;

  abstract deleteById(id: number, tx?: DbTransaction): Promise<void>;
}
