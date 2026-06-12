import { cache } from 'react';

import './entity-loader/post-loader';
import './entity-loader/term-loader';
import './entity-loader/user-loader';
import './entity-loader/option-loader';

export const queriedObjectState = cache(() => {
    return {
        currentState: null as any,
        loaderStates: {} as Record<string, any>
    };
});

import './queried-object/queried-object';

export {};
