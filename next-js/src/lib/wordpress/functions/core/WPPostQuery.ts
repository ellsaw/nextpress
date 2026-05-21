import { Selectable, sql } from "kysely";
import { WpPost } from "../../types/wpdb/wpdb";
import * as phpSerialize from "php-serialize";
import wpdb from "../../wpdb/wpdb";
import wpGetOption from "../wpGetOption";
import logQuery from "../../wpdb/logQuery";

export default class WPPostQuery {
    private idArgs?: WPPostQueryIdArgs;
    private typeArgs?: WPPostQueryTypeArgs;
    private statusArgs?: WPPostQueryStatusArgs;
    private contentArgs?: WPPostQueryContentArgs;
    private parentArgs?: WPPostQueryParentArgs;
    private termArgs?: WPPostQueryTermArgs;
    private authorArgs?: WPPostQueryAuthorArgs;
    private searchArgs?: WPPostQuerySearchArgs;
    private dateArgs?: WPPostQueryDateArgs;
    private orderArgs?: WPPostQueryOrderArgs;
    private paginationArgs?: WPPostQueryPaginationArgs;

    private postCount?: number;

    constructor() {}

    public setPostId(args: WPPostQueryIdArgs): this {
        this.idArgs = args;
        return this;
    }

    public setPostType(args: WPPostQueryTypeArgs): this {
        this.typeArgs = args;
        return this;
    }

    public setPostStatus(args: WPPostQueryStatusArgs): this {
        this.statusArgs = args;
        return this;
    }

    public setPostContent(args: WPPostQueryContentArgs): this {
        this.contentArgs = args;
        return this;
    }

    public setPostParents(args: WPPostQueryParentArgs): this {
        this.parentArgs = args;
        return this;
    }

    public setTerms(args: WPPostQueryTermArgs): this {
        this.termArgs = args;
        return this;
    }

    public setAuthor(args: WPPostQueryAuthorArgs): this {
        this.authorArgs = args;
        return this;
    }

    public setSearch(args: WPPostQuerySearchArgs): this {
        this.searchArgs = args;
        return this;
    }

    public setDate(args: WPPostQueryDateArgs): this {
        this.dateArgs = args;
        return this;
    }

    public setOrder(args: WPPostQueryOrderArgs): this {
        this.orderArgs = args;
        return this;
    }

    public setPagination(args: WPPostQueryPaginationArgs): this {
        this.paginationArgs = args;
        return this;
    }

    public getPostCount(): number {
        if (this.postCount === undefined) {
            throw new Error('WPPostQuery: noFoundRows must be false and getPostCount must be called after getPosts() to get the post count');
        }
        return this.postCount;
    }

    /**
     * Finalizes the query build process, logs the query, and executes it against the database.
     * @throws {Error} If the execution of the query fails.
     * @returns {Promise<Selectable<WpPost>[]>} A promise that resolves to an array of fetched WordPress posts.
     */
    public async getPosts(): Promise<Selectable<WpPost>[]> {
        let query = wpdb.selectFrom('wpPosts');

        // --- ID Filters ---
        if (this.idArgs?.postId)    query = query.where('wpPosts.ID', '=', this.idArgs.postId);
        if (this.idArgs?.postIn)    query = query.where('wpPosts.ID', 'in', this.idArgs.postIn);
        if (this.idArgs?.postNotIn) query = query.where('wpPosts.ID', 'not in', this.idArgs.postNotIn);

        // --- Type Filters ---
        if (this.typeArgs?.postType) {
            const types = Array.isArray(this.typeArgs.postType) ? this.typeArgs.postType : [this.typeArgs.postType];
            query = query.where('wpPosts.postType', 'in', types);
        }
        if (this.typeArgs?.postTypeNot) {
            const types = Array.isArray(this.typeArgs.postTypeNot) ? this.typeArgs.postTypeNot : [this.typeArgs.postTypeNot];
            query = query.where('wpPosts.postType', 'not in', types);
        }

        // --- Status Filters ---
        if (this.statusArgs?.postStatus) {
            const statuses = Array.isArray(this.statusArgs.postStatus) ? this.statusArgs.postStatus : [this.statusArgs.postStatus];
            query = query.where('wpPosts.postStatus', 'in', statuses);
        }

        // --- Content Filters ---
        if (this.contentArgs?.postSlug) {
            const postSlugs = Array.isArray(this.contentArgs.postSlug) ? this.contentArgs.postSlug : [this.contentArgs.postSlug];
            query = query.where('wpPosts.postName', 'in', postSlugs);
        }
        if (this.contentArgs?.title)        query = query.where('wpPosts.postTitle', '=', this.contentArgs.title);
        if (this.contentArgs?.postMimeType) query = query.where('wpPosts.postMimeType', 'like', `%${this.contentArgs.postMimeType}%`);

        // --- Parent Filters ---
        if (this.parentArgs?.postParent !== undefined)  query = query.where('wpPosts.postParent', '=', this.parentArgs.postParent);
        if (this.parentArgs?.postParentIn)              query = query.where('wpPosts.postParent', 'in', this.parentArgs.postParentIn);
        if (this.parentArgs?.postParentNotIn)           query = query.where('wpPosts.postParent', 'not in', this.parentArgs.postParentNotIn);

        // --- Term Filters ---
        if (this.termArgs) {
            if (this.termArgs.termId) {
                query = query.innerJoin('wpTermRelationships', 'wpPosts.ID', 'wpTermRelationships.objectId')
                            .where('wpTermRelationships.termTaxonomyId', '=', this.termArgs.termId);
            }
            if (this.termArgs.termAnd) {
                query = query.innerJoin('wpTermRelationships', 'wpPosts.ID', 'wpTermRelationships.objectId')
                            .where('wpTermRelationships.termTaxonomyId', 'in', this.termArgs.termAnd)
                            .groupBy('wpPosts.ID')
                            .having((eb) => eb.fn.count('wpTermRelationships.termTaxonomyId'), '=', this.termArgs!.termAnd!.length);
            }
            if (this.termArgs.termIn) {
                query = query.innerJoin('wpTermRelationships', 'wpPosts.ID', 'wpTermRelationships.objectId')
                            .where('wpTermRelationships.termTaxonomyId', 'in', this.termArgs.termIn);
            }
            if (this.termArgs.termNotIn) {
                query = query.where('wpPosts.ID', 'not in',
                    (qb) =>
                        qb.selectFrom('wpTermRelationships')
                            .select('wpTermRelationships.objectId')
                            .where('wpTermRelationships.termTaxonomyId', 'in', this.termArgs!.termNotIn!)
                );
            }
            if (this.termArgs.termSlug) {
                query = query.innerJoin('wpTermRelationships', 'wpPosts.ID', 'wpTermRelationships.objectId')
                            .innerJoin('wpTerms', 'wpTermRelationships.termTaxonomyId', 'wpTerms.termId')
                            .where('wpTerms.slug', '=', this.termArgs.termSlug)
                            .groupBy('wpPosts.ID');
            }
            if (this.termArgs.termSlugAnd) {
                query = query.innerJoin('wpTermRelationships', 'wpPosts.ID', 'wpTermRelationships.objectId')
                            .innerJoin('wpTerms', 'wpTermRelationships.termTaxonomyId', 'wpTerms.termId')
                            .where('wpTerms.slug', 'in', this.termArgs.termSlugAnd)
                            .groupBy('wpPosts.ID')
                            .having((eb) => eb.fn.count('wpTermRelationships.termTaxonomyId'), '=', this.termArgs!.termSlugAnd!.length);
            }
            if (this.termArgs.termSlugIn) {
                query = query.innerJoin('wpTermRelationships', 'wpPosts.ID', 'wpTermRelationships.objectId')
                            .innerJoin('wpTerms', 'wpTermRelationships.termTaxonomyId', 'wpTerms.termId')
                            .where('wpTerms.slug', 'in', this.termArgs.termSlugIn)
                            .groupBy('wpPosts.ID');
            }
        }

        // --- Author Filters ---
        if (this.authorArgs?.authorId)      query = query.where('wpPosts.postAuthor', '=', this.authorArgs.authorId);
        if (this.authorArgs?.authorIn)      query = query.where('wpPosts.postAuthor', 'in', this.authorArgs.authorIn);
        if (this.authorArgs?.authorNotIn)   query = query.where('wpPosts.postAuthor', 'not in', this.authorArgs.authorNotIn);
        if (this.authorArgs?.authorName) {
            query = query.innerJoin('wpUsers', 'wpPosts.postAuthor', 'wpUsers.ID')
                        .where('wpUsers.displayName', '=', this.authorArgs.authorName);
        }

        // --- Search Filters ---
        if (this.searchArgs?.search) {
            const searchTerm = this.searchArgs.exact ? this.searchArgs.search : `%${this.searchArgs.search}%`;
            const searchCols = this.searchArgs.searchColumns || ['postTitle', 'postContent', 'postExcerpt'];
            const isExact = this.searchArgs.exact;

            query = query.where((eb) => {
                const orClauses = searchCols.map(col => eb(col, isExact ? '=' : 'like', searchTerm));
                return eb.or(orClauses);
            });
        }

        // --- Date Filters ---
        if (this.dateArgs) {
            if (this.dateArgs.yyyymm) {
                const mStr = String(this.dateArgs.yyyymm);
                const y = Number(mStr.substring(0, 4));
                const mon = Number(mStr.substring(4, 6));
                query = query.where((eb) => eb.fn('YEAR', [eb.ref('wpPosts.postDate')]), '=', y)
                            .where((eb) => eb.fn('MONTH', [eb.ref('wpPosts.postDate')]), '=', mon);
            }
            if (this.dateArgs.year)                 query = query.where((eb) => eb.fn('YEAR', [eb.ref('wpPosts.postDate')]), '=', this.dateArgs.year);
            if (this.dateArgs.monthnum)             query = query.where((eb) => eb.fn('MONTH', [eb.ref('wpPosts.postDate')]), '=', this.dateArgs.monthnum);
            if (this.dateArgs.w)                    query = query.where((eb) => eb.fn('WEEK', [eb.ref('wpPosts.postDate')]), '=', this.dateArgs.w);
            if (this.dateArgs.day)                  query = query.where((eb) => eb.fn('DAY', [eb.ref('wpPosts.postDate')]), '=', this.dateArgs.day);
            if (this.dateArgs.hour !== undefined)   query = query.where((eb) => eb.fn('HOUR', [eb.ref('wpPosts.postDate')]), '=', this.dateArgs.hour);
            if (this.dateArgs.minute !== undefined) query = query.where((eb) => eb.fn('MINUTE', [eb.ref('wpPosts.postDate')]), '=', this.dateArgs.minute);
            if (this.dateArgs.second !== undefined) query = query.where((eb) => eb.fn('SECOND', [eb.ref('wpPosts.postDate')]), '=', this.dateArgs.second);
        }

        // 3. Calculate Total Count (Before Limits/Offsets)
        if (!this.paginationArgs?.noFoundRows) {
            try {
                const countQueryBase = query.clearSelect().select('wpPosts.ID').distinct();
                const countResult = await wpdb.selectFrom(countQueryBase.as('sub'))
                    .select(sql<number>`count(*)`.as('count'))
                    .executeTakeFirst();

                this.postCount = countResult ? Number(countResult.count) : undefined;
            } catch (error: any) {
                console.error('WPPostQuery: Cannot get row count: ', error.message);
                this.postCount = undefined;
            }
        } else {
            this.postCount = undefined;
        }

        // 4. Apply ORDER BY
        if (!this.orderArgs?.ignoreStickyPosts) {
            const rawStickyPostIds = await wpGetOption('sticky_posts');
            const stickyPosts = Object.values(phpSerialize.unserialize(rawStickyPostIds ?? 'a:0:{}') as Record<string, number> | number[]);

            if (stickyPosts.length > 0) {
                query = query.orderBy(
                    sql`CASE WHEN wp_posts.ID IN (${sql.join(stickyPosts)}) THEN 0 ELSE 1 END`,
                    'asc'
                );
            }
        }

        const orderDirection = this.orderArgs?.order === 'ASC' ? 'asc' : 'desc';
        const orderBy = this.orderArgs?.orderby || 'none';

        switch(orderBy) {
            case 'none': break;
            case 'id':              query = query.orderBy('wpPosts.ID', orderDirection); break;
            case 'author':          query = query.orderBy('wpPosts.postAuthor', orderDirection); break;
            case 'title':           query = query.orderBy('wpPosts.postTitle', orderDirection); break;
            case 'name':            query = query.orderBy('wpPosts.postName', orderDirection); break;
            case 'date':            query = query.orderBy('wpPosts.postDate', orderDirection); break;
            case 'modified':        query = query.orderBy('wpPosts.postModified', orderDirection); break;
            case 'parent':          query = query.orderBy('wpPosts.postParent', orderDirection); break;
            case 'menuOrder':       query = query.orderBy('wpPosts.menuOrder', orderDirection); break;
            case 'commentCount':    query = query.orderBy('wpPosts.commentCount', orderDirection); break;
            case 'rand':            query = query.orderBy((eb) => eb.fn('RAND', [])); break;
            default:
                if (orderBy.startsWith('RAND(')) {
                    const seed = parseInt(orderBy.replace(/\D/g, ''), 10);
                    query = query.orderBy((eb) => eb.fn('RAND', [eb.val(seed)]));
                } else {
                    query = query.orderBy('wpPosts.postDate', orderDirection);
                }
                break;
        }

        // 5. Apply LIMIT & OFFSET
        if (!this.paginationArgs?.nopaging) {
            const perPage = this.paginationArgs?.postsPerPage ?? 10;

            if (perPage > -1) {
                query = query.limit(perPage);

                const page = this.paginationArgs?.page ?? 1;
                const baseOffset = this.paginationArgs?.offset ?? 0;
                const offsetAmount = ((page - 1) * perPage) + baseOffset;

                if (offsetAmount > 0) {
                    query = query.offset(offsetAmount);
                }
            }
        }

        // 6. Execute Final Query
        logQuery(query);

        try {
            return await query.selectAll('wpPosts').distinct().execute();
        } catch (error: any) {
            throw new Error(`WPPostQuery: Cannot get posts: ${error.message}`, { cause: error });
        }
    }
}
