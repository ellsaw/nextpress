<?php
namespace Nextpress;
require_once __DIR__ . '/MetaTable.php';

class PostMetaTable extends MetaTable
{
    protected string $table_suffix = 'nextpress_postmeta';
}
