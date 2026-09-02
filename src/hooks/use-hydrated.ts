import { useSyncExternalStore } from "react";

const unsubscribe = () => {
  // nothing to clean up – the value never changes after mount
};
const subscribe = () => unsubscribe;
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * False during SSR and the hydration render, true afterwards. Use it to gate
 * UI that depends on browser-only state (localStorage backed atoms) so the
 * server and the first client render stay identical.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
}
