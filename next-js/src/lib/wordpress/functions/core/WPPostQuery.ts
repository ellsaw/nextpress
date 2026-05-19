import { Selectable, SelectQueryBuilder, sql } from "kysely";
import { DB, WpPost } from "../../types/wpdb/wpdb";
import * as phpSerialize from "php-serialize";
import wpdb from "../../wpdb/wpdb";
import wpGetOption from "../wpGetOption";
import logQuery from "../../wpdb/logQuery";

/**
 * A query builder class for fetching WordPress posts from the database using Kysely.
 * Inspired by the native WordPress WP_Query class, it allows chaining various
 * filter methods to construct a complex SQL query for `wpPosts`.
 */
export default class WPPostQuery
{
    private query: SelectQueryBuilder<DB, 'wpPosts', any>; 
    
    private orderArgs?: WPPostQueryOrderArgs;
    private paginationArgs?: WPPostQueryPaginationArgs;

    private postCount?: number;

    constructor(){
        this.query = wpdb.selectFrom('wpPosts'); 
    }

    /**
     * Filters the query by specific Post IDs.
     * * @param {WPPostQueryIdArgs} args - Arguments to filter by exact ID, inclusion, or exclusion.
     * @returns {this} The current WPPostQuery instance for chaining.
     */
    public setPostId(args: WPPostQueryIdArgs): this {
        if (args.postId) {
            this.query = this.query
                .where('wpPosts.ID', '=', args.postId);
        }
        if (args.postIn) {
            this.query = this.query
                .where('wpPosts.ID', 'in', args.postIn);
        } 
        if (args.postNotIn) {
            this.query = this.query
                .where('wpPosts.ID', 'not in', args.postNotIn);
        }

        return this;
    }

    /**
     * Filters the query by Post Type (e.g., 'post', 'page', 'custom_post_type').
     * * @param {WPPostQueryTypeArgs} args - Arguments to include or exclude specific post types.
     * @returns {this} The current WPPostQuery instance for chaining.
     */
    public setPostType(args: WPPostQueryTypeArgs): this {
        if (args.postType) {
            const types = Array.isArray(args.postType) ? args.postType : [args.postType];
            this.query = this.query
                .where('wpPosts.postType', 'in', types);
        } 
        if (args.postTypeNot) {
            const types = Array.isArray(args.postTypeNot) ? args.postTypeNot : [args.postTypeNot];
            this.query = this.query
                .where('wpPosts.postType', 'not in', types);
        }  
        
        return this;
    }

    /**
     * Filters the query by Post Status (e.g., 'publish', 'draft', 'trash').
     * * @param {WPPostQueryStatusArgs} args - Arguments to filter by post status.
     * @returns {this} The current WPPostQuery instance for chaining.
     */
    public setPostStatus(args: WPPostQueryStatusArgs): this {
        if (args.postStatus) {
            const statuses = Array.isArray(args.postStatus) ? args.postStatus : [args.postStatus];
            this.query = this.query
                .where('wpPosts.postStatus', 'in', statuses);
        }

        return this;
    }

    /**
     * Filters the query based on post content fields such as slug, title, and mime type.
     * * @param {WPPostQueryContentArgs} args - Arguments to filter by content-related columns.
     * @returns {this} The current WPPostQuery instance for chaining.
     */
    public setPostContent(args: WPPostQueryContentArgs): this {
        if (args.postSlug) {
            const postSlugs = Array.isArray(args.postSlug) ? args.postSlug : [args.postSlug];
            this.query = this.query
                .where('wpPosts.postName', 'in', postSlugs);
        }
        if (args.title) {
            this.query = this.query
                .where('wpPosts.postTitle', '=', args.title);
        }
        if (args.postMimeType) {
            this.query = this.query
                .where('wpPosts.postMimeType', 'like', `%${args.postMimeType}%`);
        }

        return this;
    }

    /**
     * Filters the query based on parent post relationships.
     * * @param {WPPostQueryParentArgs} args - Arguments to filter by exact parent, included parents, or excluded parents.
     * @returns {this} The current WPPostQuery instance for chaining.
     */
    public setPostParents(args: WPPostQueryParentArgs): this {
        if (args.postParent !== undefined) {
            this.query = this.query
                .where('wpPosts.postParent', '=', args.postParent);
        }
        if (args.postParentIn) {
            this.query = this.query
                .where('wpPosts.postParent', 'in', args.postParentIn);
        }
        if (args.postParentNotIn) {
            this.query = this.query
                .where('wpPosts.postParent', 'not in', args.postParentNotIn);
        }

        return this;
    }

    /**
     * Filters the query by taxonomy relationships (categories, tags, custom taxonomies).
     * * @param {WPPostQueryTaxonomyArgs} args - Arguments to filter by term IDs or slugs.
     * @returns {this} The current WPPostQuery instance for chaining.
     */
    public setTaxonomies(args: WPPostQueryTaxonomyArgs): this {
        if (args.termId) {
            this.query = this.query
                .innerJoin('wpTermRelationships', 'wpPosts.ID', 'wpTermRelationships.objectId')
                .where('wpTermRelationships.termTaxonomyId', '=', args.termId);
        }
        if (args.termAnd) {
            this.query = this.query
                .innerJoin('wpTermRelationships', 'wpPosts.ID', 'wpTermRelationships.objectId')
                .where('wpTermRelationships.termTaxonomyId', 'in', args.termAnd)
                .groupBy('wpPosts.ID')
                .having((eb) => eb.fn.count('wpTermRelationships.termTaxonomyId'), '=', args.termAnd.length);
        }
        if (args.termIn) {
            this.query = this.query
                .innerJoin('wpTermRelationships', 'wpPosts.ID', 'wpTermRelationships.objectId')
                .where('wpTermRelationships.termTaxonomyId', 'in', args.termIn);
        }
        if (args.termNotIn) {
            this.query = this.query.where(
                'ID',
                'not in',
                (qb) => qb.selectFrom('wpTermRelationships')
                    .select('wpTermRelationships.objectId')
                    .where('wpTermRelationships.termTaxonomyId', 'in', args.termNotIn!)
            );
        }
        if (args.termSlug) {
            this.query = this.query
                .innerJoin('wpTermRelationships', 'wpPosts.ID', 'wpTermRelationships.objectId')
                .innerJoin('wpTerms', 'wpTermRelationships.termTaxonomyId', 'wpTerms.termId')
                .where('wpTerms.slug', '=', args.termSlug)
                .groupBy('wpPosts.ID');
        }
        if (args.termSlugAnd) {
            this.query = this.query
                .innerJoin('wpTermRelationships', 'wpPosts.ID', 'wpTermRelationships.objectId')
                .innerJoin('wpTerms', 'wpTermRelationships.termTaxonomyId', 'wpTerms.termId')
                .where('wpTerms.slug', 'in', args.termSlugAnd)
                .groupBy('wpPosts.ID')
                .having((eb) => eb.fn.count('wpTermRelationships.termTaxonomyId'), '=', args.termSlugAnd.length);
        }
        if (args.termSlugIn) {
            this.query = this.query
                .innerJoin('wpTermRelationships', 'wpPosts.ID', 'wpTermRelationships.objectId')
                .innerJoin('wpTerms', 'wpTermRelationships.termTaxonomyId', 'wpTerms.termId')
                .where('wpTerms.slug', 'in', args.termSlugIn)
                .groupBy('wpPosts.ID');
        }

        return this;
    }

    /**
     * Filters the query by post author(s).
     * * @param {WPPostQueryAuthorArgs} args - Arguments to filter by author ID or display name.
     * @returns {this} The current WPPostQuery instance for chaining.
     */
    public setAuthor(args: WPPostQueryAuthorArgs): this {
        if (args.authorId) {
            this.query = this.query
                .where('wpPosts.postAuthor', '=', args.authorId);
        }
        if (args.authorName) {
            this.query = this.query
                .innerJoin('wpUsers', 'wpPosts.postAuthor', 'wpUsers.ID') 
                .where('wpUsers.displayName', '=', args.authorName);
        }
        if (args.authorIn) {
            this.query = this.query
                .where('wpPosts.postAuthor', 'in', args.authorIn);
        }
        if (args.authorNotIn) {
            this.query = this.query
                .where('wpPosts.postAuthor', 'not in', args.authorNotIn);
        }

        return this;
    }

    /**
     * Adds a search filter to the query. Looks through title, content, or excerpt by default.
     * * @param {WPPostQuerySearchArgs} args - Arguments to perform a text search.
     * @returns {this} The current WPPostQuery instance for chaining.
     */
    public setSearch(args: WPPostQuerySearchArgs): this {
        if (args.search) {
            const searchTerm = args.exact ? args.search : `%${args.search}%`;
            const searchCols = args.searchColumns || ['postTitle', 'postContent', 'postExcerpt'];
            
            this.query = this.query.where((eb) => {
                const orClauses = searchCols.map(col => eb(col as any, args.exact ? '=' : 'like', searchTerm));
                return eb.or(orClauses);
            });
        }

        return this;
    }

    /**
     * Filters the query based on date and time constraints.
     * * @param {WPPostQueryDateArgs} args - Arguments targeting specific date components (year, month, day, etc.).
     * @returns {this} The current WPPostQuery instance for chaining.
     */
    public setDate(args: WPPostQueryDateArgs): this {
        if (args.yyyymm) {
            const mStr = String(args.yyyymm);
            const y = Number(mStr.substring(0, 4));
            const mon = Number(mStr.substring(4, 6));
            this.query = this.query
                .where((eb) => eb.fn('YEAR', [eb.ref('wpPosts.postDate')]), '=', y)
                .where((eb) => eb.fn('MONTH', [eb.ref('wpPosts.postDate')]), '=', mon);
        }
        if (args.year) {
            this.query = this.query
                .where((eb) => eb.fn('YEAR', [eb.ref('wpPosts.postDate')]), '=', args.year);
        }
        if (args.monthnum) {
            this.query = this.query
                .where((eb) => eb.fn('MONTH', [eb.ref('wpPosts.postDate')]), '=', args.monthnum);
        }        
        if (args.w) {
            this.query = this.query
                .where((eb) => eb.fn('WEEK', [eb.ref('wpPosts.postDate')]), '=', args.w);
        }
        if (args.day) {
            this.query = this.query
                .where((eb) => eb.fn('DAY', [eb.ref('wpPosts.postDate')]), '=', args.day);
        }
        if (args.hour !== undefined) {
            this.query = this.query
                .where((eb) => eb.fn('HOUR', [eb.ref('wpPosts.postDate')]), '=', args.hour);
        }
        if (args.minute !== undefined) {
            this.query = this.query
                .where((eb) => eb.fn('MINUTE', [eb.ref('wpPosts.postDate')]), '=', args.minute);
        }
        if (args.second !== undefined) {
            this.query = this.query
                .where((eb) => eb.fn('SECOND', [eb.ref('wpPosts.postDate')]), '=', args.second);
        }

        return this;
    }

    /**
     * Sets the order configuration to be applied right query execution.
     * * @param {WPPostQueryOrderArgs} args - Arguments dictating order by column and direction.
     * @returns {this} The current WPPostQuery instance for chaining.
     */
    public setOrder(args: WPPostQueryOrderArgs): this {
        this.orderArgs = args;
        return this;
    }

    private async _setOrder(): Promise<void> {
        if (!this.orderArgs?.ignoreStickyPosts) {
            const rawStickyPostIds = await wpGetOption('sticky_posts');
            const stickyPosts = Object.values(phpSerialize.unserialize(rawStickyPostIds ?? 'a:0:{}') as Record<string, number> | number[]);

            if (stickyPosts.length > 0) {
                this.query = this.query.orderBy(
                    sql`CASE WHEN ID IN (${sql.join(stickyPosts)}) THEN 0 ELSE 1 END`, 
                    'asc'
                );
            }
        }

        const orderDirection = this.orderArgs?.order === 'ASC' ? 'asc' : 'desc';
        
        if (this.orderArgs?.orderby) {
            const orderBy = this.orderArgs?.orderby;
            switch(orderBy) {
                case 'none': break;
                case 'id': this.query = this.query.orderBy('wpPosts.ID', orderDirection); break;
                case 'author': this.query = this.query.orderBy('wpPosts.postAuthor', orderDirection); break;
                case 'title': this.query = this.query.orderBy('wpPosts.postTitle', orderDirection); break;
                case 'name': this.query = this.query.orderBy('wpPosts.postName', orderDirection); break;
                case 'date': this.query = this.query.orderBy('wpPosts.postDate', orderDirection); break;
                case 'modified': this.query = this.query.orderBy('wpPosts.postModified', orderDirection); break;
                case 'parent': this.query = this.query.orderBy('wpPosts.postParent', orderDirection); break;
                case 'rand': this.query = this.query.orderBy((eb) => eb.fn('RAND', [])); break;
                case 'commentCount': this.query = this.query.orderBy('wpPosts.commentCount', orderDirection); break;
                case 'menuOrder': this.query = this.query.orderBy('wpPosts.menuOrder', orderDirection); break;
                default: 
                    if (orderBy.startsWith('RAND(')) {
                        const seed = parseInt(orderBy.replace(/\D/g, ''), 10);
                        this.query = this.query.orderBy((eb) => eb.fn('RAND', [eb.val(seed)]));
                    } else {
                        this.query = this.query.orderBy('wpPosts.postDate', orderDirection);
                    }
                    break;
            }
        } else if (!this.orderArgs?.ignoreOrder){
            this.query = this.query.orderBy('wpPosts.postDate', orderDirection);
        }
    }

    /**
     * Sets the pagination configuration to be applied before query execution.
     * * @param {WPPostQueryPaginationArgs} args - Arguments regarding page number, offset, and items per page.
     * @returns {this} The current WPPostQuery instance for chaining.
     */
    public setPagination(args: WPPostQueryPaginationArgs): this {
        this.paginationArgs = args;
        return this;
    }

    private async _setPagination(): Promise<void> {
        const postCount = !this.paginationArgs?.noFoundRows && await (async() => {
            try {
                return await wpdb.selectFrom(this.query.as('sub'))
                    .select(sql<number>`count(*)`.as('count'))
                    .executeTakeFirst();
            } catch (error: any) {
                console.error('WPGetPost: Cannot get row count: ', error.message); 
                return undefined;
            }
        })();

        this.postCount = postCount ? postCount.count : undefined;
        
        if (!this.paginationArgs?.nopaging) {
            const perPage = this.paginationArgs?.postsPerPage ?? 10;
            
            if (perPage > -1) {
                this.query = this.query.limit(perPage);

                const page = this.paginationArgs?.page ?? 1;
                const baseOffset = this.paginationArgs?.offset ?? 0;
                
                const offsetAmount = ((page - 1) * perPage) + baseOffset;

                if (offsetAmount > 0) {
                    this.query = this.query.offset(offsetAmount);
                }
            }
        }
    }

    /**
     * Retrieves the total count of posts that matched the query ignoring LIMIT and OFFSET.
     * `getPosts()` must be called before accessing this, and `noFoundRows` must be false or undefined.
     * * @returns {number | undefined} The total number of posts found, or undefined if not queried.
     */
    public getPostCount(): number | undefined {
        if (this.postCount === undefined) {
            console.error('WPPostQuery: noFoundRows must be false and getPostCount must be called after getPosts() to get the post count');
        }

        return this.postCount
    }

    /**
     * Finalizes the query build process, logs the query, and executes it against the database.
     * * @throws {Error} If the execution of the query fails.
     * @returns {Promise<Selectable<WpPost>[]>} A promise that resolves to an array of fetched WordPress posts.
     */
    public async getPosts(): Promise<Selectable<WpPost>[]> {
        await this._setOrder();
        await this._setPagination();

        logQuery(this.query);
        
        return await (async() => {
            try {
                return await this.query.selectAll('wpPosts').execute();
            } catch (error: any) {
                throw new Error(`WPGetPost: Cannot get posts: ${error.message}`);
            }
        })();
    }
}
