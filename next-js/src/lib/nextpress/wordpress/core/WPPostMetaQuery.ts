import { WPPostMeta } from "../../types/core/entities/WPPostMeta";
import { WPPostMetaQueryArgs } from "../../types/core/queryargs/WPPostMetaQueryArgs";
import wpdb from "../../wpdb/wpdb";

export default class WPPostMetaQuery
{
    constructor(
        private args: WPPostMetaQueryArgs
    ) {};

    public async getPostMeta(): Promise<WPPostMeta[]> {
        let query = wpdb.selectFrom('wpPostmeta');

        for (const arg of this.args) {
            if (arg.metaId) {
                const metaIds = Array.isArray(arg.metaId) ? arg.metaId : [arg.metaId];
                query = query.where('wpPostmeta.metaId', 'in', metaIds);
            }

            if (arg.postId) {
                const postIds = Array.isArray(arg.postId) ? arg.postId : [arg.postId];
                query = query.where('wpPostmeta.postId', 'in', postIds);
            }

            if (arg.metaKey) {
                query = query.where('wpPostmeta.metaKey', arg.metaKey.operand, arg.metaKey.variable)
            }

            if (arg.metaValue) {
                query = query.where('wpPostmeta.metaValue', arg.metaValue.operand, arg.metaValue.variable)
            }
        }

        try {
            return await query.select(['metaId', 'postId', 'metaKey', 'metaValue']).execute();
        } catch (error: any) {
            throw new Error(`WPPostMetaQuery: Cannot get postmeta: ${error.message}`, { cause: error });
        }
    }
}
