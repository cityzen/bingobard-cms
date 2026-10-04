import * as migration_20261004_210816_baseline from './20261004_210816_baseline';

export const migrations = [
  {
    up: migration_20261004_210816_baseline.up,
    down: migration_20261004_210816_baseline.down,
    name: '20261004_210816_baseline'
  },
];
