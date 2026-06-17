import { cache } from 'react';

import './entity-loader/post-loader';
import './entity-loader/term-loader';
import './entity-loader/user-loader';
import './entity-loader/option-loader';
import './get-field/get-field';
import './nextpress-config/nextpress-config'

/**
 * Initializes and returns request-scoped storage for the application state.
 * Uses React cache to prevent state bleeding across requests.
 *
 * @returns {{ currentState: any, loaderStates: Record<string, any> }} Object containing current queried object state and loader states.
 */
export const queriedObjectState = cache(() => {
    return {
        currentState: null as any,
        loaderStates: {} as Record<string, any>
    };
});

import './queried-object/queried-object';

export {};
