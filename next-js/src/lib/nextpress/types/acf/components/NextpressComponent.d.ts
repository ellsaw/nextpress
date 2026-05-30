import { JSX } from 'react';

type NextpressComponent = {
    layout: NextpressLayout
    Component: () => Promise<JSX.Element>
}
