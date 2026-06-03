import nextpressConfig from '../../../../config.nextpress';
import { SiteFrontPage } from './_routes/site-front-page';
import { TermArchive } from './_routes/term-archive';
import { AuthorArchive } from './_routes/author-archive';
import { SingularPage } from './_routes/singular-page';
import { Metadata } from 'next';

const { publicTaxonomies, publicPostTypes, archivedPostTypes } = nextpressConfig;

type Props = {
    params: Promise<{
        path: string[] | undefined;
    }>;
}

function splitPath(path: string): string[] {
    if (!path) return [];
    return path.split('/').filter(Boolean);
}

export async function generateStaticParams() {
    const { ids: authorIds } = await userLoader.findAndPrime({
        hasPublishedPosts: true,
        noFoundRows: false,
        noPaging: false,
    });
    const authors = await getUsers(authorIds);
    const authorPaths = authors.map((author) => ['author', author.userLogin]);

    const { ids: termIds } = await termLoader.findAndPrime({});
    const terms = await getTerms(termIds);
    const termPaths = terms.map(term => [term.taxonomy, ...splitPath(term.path)]);

    const { ids: archivedPostIds } = await postLoader.findAndPrime({
        postStatus: 'publish',
        postType: archivedPostTypes?.filter(p => !publicPostTypes?.includes(p)) ?? 'post',
        ignoreStickyPosts: true,
        noFoundRows: true,
        noPaging: true,
    });
    const { ids: postIds } = await postLoader.findAndPrime({
        postStatus: 'publish',
        postType: archivedPostTypes ?? 'post',
        ignoreStickyPosts: true,
        noFoundRows: true,
        noPaging: true,
    });

    const archivedPosts = await getPosts(archivedPostIds);
    const posts = await getPosts(postIds);

    const archivedPostsPaths = archivedPosts.map(post => splitPath(post.path));

    const archivedPostArchivePaths = (archivedPostTypes ?? []).map(type => [type]);

    const postPaths = posts.map(post => splitPath(post.path));

    const allPaths = [
        ...authorPaths,
        ...termPaths,
        ...archivedPostsPaths,
        ...archivedPostArchivePaths,
        ...postPaths
    ];

    return allPaths.map(segments => ({
        path: segments.filter(Boolean)
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const path = (await params).path ?? [];

    if (!path.length) {
        return await SiteFrontPage({path, metadata: true});
    }
    if (publicTaxonomies?.includes(path[0]!)) {
        return await TermArchive({path, metadata: true});
    }
    if (path[0] === 'author') {
        return await AuthorArchive({path, metadata: true});
    } else {
        return await SingularPage({path, metadata: true});
    }
}

export default async function Page({ params }: Props) {
    const path = (await params).path ?? [];

    if (!path.length) {
        return <SiteFrontPage path={path}/>
    }
    if (publicTaxonomies?.includes(path[0]!)) {
        return <TermArchive path={path}/>
    }
    if (path[0] === 'author') {
        return <AuthorArchive path={path}/>
    } else {
        return <SingularPage path={path}/>
    }
}
