<?php
namespace Nextpress;
require_once __DIR__ . '/MetaTable.php';

class TermMetaTable extends MetaTable
{
    protected string $table_suffix = 'nextpress_termmeta';
}
