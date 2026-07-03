import { Metadata } from 'next';
import { nextpressStaticParams } from 'nextpress/router/nextpress-static-params';
import { NextpressRouterProps, generateNextpressMetadata, NextPressPage } from 'nextpress/router/router';

export async function generateStaticParams() {
    return await nextpressStaticParams();
}

export async function generateMetadata(props: NextpressRouterProps): Promise<Metadata> {
    return await generateNextpressMetadata(props);
}

export default async function Page({ params }: NextpressRouterProps) {
    return <NextPressPage params={params}/>
}
