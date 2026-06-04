import Archive from "./parts/archive/archive";

export async function ArchiveTemplate() {
    const title = (await getTheTerm())?.name ?? (await getTheUser())?.displayName ?? '';

    return (
        <Archive title={title}/>
    )
}
