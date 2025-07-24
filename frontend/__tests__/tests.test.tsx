import { render, screen } from "@testing-library/react";
import { test } from "vitest";

import { ToPWrSection } from "@/app/(homepage)/_components/topwr-section";

test("Home", () => {
  render(<ToPWrSection />);
  screen.debug();
});
