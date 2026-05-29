import { ComparisonOperatorExpression } from "kysely";

type WPPostMetaQueryArgs = {
    /** Unique ID or array of IDs representing the metadata entries. */
    metaId?: number | number[];
    /** Post ID or array of IDs associated with the metadata. */
    postId?: number | number[];
    /** The metadata key condition evaluated as an equation. */
    metaKey?: Equation;
    /** The metadata value condition evaluated as an equation. */
    metaValue?: Equation;
}[];

type Equation = {
    operand: ComparisonOperatorExpression
    variable: string
}
