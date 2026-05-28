import { WPArchiveQueriedObject } from "@/lib/nextpress/types/common/WPQueriedObject";
import Archive from "./parts/archive/archive";

export async function ArchiveTemplate(postPage: WPArchiveQueriedObject) {
    const mainTerm = postPage.mainTerm?.name ?? postPage.user?.displayName;

    return (
        <Archive title={`Archive for ${mainTerm}`} postPage={postPage}/>
    )
}
