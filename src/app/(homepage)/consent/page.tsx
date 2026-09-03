import { Suspense } from "react";

import { ConsentClient } from "./consent-client";

export default function ConsentPage() {
  return (
    <Suspense fallback={null}>
      <ConsentClient />
    </Suspense>
  );
}
