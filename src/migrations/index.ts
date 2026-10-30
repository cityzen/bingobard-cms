import * as migration_20261030_161107_add_posts_and_short_testimonial from './20261030_161107_add_posts_and_short_testimonial';
import * as migration_baseline from './baseline';

export const migrations = [
  {
    up: migration_20261030_161107_add_posts_and_short_testimonial.up,
    down: migration_20261030_161107_add_posts_and_short_testimonial.down,
    name: '20261030_161107_add_posts_and_short_testimonial',
  },
  {
    up: migration_baseline.up,
    down: migration_baseline.down,
    name: 'baseline'
  },
];
