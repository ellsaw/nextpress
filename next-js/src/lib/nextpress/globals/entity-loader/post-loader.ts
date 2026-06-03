import { IPost } from "../../entities/post/post";
import Post from "../../entities/post/post-impl";
import PostQuery from "../../repository/postquery/post-query";
import { EntityLoader } from "./entity-loader";
import EntityLoaderBase from "./entity-loader-base";

class PostLoader extends EntityLoaderBase<IPost, PostQueryArgs> {
    private static _instance: PostLoader;

    protected queryClass = PostQuery;

    private constructor() {
        super();
    }

    public static instance(): PostLoader {
        if (!this._instance) {
            this._instance = new PostLoader();
        }
        return this._instance;
    }

    protected async fetchFromDatabase(ids: number[]): Promise<IPost[]> {
        return await Post.get(ids);
    }

    protected getEntityId(post: IPost): number {
        return post.ID;
    }
}

declare global {
    var postLoader: EntityLoader<IPost, PostQueryArgs>
    var getPosts: (ids: number[]) => Promise<IPost[]>
    var getPost: (id: number) => Promise<IPost | undefined>
}

globalThis.postLoader = PostLoader.instance();
globalThis.getPosts = async (ids) => {
    return await postLoader.get(ids);
}
globalThis.getPost = async (id) => {
    return (await postLoader.get([id]))[0];
}

export {};
