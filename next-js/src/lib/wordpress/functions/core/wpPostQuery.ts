import { Selectable, sql } from "kysely";
import { WpPost } from "../../types/wpdb/wpdb";
import wpdb from "../../wpdb/wpdb";
import wpOptionQuery from "./wpOptionQuery";
import * as phpSerialize from "php-serialize";
import logQuery from "../../wpdb/logQuery";

type WPPostQueryResult<T extends WPPostQueryArgs> = T['noFoundRows'] extends true 
    ? Selectable<WpPost>[]
    : { data: Selectable<WpPost>[]; postCount: number } 

export default async function wpPostQuery<T extends WPPostQueryArgs>(args: T): Promise<WPPostQueryResult<T> | []>
{
    let query = wpdb.selectFrom('wpPosts');
    
    if (args.postId) {
        query = query
            .where('wpPosts.ID', '=', args.postId);
    }

    if (args.postIn) {
        query = query
            .where('wpPosts.ID', 'in', args.postIn);
    } 

    if (args.postNotIn) {
        query = query
            .where('wpPosts.ID', 'not in', args.postNotIn);
    }

    if (args.postName) {
        const postNames = Array.isArray(args.postName) ? args.postName : [args.postName];
        query = query
            .where('wpPosts.postName', 'in', postNames);
    }

    if (args.postType) {
        const types = Array.isArray(args.postType) ? args.postType : [args.postType];
        query = query
            .where('wpPosts.postType', 'in', types);
    } 

    if (args.postTypeNot) {
        const types = Array.isArray(args.postTypeNot) ? args.postTypeNot : [args.postTypeNot];
        query = query
            .where('wpPosts.postType', 'not in', types);
    } 

    if (args.postStatus) {
        const statuses = Array.isArray(args.postStatus) ? args.postStatus : [args.postStatus];
        query = query
            .where('wpPosts.postStatus', 'in', statuses);
    } else {
        query = query
            .where('wpPosts.postStatus', '=', 'publish');
    }
    
    if (args.title) {
        query = query
            .where('wpPosts.postTitle', '=', args.title);
    }

    if (args.postMimeType) {
        query = query
            .where('wpPosts.postMimeType', 'like', `%${args.postMimeType}%`);
    }

    if (args.postParent !== undefined) {
        query = query
            .where('wpPosts.postParent', '=', args.postParent);
    }

    if (args.postParentIn) {
        query = query
            .where('wpPosts.postParent', 'in', args.postParentIn);
    }

    if (args.postParentNotIn) {
        query = query
            .where('wpPosts.postParent', 'not in', args.postParentNotIn);
    }
    
    if (args.termId) {
        query = query
            .innerJoin('wpTermRelationships', 'wpPosts.ID', 'wpTermRelationships.objectId')
            .where('wpTermRelationships.termTaxonomyId', '=', args.termId);
    }
    
    if (args.termAnd) {
        query = query
            .innerJoin('wpTermRelationships', 'wpPosts.ID', 'wpTermRelationships.objectId')
            .where('wpTermRelationships.termTaxonomyId', 'in', args.termAnd)
            .groupBy('wpPosts.ID')
            .having((eb) => eb.fn.count('wpTermRelationships.termTaxonomyId'), '=', args.termAnd.length);
    }
    
    if (args.termIn) {
        query = query
            .innerJoin('wpTermRelationships', 'wpPosts.ID', 'wpTermRelationships.objectId')
            .where('wpTermRelationships.termTaxonomyId', 'in', args.termIn);
    }
    
    if (args.termNotIn) {
        query = query.where(
            'ID',
            'not in',
            (qb) => qb.selectFrom('wpTermRelationships')
                .select('wpTermRelationships.objectId')
                .where('wpTermRelationships.termTaxonomyId', 'in', args.termNotIn!)
        );
    }
    
    if (args.termSlug) {
        query = query
            .innerJoin('wpTermRelationships', 'wpPosts.ID', 'wpTermRelationships.objectId')
            .innerJoin('wpTerms', 'wpTermRelationships.termTaxonomyId', 'wpTerms.termId')
            .where('wpTerms.slug', '=', args.termSlug)
            .groupBy('wpPosts.ID');
    }
    
    if (args.termSlugAnd) {
        query = query
            .innerJoin('wpTermRelationships', 'wpPosts.ID', 'wpTermRelationships.objectId')
            .innerJoin('wpTerms', 'wpTermRelationships.termTaxonomyId', 'wpTerms.termId')
            .where('wpTerms.slug', 'in', args.termSlugAnd)
            .groupBy('wpPosts.ID')
            .having((eb) => eb.fn.count('wpTermRelationships.termTaxonomyId'), '=', args.termSlugAnd.length);
    }
    
    if (args.termSlugIn) {
        query = query
            .innerJoin('wpTermRelationships', 'wpPosts.ID', 'wpTermRelationships.objectId')
            .innerJoin('wpTerms', 'wpTermRelationships.termTaxonomyId', 'wpTerms.termId')
            .where('wpTerms.slug', 'in', args.termSlugIn)
            .groupBy('wpPosts.ID');
    }

    if (args.authorId) {
        query = query
            .where('wpPosts.postAuthor', '=', args.authorId);
    }

    if (args.authorName) {
        query = query
            .innerJoin('wpUsers', 'wpPosts.postAuthor', 'wpUsers.ID') 
            .where('wpUsers.displayName', '=', args.authorName);
    }

    if (args.authorIn) {
        query = query
            .where('wpPosts.postAuthor', 'in', args.authorIn);
    }

    if (args.authorNotIn) {
        query = query
            .where('wpPosts.postAuthor', 'not in', args.authorNotIn);
    }

    // TODO: Support Comments 

    if (args.search) {
        const searchTerm = args.exact ? args.search : `%${args.search}%`;
        const searchCols = args.searchColumns || ['postTitle', 'postContent', 'postExcerpt'];
        
        query = query.where((eb) => {
            const orClauses = searchCols.map(col => eb(col as any, args.exact ? '=' : 'like', searchTerm));
            return eb.or(orClauses);
        });
    }

    if (args.yyyymm) {
        const mStr = String(args.yyyymm);
        const y = Number(mStr.substring(0, 4));
        const mon = Number(mStr.substring(4, 6));
        query = query
            .where((eb) => eb.fn('YEAR', [eb.ref('wpPosts.postDate')]), '=', y)
            .where((eb) => eb.fn('MONTH', [eb.ref('wpPosts.postDate')]), '=', mon);
    }

    if (args.year) {
        query = query
            .where((eb) => eb.fn('YEAR', [eb.ref('wpPosts.postDate')]), '=', args.year);
    }

    if (args.monthnum) {
        query = query
            .where((eb) => eb.fn('MONTH', [eb.ref('wpPosts.postDate')]), '=', args.monthnum);
    }        

    if (args.w) {
        query = query
            .where((eb) => eb.fn('WEEK', [eb.ref('wpPosts.postDate')]), '=', args.w);
    }

    if (args.day) {
        query = query
            .where((eb) => eb.fn('DAY', [eb.ref('wpPosts.postDate')]), '=', args.day);
    }

    if (args.hour !== undefined) {
        query = query
            .where((eb) => eb.fn('HOUR', [eb.ref('wpPosts.postDate')]), '=', args.hour);
    }

    if (args.minute !== undefined) {
        query = query
            .where((eb) => eb.fn('MINUTE', [eb.ref('wpPosts.postDate')]), '=', args.minute);
    }

    if (args.second !== undefined) {
        query = query
            .where((eb) => eb.fn('SECOND', [eb.ref('wpPosts.postDate')]), '=', args.second);
    }

    // TODO: MetaQueries 

    if (!args.ignoreStickyPosts) {
        const rawStickyPostIds = await wpOptionQuery('sticky_posts');
        const stickyPosts = Object.values(phpSerialize.unserialize(rawStickyPostIds ?? 'a:0:{}') as Record<string, number> | number[]);

        if (stickyPosts.length > 0) {
            query = query.orderBy(
                sql`CASE WHEN ID IN (${sql.join(stickyPosts)}) THEN 0 ELSE 1 END`, 
                'asc'
            );
        }
    }

    const orderDirection = args.order === 'ASC' ? 'asc' : 'desc';
    
    if (args.orderby) {
        const orderBy = args.orderby;
        switch(orderBy) {
            case 'none': break;
            case 'id': query = query.orderBy('wpPosts.ID', orderDirection); break;
            case 'author': query = query.orderBy('wpPosts.postAuthor', orderDirection); break;
            case 'title': query = query.orderBy('wpPosts.postTitle', orderDirection); break;
            case 'name': query = query.orderBy('wpPosts.postName', orderDirection); break;
            case 'date': query = query.orderBy('wpPosts.postDate', orderDirection); break;
            case 'modified': query = query.orderBy('wpPosts.postModified', orderDirection); break;
            case 'parent': query = query.orderBy('wpPosts.postParent', orderDirection); break;
            case 'rand': query = query.orderBy((eb) => eb.fn('RAND', [])); break;
            case 'commentCount': query = query.orderBy('wpPosts.commentCount', orderDirection); break;
            case 'menuOrder': query = query.orderBy('wpPosts.menuOrder', orderDirection); break;
            default: 
                if (orderBy.startsWith('RAND(')) {
                    const seed = parseInt(orderBy.replace(/\D/g, ''), 10);
                    query = query.orderBy((eb) => eb.fn('RAND', [eb.val(seed)]));
                } else {
                    query = query.orderBy('wpPosts.postDate', orderDirection);
                }
                break;
        }
    } else if (!args.ignoreOrder){
        query = query.orderBy('wpPosts.postDate', orderDirection);
    }

    const rowCount = !args.noFoundRows && await (async() => {
        try {
            return await wpdb.selectFrom(query.as('sub'))
                .select(sql<number>`count(*)`.as('count'))
                .executeTakeFirst();
        } catch (error: any) {
            console.error('wpGetPost: Cannot get row count: ', error.message); 
            return undefined;
        }
    })();
    
    if (!args.nopaging) {
        const perPage = args.postsPerPage ?? Number(await wpOptionQuery('posts_per_page')) ?? 10;
        
        if (perPage > -1) {
            query = query.limit(perPage);

            const page = args.page ?? 1;
            const baseOffset = args.offset ?? 0;
            
            const offsetAmount = ((page - 1) * perPage) + baseOffset;

            if (offsetAmount > 0) {
                query = query.offset(offsetAmount);
            }
        }
    }

    const posts = await (async() => {
        try {
            return await query.selectAll('wpPosts').execute();
        } catch (error: any) {
            console.error('wpGetPost: Cannot get posts: ', error.message); 
            return [];
        }
    })();

    logQuery(query);

    if (rowCount) {
        return {
            data: posts,
            postCount: rowCount.count
        } as WPPostQueryResult<T>;
    } else {
        return posts as WPPostQueryResult<T>;
    }
}