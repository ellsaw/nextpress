import { QueryCreator, Selectable, sql } from "kysely";
import { DB, WpTerm } from "../../types/wpdb/wpdb";
import wpdb from "../../wpdb/wpdb";
import logQuery from "../../wpdb/logQuery";

export default class WPTermQuery {
    private taxonomyArgs?: WPTermQueryTaxonomyArgs;
    private termArgs?: WPTermQueryTermArgs;
    private hierarchyArgs?: WPTermQueryHierarchyArgs;
    private searchArgs?: WPTermQuerySearchArgs;
    private orderArgs?: WPTermQueryOrderArgs;
    private paginationArgs?: WPTermQueryPaginationArgs;

    private termCount?: number;

    constructor() {}

    public setTaxonomy(args: WPTermQueryTaxonomyArgs): this {
        this.taxonomyArgs = args;
        return this;
    }

    public setTerms(args: WPTermQueryTermArgs): this {
        this.termArgs = args;
        return this;
    }

    public setHierarchy(args: WPTermQueryHierarchyArgs): this {
        this.hierarchyArgs = args;
        return this;
    }

    public setSearch(args: WPTermQuerySearchArgs): this {
        this.searchArgs = args;
        return this;
    }

    public setOrder(args: WPTermQueryOrderArgs): this {
        this.orderArgs = args;
        return this;
    }

    public setPagination(args: WPTermQueryPaginationArgs): this {
        this.paginationArgs = args;
        return this;
    }

    public getTermCount(): number {
        if (this.termCount === undefined) {
            throw new Error('WPTermQuery: noFoundRows must be false and getTermCount must be called after getTerms() to get the term count');
        }
        return this.termCount;
    }

    public async getTerms(): Promise<Selectable<WpTerm>[]> {
        let builder = wpdb as QueryCreator<any>;

        // 2. Build CTEs
        if (this.termArgs) {
            if (this.termArgs.termId) {
                const termIds = Array.isArray(this.termArgs.termId) ? this.termArgs.termId : [this.termArgs.termId];
                builder = builder.withRecursive('included_branch_id', (qb) =>
                    qb.selectFrom('wpTermTaxonomy')
                        .select(['termId', 'parent'])
                        .where((eb) => eb.or([
                            eb('termId', 'in', termIds),
                            eb('parent', 'in', termIds)
                        ]))
                        .unionAll(
                            qb.selectFrom('wpTermTaxonomy as t')
                            .select(['t.termId', 't.parent'])
                            .innerJoin('included_branch_id as f', 'f.termId', 't.parent')
                        )
                );
            }

            if (this.termArgs.termIdNot) {
                const termIds = Array.isArray(this.termArgs.termIdNot) ? this.termArgs.termIdNot : [this.termArgs.termIdNot];
                builder = builder.withRecursive('excluded_branch_id', (qb) =>
                    qb.selectFrom('wpTermTaxonomy')
                        .select(['termId', 'parent'])
                        .where((eb) => eb.or([
                            eb('termId', 'in', termIds),
                            eb('parent', 'in', termIds)
                        ]))
                        .unionAll(
                            qb.selectFrom('wpTermTaxonomy as t')
                            .select(['t.termId', 't.parent'])
                            .innerJoin('excluded_branch_id as f', 'f.termId', 't.parent')
                        )
                );
            }

            if (this.termArgs.termName) {
                const names = Array.isArray(this.termArgs.termName) ? this.termArgs.termName : [this.termArgs.termName];
                builder = builder.withRecursive('included_branch_name', (qb) =>
                    qb.selectFrom('wpTermTaxonomy')
                        .innerJoin('wpTerms', 'wpTerms.termId', 'wpTermTaxonomy.termId')
                        .select(['wpTermTaxonomy.termId', 'wpTermTaxonomy.parent'])
                        .where('wpTerms.name', 'in', names)
                        .unionAll(
                            qb.selectFrom('wpTermTaxonomy as t')
                            .select(['t.termId', 't.parent'])
                            .innerJoin('included_branch_name as f', 'f.termId', 't.parent')
                        )
                );
            }

            if (this.termArgs.termSlug) {
                const slugs = Array.isArray(this.termArgs.termSlug) ? this.termArgs.termSlug : [this.termArgs.termSlug];
                builder = builder.withRecursive('included_branch_slug', (qb) =>
                    qb.selectFrom('wpTermTaxonomy')
                        .innerJoin('wpTerms', 'wpTerms.termId', 'wpTermTaxonomy.termId')
                        .select(['wpTermTaxonomy.termId', 'wpTermTaxonomy.parent'])
                        .where('wpTerms.slug', 'in', slugs)
                        .unionAll(
                            qb.selectFrom('wpTermTaxonomy as t')
                            .select(['t.termId', 't.parent'])
                            .innerJoin('included_branch_slug as f', 'f.termId', 't.parent')
                        )
                );
            }

            if (this.termArgs.termSlugNot) {
                const slugs = Array.isArray(this.termArgs.termSlugNot) ? this.termArgs.termSlugNot : [this.termArgs.termSlugNot];
                builder = builder.withRecursive('excluded_branch_slug', (qb) =>
                    qb.selectFrom('wpTermTaxonomy')
                        .innerJoin('wpTerms', 'wpTerms.termId', 'wpTermTaxonomy.termId')
                        .select(['wpTermTaxonomy.termId', 'wpTermTaxonomy.parent'])
                        .where('wpTerms.slug', 'in', slugs)
                        .unionAll(
                            qb.selectFrom('wpTermTaxonomy as t')
                            .select(['t.termId', 't.parent'])
                            .innerJoin('excluded_branch_slug as f', 'f.termId', 't.parent')
                        )
                );
            }
        }

        // 3. Begin Main SELECT Statement
        let query = (builder as QueryCreator<DB>).selectFrom('wpTerms')
            .innerJoin('wpTermTaxonomy', 'wpTerms.termId', 'wpTermTaxonomy.termId');

        // 4. Apply Filters (WHERE clauses)
        if (this.taxonomyArgs?.taxonomy) {
            const taxonomies = Array.isArray(this.taxonomyArgs.taxonomy) ? this.taxonomyArgs.taxonomy : [this.taxonomyArgs.taxonomy];
            query = query.where('wpTermTaxonomy.taxonomy', 'in', taxonomies);
        }
        if (this.taxonomyArgs?.taxonomyId) {
            const ids = Array.isArray(this.taxonomyArgs.taxonomyId) ? this.taxonomyArgs.taxonomyId : [this.taxonomyArgs.taxonomyId];
            query = query.where('wpTermTaxonomy.termTaxonomyId', 'in', ids);
        }

        if (this.termArgs) {
            if (this.termArgs.termId)               query = query.where('wpTerms.termId', 'in', (qb: any) => qb.selectFrom('included_branch_id').select('termId'));
            if (this.termArgs.termIdNot)            query = query.where('wpTerms.termId', 'not in', (qb: any) => qb.selectFrom('excluded_branch_id').select('termId'));
            if (this.termArgs.termName)             query = query.where('wpTerms.termId', 'in', (qb: any) => qb.selectFrom('included_branch_name').select('termId'));
            if (this.termArgs.termSlug)             query = query.where('wpTerms.termId', 'in', (qb: any) => qb.selectFrom('included_branch_slug').select('termId'));
            if (this.termArgs.termSlugNot)          query = query.where('wpTerms.termId', 'not in', (qb: any) => qb.selectFrom('excluded_branch_slug').select('termId'));
            if (this.termArgs.hideEmpty !== false)  query = query.where('wpTermTaxonomy.count', '>', 0);
        }

        if (this.hierarchyArgs?.parent !== undefined) {
            query = query.where('wpTermTaxonomy.parent', '=', this.hierarchyArgs.parent);
        }
        if (this.hierarchyArgs?.childless) {
            query = query.where('wpTerms.termId', 'not in', (qb) =>
                qb.selectFrom('wpTermTaxonomy').select('wpTermTaxonomy.parent').where('wpTermTaxonomy.parent', '>', 0)
            );
        }

        if (this.searchArgs?.search) {
            const searchStr = `%${this.searchArgs.search}%`;
            query = query.where((eb) => eb.or([
                eb('wpTerms.name', 'like', searchStr),
                eb('wpTerms.slug', 'like', searchStr)
            ]));
        }
        if (this.searchArgs?.nameLike) {
            query = query.where('wpTerms.name', 'like', this.searchArgs.nameLike);
        }
        if (this.searchArgs?.descriptionLike) {
            query = query.where('wpTermTaxonomy.description', 'like', this.searchArgs.descriptionLike);
        }

        // 5. Calculate Total Count (Before Limits/Offsets)
        if (!this.paginationArgs?.noFoundRows) {
            try {
                const countQueryBase = query.clearSelect().select('wpTerms.termId').distinct();
                const termCountResult = await wpdb.selectFrom(countQueryBase.as('sub'))
                    .select(sql<number>`count(*)`.as('count'))
                    .executeTakeFirst();
                this.termCount = termCountResult ? Number(termCountResult.count) : undefined;
            } catch (error: any) {
                console.error('WPTermQuery: Cannot get row count: ', error.message);
                this.termCount = undefined;
            }
        }

        // 6. Apply ORDER BY
        const orderDirection = this.orderArgs?.order === 'DESC' ? 'desc' : 'asc';
        const orderBy = this.orderArgs?.orderBy || 'none';

        switch(orderBy) {
            case 'none': break;
            case 'term_id':     query = query.orderBy('wpTerms.termId', orderDirection); break;
            case 'name':        query = query.orderBy('wpTerms.name', orderDirection); break;
            case 'slug':        query = query.orderBy('wpTerms.slug', orderDirection); break;
            case 'term_group':  query = query.orderBy('wpTerms.termGroup', orderDirection); break;
            case 'description': query = query.orderBy('wpTermTaxonomy.description', orderDirection); break;
            case 'parent':      query = query.orderBy('wpTermTaxonomy.parent', orderDirection); break;
            case 'count':       query = query.orderBy('wpTermTaxonomy.count', orderDirection); break;
            default:            query = query.orderBy('wpTerms.name', orderDirection); break;
        }

        // 7. Apply LIMIT & OFFSET
        const limit = this.paginationArgs?.number ?? 0;
        if (limit > 0) {
            query = query.limit(limit);
        }

        const offsetAmount = this.paginationArgs?.offset ?? 0;
        if (offsetAmount > 0) {
            query = query.offset(offsetAmount);
        }

        // 8. Execute Final Query
        logQuery(query);

        try {
            return await query.selectAll('wpTerms').selectAll('wpTermTaxonomy').distinct().execute();
        } catch (error: any) {
            throw new Error(`WPTermQuery: Cannot get terms: ${error.message}`, { cause: error });
        }
    }
}
