import { useState, useEffect } from "react";

export function createStore(initialState = {}) {
    let state = initialState;
    const listeners = new Set();

    function getState() {
        return state;
    }

    function setState(newState) {
        state = typeof newState === "function" ? newState(state) : newState;
        listeners.forEach((listener) => listener(state));
    }

    function subscribe(listener) {
        listeners.add(listener);
        return () => listeners.delete(listener);
    }

    // React hook to use the store
    function useStore() {
        const [localState, setLocalState] = useState(getState());

        useEffect(() => {
            const unsubscribe = subscribe((newState) => {
                setLocalState(newState);
            });
            return () => {
                unsubscribe();
            };
        }, []);

        return [localState, setState];
    }

    return useStore;
}
