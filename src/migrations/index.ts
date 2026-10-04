import * as migration_20250929_111647 from './20250929_111647';
import * as migration_20260822_234535 from './20260822_234535';
import * as migration_20260919_154133_case_studies from './20260919_154133_case_studies';
import * as migration_20260919_161500_case_studies_quote_relationship from './20260919_161500_case_studies_quote_relationship';
import * as migration_20260919_162919_case_studies_testimonials_multi from './20260919_162919_case_studies_testimonials_multi';
import * as migration_20260921_233504_catch_up_to_current_schema from './20260921_233504_catch_up_to_current_schema';
import * as migration_20260922_003059_drop_icon_provider_column from './20260922_003059_drop_icon_provider_column';
import * as migration_20260922_005102_simplify_verticals_remove_feature_cards from './20260922_005102_simplify_verticals_remove_feature_cards';

export const migrations = [
  {
    up: migration_20250929_111647.up,
    down: migration_20250929_111647.down,
    name: '20250929_111647',
  },
  {
    up: migration_20260822_234535.up,
    down: migration_20260822_234535.down,
    name: '20260822_234535',
  },
  {
    up: migration_20260919_154133_case_studies.up,
    down: migration_20260919_154133_case_studies.down,
    name: '20260919_154133_case_studies',
  },
  {
    up: migration_20260919_161500_case_studies_quote_relationship.up,
    down: migration_20260919_161500_case_studies_quote_relationship.down,
    name: '20260919_161500_case_studies_quote_relationship',
  },
  {
    up: migration_20260919_162919_case_studies_testimonials_multi.up,
    down: migration_20260919_162919_case_studies_testimonials_multi.down,
    name: '20260919_162919_case_studies_testimonials_multi',
  },
  {
    up: migration_20260921_233504_catch_up_to_current_schema.up,
    down: migration_20260921_233504_catch_up_to_current_schema.down,
    name: '20260921_233504_catch_up_to_current_schema',
  },
  {
    up: migration_20260922_003059_drop_icon_provider_column.up,
    down: migration_20260922_003059_drop_icon_provider_column.down,
    name: '20260922_003059_drop_icon_provider_column',
  },
  {
    up: migration_20260922_005102_simplify_verticals_remove_feature_cards.up,
    down: migration_20260922_005102_simplify_verticals_remove_feature_cards.down,
    name: '20260922_005102_simplify_verticals_remove_feature_cards'
  },
];
