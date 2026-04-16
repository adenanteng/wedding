import { useEffect, useRef } from 'react';

/**
 * Hook to handle closing a drawer/modal when the browser back button is pressed.
 * It pushes a temporary state to the history when the drawer opens,
 * and listens for the popstate event to trigger the onClose callback.
 * 
 * @param isOpen - Current open state of the drawer
 * @param onClose - Callback to close the drawer
 */
export function useBackToClose(isOpen: boolean, onClose: () => void) {
    const onCloseRef = useRef(onClose);
    
    // Update the ref each render so it's always fresh
    useEffect(() => {
        onCloseRef.current = onClose;
    });

    useEffect(() => {
        if (!isOpen) return;

        // Push state only when it opens
        window.history.pushState({ drawerOpen: true }, '');

        const handlePopState = (event: PopStateEvent) => {
            // When back button is pressed, the state we pushed is popped.
            // We call the onClose callback via ref to avoid re-triggering the effect.
            onCloseRef.current();
        };

        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
            // If the drawer is being closed from code (not popstate),
            // and we still have our pushed state at the top of history,
            // we should remove it to keep history clean.
            if (window.history.state?.drawerOpen) {
                window.history.back();
            }
        };
    }, [isOpen]); // Only depend on isOpen
}
