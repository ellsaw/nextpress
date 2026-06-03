import Archive from "./parts/archive/archive";

export async function ArchiveTemplate() {
    const title = (await getTheMainTerm())?.name ?? (await getTheUser())?.displayName ?? '';

    return (
        <Archive title={title}/>
    )
}
