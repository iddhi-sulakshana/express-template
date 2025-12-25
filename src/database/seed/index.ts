import seedUsers from './user.seed';
import { resetSequences } from './resetSequence.seed';

export async function seed() {
  await seedUsers();

  // Reset sequences after all seeding is complete
  await resetSequences();

  console.log('🌳 All seeding completed!');
  process.exit(0);
}

seed();
