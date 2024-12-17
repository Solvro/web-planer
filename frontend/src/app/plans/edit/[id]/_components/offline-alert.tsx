import React from "react";

export function OfflineAlert() {
  return (
    <div className="w-full rounded-md border-2 border-blue-500 bg-blue-400/30 px-4 py-2 font-semibold text-blue-600">
      <h1>Jesteś offline!</h1>
      <p className="text-xs text-blue-950">
        Aby zapisać plany online na koncie, zaloguj się.
      </p>
    </div>
  );
}
