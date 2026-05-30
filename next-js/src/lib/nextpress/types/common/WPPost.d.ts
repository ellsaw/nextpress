import { WPPostBase } from "../core/entities/WPPostBase"

type WPPost = WPPostBase & {path?: string, thumbnailId?: string}

type WPSinglePost = WPPost & {thumbnail?: WPAttachmentImage};

type WPPostPage = {
    posts: WPSinglePost[],
    page?: number,
    availablePages?: number
}
