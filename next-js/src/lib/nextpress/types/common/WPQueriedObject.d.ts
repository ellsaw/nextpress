import { WPTerm } from "../core/entities/WPTerm"
import { WPUser } from "../core/entities/WPUser"
import { WPPost, WPPostPage, WPSinglePost } from "./WPPost"

type WPQueriedObject = WPPostPage

type WPAuthorQueriedObject = WPQueriedObject & {
    user: WPUser,
}

type WPTermQueriedObject = WPQueriedObject & {
    mainTerm: WPTerm
    terms: WPTerm[]
}

type WPArchiveQueriedObject = WPQueriedObject &
    Partial<WPAuthorQueriedObject> &
    Partial<WPTermQueriedObject>;

type WPSingularQueriedObject = {
    post: WPPost;
}

type WPSingleQueriedObject = {
    post: WPSinglePost
}
