import { Metadata } from 'next';
import nextpressStaticParams from '@/lib/nextpress/router/nextpress-static-params';
import NextPressPage, { generateNextpressMetadata, NextpressRouterProps } from '@/lib/nextpress/router/router';

export async function generateStaticParams() {
    return await nextpressStaticParams();
}

export async function generateMetadata(props: NextpressRouterProps): Promise<Metadata> {
    return await generateNextpressMetadata(props);
}

export default async function Page({ params }: NextpressRouterProps) {
    return <NextPressPage params={params}/>
}
