import { NextpressFont } from '@nextpress/router/types';
import { Noto_Sans } from 'next/font/google';

const noto = Noto_Sans({
    variable: '--font-noto'
});

const fonts: NextpressFont[] = [
    noto
];

export default fonts;

