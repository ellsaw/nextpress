import { WPUserQueryArgs } from "../../types/core/WPUserQueryArgs";
import wpdb from "../../wpdb/wpdb";
import { WPUser } from "../../types/entities/WPUser";
import { sql } from "kysely";
import logQuery from "../../wpdb/logQuery";
import * as phpSerialize from "php-serialize";

export default class WPUserQuery {
    private userCount?: number;

    constructor(
        private args: WPUserQueryArgs = {}
    ) {}

    public getUserCount(): number {
        if (this.userCount === undefined) {
            throw new Error('WPUserQuery: noFoundRows must be false and getUserCount must be called after getUsers() to get the user count');
        }
        return this.userCount;
    }

    /**
     * Finalizes the query build process, logs the query, and executes it against the database.
     * @throws {Error} If the execution of the query fails.
     * @returns {Promise<WPUser[]>} A promise that resolves to an array of fetched WordPress users.
     */
    public async getUsers(): Promise<WPUser[]> {
        let query = wpdb.selectFrom('wpUsers');

        // --- ID Filters ---
        if (this.args.userId) {
            const types = Array.isArray(this.args.userId) ? this.args.userId : [this.args.userId];
            query = query.where('wpUsers.ID', 'in', this.args.userId);
        }
        if (this.args.userIdsNotIn) query = query.where('wpUsers.ID', 'not in', this.args.userIdsNotIn);

        // --- Nicename Filters ---
        if (this.args.nicename)         query = query.where('wpUsers.userNicename', '=', this.args.nicename);
        if (this.args.nicenameIn)       query = query.where('wpUsers.userNicename', 'in', this.args.nicenameIn);
        if (this.args.nicenameNotIn)    query = query.where('wpUsers.userNicename', 'not in', this.args.nicenameNotIn);

        // --- Display name Filters ---
        if (this.args.displayName)      query = query.where('wpUsers.displayName', '=', this.args.displayName);
        if (this.args.displayNameIn)    query = query.where('wpUsers.displayName', 'in', this.args.displayNameIn);
        if (this.args.displayNameNotIn) query = query.where('wpUsers.displayName', 'not in', this.args.displayNameNotIn);

        // --- Login Filters ---
        if (this.args.login)        query = query.where('wpUsers.userLogin', '=', this.args.login);
        if (this.args.loginIn)      query = query.where('wpUsers.userLogin', 'in', this.args.loginIn);
        if (this.args.loginNotIn)   query = query.where('wpUsers.userLogin', 'not in', this.args.loginNotIn);

        // --- Role Filters ---
        if (this.args.roleIn) {
            query = query
                .innerJoin('wpUsermeta as um_role_in', 'wpUsers.ID', 'um_role_in.userId')
                .where('um_role_in.metaKey', '=', 'wp_capabilities')
                .where((eb) => {
                    const orClauses = this.args.roleIn!.map(role =>
                        eb('um_role_in.metaValue', 'like', `%"${role}"%`)
                    );
                    return eb.or(orClauses);
                });
        }

        if (this.args.roleAnd) {
            this.args.roleAnd.forEach((role, index) => {
                const alias = `um_role_and_${index}` as const;

                query = query
                    .innerJoin(`wpUsermeta as ${alias}`, 'wpUsers.ID', `${alias}.userId`)
                    .where(`${alias}.metaKey`, '=', 'wp_capabilities')
                    .where(`${alias}.metaValue`, 'like', `%"${role}"%`);
            });
        }

        if (this.args.roleNotIn) {
            this.args.roleNotIn.forEach((role, index) => {
                const alias = `um_role_not_${index}` as const;

                query = query
                    .innerJoin(`wpUsermeta as ${alias}`, 'wpUsers.ID', `${alias}.userId`)
                    .where(`${alias}.metaKey`, '=', 'wp_capabilities')
                    .where(`${alias}.metaValue`, 'not like', `%"${role}"%`);
            });
        }

        // --- Search Filters ---
        if (this.args.search) {
            const searchTerm = `%${this.args.search}%`;
            const searchCols = this.args.search_columns || ['ID', 'userLogin', 'userEmail', 'userUrl', 'userNicename', 'displayName'];

            query = query.where((eb) => {
                const orClauses = searchCols.map(col => eb(col, 'like', searchTerm));
                return eb.or(orClauses);
            });
        }

        // --- Published Posts Filter ---
        if (this.args.hasPublishedPosts) {
            query = query.where((eb) => eb(
                eb.selectFrom('wpPosts')
                    .select(eb.fn.count<number>('ID').as('count'))
                    .whereRef('wpPosts.postAuthor', '=', 'wpUsers.ID')
                    .where('wpPosts.postStatus', '=', 'publish'),
                '>', 0
            ));
        }

        // 3. Calculate Total Count (Before Limits/Offsets)
        if (!this.args.noFoundRows) {
            try {
                const countQueryBase = query.clearSelect().select('wpUsers.ID').distinct();
                const countResult = await wpdb.selectFrom(countQueryBase.as('sub'))
                    .select(sql<number>`count(*)`.as('count'))
                    .executeTakeFirst();

                this.userCount = countResult ? Number(countResult.count) : undefined;
            } catch (error: any) {
                console.error('WPUserQuery: Cannot get row count: ', error.message);
                this.userCount = undefined;
            }
        } else {
            this.userCount = undefined;
        }

        // 4. Apply ORDER BY
        const orderDirection = this.args.order === 'DESC' ? 'desc' : 'asc';
        const orderBy = this.args.orderBy || 'none';

        switch(orderBy) {
            case 'ID':         query = query.orderBy('wpUsers.ID', orderDirection); break;
            case 'name':       query = query.orderBy('wpUsers.displayName', orderDirection); break;
            case 'login':      query = query.orderBy('wpUsers.userLogin', orderDirection); break;
            case 'nicename':   query = query.orderBy('wpUsers.userNicename', orderDirection); break;
            case 'email':      query = query.orderBy('wpUsers.userEmail', orderDirection); break;
            case 'registered': query = query.orderBy('wpUsers.userRegistered', orderDirection); break;
            case 'post_count':
                query = query.orderBy(
                    (eb) => eb.selectFrom('wpPosts')
                            .select(eb.fn.count('ID').as('count'))
                            .whereRef('wpPosts.postAuthor', '=', 'wpUsers.ID')
                            .where('wpPosts.postStatus', '=', 'publish'),
                    orderDirection
                );
                break;
            case 'none': break;
            default:
                query = query.orderBy('wpUsers.userLogin', orderDirection);
                break;
        }

        // 5. Apply LIMIT & OFFSET
        if (!this.args.nopaging) {
            const perPage = this.args.number ?? -1;

            if (perPage > -1) {
                query = query.limit(perPage);

                const page = this.args.page ?? 1;
                const baseOffset = this.args.offset ?? 0;
                const offsetAmount = ((page - 1) * perPage) + baseOffset;

                if (offsetAmount > 0) {
                    query = query.offset(offsetAmount);
                }
            }
        }

        logQuery(query);

        try {
            const users = await query
                .leftJoin('wpUsermeta as meta', (join) =>
                    join
                        .onRef('meta.userId', '=', 'wpUsers.ID')
                        .on('meta.metaKey', '=', 'wp_capabilities')
                )
                .selectAll('wpUsers')
                .select('meta.metaValue as rawCapabilities')
                .distinct()
                .execute();

            return users.map(user => {
                const capsObj = user.rawCapabilities
                    ? phpSerialize.unserialize(user.rawCapabilities)
                    : {};

                return {
                    ...user,
                    roles: Object.keys(capsObj)
                };
            });
        } catch (error: any) {
            throw new Error(`WPUserQuery: Cannot get users: ${error.message}`, { cause: error });
        }
    }
}
