import * as React from "react";

function getSnapshot(query: string) {
  return matchMedia(query).matches;
}

function getServerSnapshot() {
  return false;
}

export const useMediaQuery = (query: string) => {
  const subscribe = React.useCallback(
    (callback: () => void) => {
      const result = matchMedia(query);
      result.addEventListener("change", callback);
      return () => {
        result.removeEventListener("change", callback);
      };
    },
    [query],
  );

  return React.useSyncExternalStore(
    subscribe,
    () => getSnapshot(query),
    getServerSnapshot,
  );
};
