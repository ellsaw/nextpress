import { IPost } from "../../entities/post/post";
import { ITerm } from "../../entities/term/term";
import { IUser } from "../../entities/user/user";
import { queriedObjectState } from "../globals";

interface IQueriedObject {
    posts: number[],
    page: number,
    pageCount: number,
    mainTerm?: number,
    terms: number[],
    user?: number,
}

const createBlankState = (): IQueriedObject => ({
    posts: [],
    page: 1,
    pageCount: 1,
    terms: [],
});

declare global {
    var queriedObject: IQueriedObject
    var resetQueriedObject: () => void
    var getThePost: () => Promise<IPost | undefined>
    var getThePosts: () => Promise<IPost[]>
    var getThePage: () => number
    var getThePageCount: () => number
    var getTheTerm: () => Promise<ITerm | undefined>
    var getTheTerms: () => Promise<ITerm[]>
    var getTheUser: () => Promise<IUser | undefined>
}

Object.defineProperty(globalThis, 'queriedObject', {
    configurable: true,
    enumerable: true,
    get() {
        const state = queriedObjectState();
        return state.currentState || createBlankState();
    },
    set(newData: IQueriedObject) {
        const store = queriedObjectState();

        if (newData.posts) postLoader.prime(newData.posts);
        if (newData.mainTerm) termLoader.prime([newData.mainTerm]);
        if (newData.terms) termLoader.prime(newData.terms);
        if (newData.user) userLoader.prime([newData.user]);

        if (!store.currentState) store.currentState = {};
        Object.assign(store.currentState, newData);
    }
});

globalThis.getThePost = async () => {
    return (await postLoader.get(globalThis.queriedObject.posts))[0];
};
globalThis.getThePosts = () => {
    return postLoader.get(globalThis.queriedObject.posts);
};

globalThis.getThePage = () => globalThis.queriedObject.page;

globalThis.getThePageCount = () => globalThis.queriedObject.pageCount;

globalThis.getTheTerm = async () => {
    if (!globalThis.queriedObject.mainTerm) return;
    return (await termLoader.get([globalThis.queriedObject.mainTerm]))[0];
};

globalThis.getTheTerms = () => {
    return termLoader.get(globalThis.queriedObject.terms);
};

globalThis.getTheUser = async () => {
    if (!globalThis.queriedObject.user) return;
    return (await userLoader.get([globalThis.queriedObject.user]))[0];
};

export {};
