import * as migration_baseline from './baseline';

export const migrations = [
  {
    up: migration_baseline.up,
    down: migration_baseline.down,
    name: 'baseline',
  },
];