/**
 * Interface representing the WordPress WP_Post object.
 * Based on WP Core 3.5.0+
 */
interface WPPost {
  /** Post ID */
    ID: number;

    /** ID of post author (numeric string) */
    post_author: string;

    /** The post's local publication time (YYYY-MM-DD HH:MM:SS) */
    post_date: string;

    /** The post's GMT publication time (YYYY-MM-DD HH:MM:SS) */
    post_date_gmt: string;

    /** The post's content */
    post_content: string;

    /** The post's title */
    post_title: string;

    /** The post's excerpt */
    post_excerpt: string;

    /** The post's status (e.g., 'publish', 'draft', 'inherit') */
    post_status: string;

    /** Whether comments are allowed ('open' or 'closed') */
    comment_status: string;

    /** Whether pings are allowed ('open' or 'closed') */
    ping_status: string;

    /** The post's password in plain text */
    post_password: string;

    /** The post's slug (URL friendly name) */
    post_name: string;

    /** URLs queued to be pinged */
    to_ping: string;

    /** URLs that have been pinged */
    pinged: string;

    /** The post's local modified time */
    post_modified: string;

    /** The post's GMT modified time */
    post_modified_gmt: string;

    /** A utility DB field for post content */
    post_content_filtered: string;

    /** ID of a post's parent post */
    post_parent: number;

    /** The unique identifier (GUID) */
    guid: string;

    /** Field used for ordering posts */
    menu_order: number;

    /** The post's type (e.g., 'post', 'page', 'attachment') */
    post_type: string;

    /** An attachment's mime type */
    post_mime_type: string;

    /** Cached comment count (numeric string) */
    comment_count: string;

    /** Stores the post object's sanitization level */
    filter: 'raw' | 'edit' | 'db' | 'display' | 'attribute' | 'js' | string;

    // --- Virtual Properties (Handled by __get in PHP) ---

    /** Array of parent post IDs */
    ancestors?: number[];

    /** The page template file name */
    page_template?: string;

    /** Array of category IDs */
    post_category?: number[];

    /** Array of tag names */
    tags_input?: string[];
}