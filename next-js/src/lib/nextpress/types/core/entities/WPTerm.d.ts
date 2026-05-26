import { type Selectable } from 'kysely';
import { WpTerm, WpTermTaxonomy } from '../../wpdb/wpdb';

interface WPTerm extends Selectable<WpTerm>, Selectable<WpTermTaxonomy> {};

