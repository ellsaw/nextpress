import { SelectQueryBuilder } from "kysely";

export default function logQuery(query: SelectQueryBuilder<any, any, any>): void {
    if (process.env.NODE_ENV !== 'development') return;

    const compiled = query.selectAll().compile();
    console.log("Running SQL:", compiled.sql, compiled.parameters);
}
