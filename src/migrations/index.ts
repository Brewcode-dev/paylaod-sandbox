import * as migration_20250804_074457 from './20250804_074457';
import * as migration_20250804_074506 from './20250804_074506';
import * as migration_20250806_135226 from './20250806_135226';

export const migrations = [
  {
    up: migration_20250804_074457.up,
    down: migration_20250804_074457.down,
    name: '20250804_074457',
  },
  {
    up: migration_20250804_074506.up,
    down: migration_20250804_074506.down,
    name: '20250804_074506',
  },
  {
    up: migration_20250806_135226.up,
    down: migration_20250806_135226.down,
    name: '20250806_135226'
  },
];
