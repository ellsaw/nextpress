<?php

namespace Nextpress;

abstract class MetaTable
{
    /**
     * @var array<string, static>
     */
    protected static array $instances = [];

    abstract protected string $table_suffix { get; }
    protected string $table_name;
    protected string $charset_collate;

    final protected function __construct() {
        global $wpdb;
        if (!($wpdb instanceof \wpdb)) return;

        $this->table_name = $wpdb->prefix . $this->table_suffix;
        $this->charset_collate = $wpdb->get_charset_collate();
    }

    final public static function instance(): static {
        $called_class = static::class;

        if (!isset(self::$instances[$called_class])) {
            self::$instances[$called_class] = new static();
        }

        return self::$instances[$called_class];
    }

    final public function setTable(): void {
        try {
            $sql = "CREATE TABLE $this->table_name (
                meta_id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
                object_id bigint(20) unsigned DEFAULT 0 NOT NULL,
                meta_key varchar(255) DEFAULT NULL,
                meta_value longtext DEFAULT NULL,
                PRIMARY KEY (meta_id),
                KEY object_id (object_id),
                KEY meta_key (meta_key(191))
            ) $this->charset_collate;";

            require_once ABSPATH . 'wp-admin/includes/upgrade.php';
            dbDelta($sql);
        } catch(\Throwable $th) {
            throw new \Exception('nextpress_set_meta_table: ' . $th->getMessage());
        }
    }

    final public function insertRow(int $object_id, string $meta_key, mixed $meta_value): void {
        global $wpdb;
        if (!($wpdb instanceof \wpdb)) return;

        if (\is_array($meta_value) || \is_object($meta_value)) {
            $meta_value = maybe_serialize( $meta_value );
        }

        $wpdb->insert(
            $this->table_name, [
                'object_id' => $object_id,
                'meta_key' => $meta_key,
                'meta_value' => $meta_value,
            ], [ '%d', '%s', '%s' ]
        );
    }
}
