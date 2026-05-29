import { JSX } from 'react';

type ComponentSet = {
    layout: NextpressLayout
    component: () => Promise<JSX.Element>
}
