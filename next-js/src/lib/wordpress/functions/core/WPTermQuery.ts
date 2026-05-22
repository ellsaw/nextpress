import { QueryCreator, sql } from "kysely";
import { DB } from "../../types/wpdb/wpdb";
import wpdb from "../../wpdb/wpdb";
import logQuery from "../../wpdb/logQuery";
import { WPTerm } from "../../types/entities/WPTerm";

export default class WPTermQuery {
    private termCount?: number;

    public constructor(
        private args: WPTermQueryArgs = {}
    ) {}

    public getTermCount(): number {
        if (this.termCount === undefined) {
            throw new Error('WPTermQuery: noFoundRows must be false and getTermCount must be called after getTerms() to get the term count');
        }
        return this.termCount;
    }

    public async getTerms(): Promise<WPTerm[]> {
        let builder = wpdb as QueryCreator<any>;

        // -- Build CTEs --
        if (this.args.termId) {
            const termIds = Array.isArray(this.args.termId) ? this.args.termId : [this.args.termId];
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

        if (this.args.termIdNot) {
            const termIds = Array.isArray(this.args.termIdNot) ? this.args.termIdNot : [this.args.termIdNot];
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

        if (this.args.termName) {
            const names = Array.isArray(this.args.termName) ? this.args.termName : [this.args.termName];
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

        if (this.args.termSlug) {
            const slugs = Array.isArray(this.args.termSlug) ? this.args.termSlug : [this.args.termSlug];
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

        if (this.args.termSlugNot) {
            const slugs = Array.isArray(this.args.termSlugNot) ? this.args.termSlugNot : [this.args.termSlugNot];
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

        // -- Begin Main SELECT Statement --
        let query = (builder as QueryCreator<DB>).selectFrom('wpTerms')
            .innerJoin('wpTermTaxonomy', 'wpTerms.termId', 'wpTermTaxonomy.termId');

        // -- Apply Filters (WHERE clauses) --
        if (this.args.taxonomy) {
            const taxonomies = Array.isArray(this.args.taxonomy) ? this.args.taxonomy : [this.args.taxonomy];
            query = query.where('wpTermTaxonomy.taxonomy', 'in', taxonomies);
        }
        if (this.args.taxonomyId) {
            const ids = Array.isArray(this.args.taxonomyId) ? this.args.taxonomyId : [this.args.taxonomyId];
            query = query.where('wpTermTaxonomy.termTaxonomyId', 'in', ids);
        }

        if (this.args.termId)               query = query.where('wpTerms.termId', 'in', (qb: any) => qb.selectFrom('included_branch_id').select('termId'));
        if (this.args.termIdNot)            query = query.where('wpTerms.termId', 'not in', (qb: any) => qb.selectFrom('excluded_branch_id').select('termId'));
        if (this.args.termName)             query = query.where('wpTerms.termId', 'in', (qb: any) => qb.selectFrom('included_branch_name').select('termId'));
        if (this.args.termSlug)             query = query.where('wpTerms.termId', 'in', (qb: any) => qb.selectFrom('included_branch_slug').select('termId'));
        if (this.args.termSlugNot)          query = query.where('wpTerms.termId', 'not in', (qb: any) => qb.selectFrom('excluded_branch_slug').select('termId'));
        if (this.args.hideEmpty !== false)  query = query.where('wpTermTaxonomy.count', '>', 0);

        if (this.args.parent !== undefined) {
            query = query.where('wpTermTaxonomy.parent', '=', this.args.parent);
        }
        if (this.args.childless) {
            query = query.where('wpTerms.termId', 'not in', (qb) =>
                qb.selectFrom('wpTermTaxonomy').select('wpTermTaxonomy.parent').where('wpTermTaxonomy.parent', '>', 0)
            );
        }

        if (this.args.search) {
            const searchStr = `%${this.args.search}%`;
            query = query.where((eb) => eb.or([
                eb('wpTerms.name', 'like', searchStr),
                eb('wpTerms.slug', 'like', searchStr)
            ]));
        }
        if (this.args.nameLike) {
            query = query.where('wpTerms.name', 'like', this.args.nameLike);
        }
        if (this.args.descriptionLike) {
            query = query.where('wpTermTaxonomy.description', 'like', this.args.descriptionLike);
        }

        // -- Calculate Total Count (Before Limits/Offsets) --
        if (!this.args.noFoundRows) {
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

        // -- Apply ORDER BY --
        const orderDirection = this.args.order === 'DESC' ? 'desc' : 'asc';
        const orderBy = this.args.orderBy || 'none';

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

        // -- Apply LIMIT & OFFSET --
        const limit = this.args.number ?? 0;
        if (limit > 0) {
            query = query.limit(limit);
        }

        const offsetAmount = this.args.offset ?? 0;
        if (offsetAmount > 0) {
            query = query.offset(offsetAmount);
        }

        logQuery(query);

        try {
            return await query
                .leftJoin('wpTermmeta as meta', (join) =>
                    join
                        .onRef('meta.termId', '=', 'wpTerms.termId')
                        .on('meta.metaKey', '=', '_nextpress_full_path')
                    )
                    .select([
                        'wpTermTaxonomy.taxonomy',
                        'wpTerms.termId',
                        'wpTerms.name',
                        'wpTerms.slug',
                        'wpTerms.termGroup',
                        'wpTermTaxonomy.termTaxonomyId',
                        'wpTermTaxonomy.description',
                        'wpTermTaxonomy.parent',
                        'wpTermTaxonomy.count'
                    ])
                    .select('meta.metaValue as path')
                    .distinct()
                    .execute();
        } catch (error: any) {
            throw new Error(`WPTermQuery: Cannot get terms: ${error.message}`, { cause: error });
        }
    }
}
