import { type Selectable } from 'kysely';
import { WpPost } from '../../wpdb/wpdb';
import { WPAttachment } from './WPAttachment';

interface WPPostBase extends Selectable<WpPost> {};
