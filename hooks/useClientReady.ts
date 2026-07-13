'use client';

import { useLayoutEffect, useState } from 'react';

/** True only after the client has mounted — avoids SSR/client i18n hydration mismatches. */
export function useClientReady(): boolean {
    const [ready, setReady] = useState(false);

    useLayoutEffect(() => {
        setReady(true);
    }, []);

    return ready;
}
