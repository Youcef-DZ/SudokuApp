import { useState, useEffect } from "react";

export function createStore<T>(initialState: T) {
    let state: T = initialState;
    const listeners = new Set<(state: T) => void>();

    function getState() {
        return state;
    }

    function setState(newState: T | ((prev: T) => T)) {
        state = typeof newState === "function" ? (newState as (prev: T) => T)(state) : newState;
        listeners.forEach((listener) => listener(state));
    }

    function subscribe(listener: (state: T) => void) {
        listeners.add(listener);
        return () => listeners.delete(listener);
    }

    // React hook to use the store
    function useStore() {
        const [localState, setLocalState] = useState<T>(getState());

        useEffect(() => {
            const unsubscribe = subscribe((newState) => {
                setLocalState(newState);
            });
            return () => {
                unsubscribe();
            };
        }, []);

        return [localState, setState] as const;
    }

    return useStore;
}
