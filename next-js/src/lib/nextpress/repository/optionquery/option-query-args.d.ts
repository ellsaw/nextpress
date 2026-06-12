import { DB, WpOption } from "../../types/wpdb/wpdb";

interface OptionQueryArgs {
    column: ReferenceExpression<DB, WpOption>
    operand?: ComparisonOperatorExpression,
    value: string | string[],
}
