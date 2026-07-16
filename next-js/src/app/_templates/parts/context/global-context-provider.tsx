'use client'

import { ProgressProvider } from "@bprogress/next/app";
import { createContext } from "react";

export const GlobalContext = createContext<{}>({});

export function GlobalContextProvider({ children }: { children: Readonly<React.ReactElement> }) {
    return (
        <GlobalContext value={{}}>
            <ProgressProvider
                color="#000000"
                shallowRouting={true}
                options={{ showSpinner: false }}
            >
                {children}
            </ProgressProvider>
        </GlobalContext>
    );
}
