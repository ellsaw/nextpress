import WPPostMetaQuery from "../core/WPPostMetaQuery";

export default async function wpGetPostPaths(postIds: number[]): Promise<Map<number, string>> {
    const query = new WPPostMetaQuery([{
        postId: postIds,
        metaKey: {
            operand: '=',
            variable: '_nextpress_path'
        }
    }])

    const postMeta = await query.getPostMeta();
    return postMeta.reduce((map, pm) =>
        map.set(pm.postId, pm.metaValue)
    , new Map());
}
