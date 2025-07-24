import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";

import { ToPWrSection } from "@/app/(homepage)/_components/topwr-section";

test("Home", () => {
  render(<ToPWrSection />);
  screen.debug();
});

test("pobiera usera", async () => {
  const response = await fetch("https://api.example.com/user");
  const user = (await response.json()) as {
    id: string;
    firstName: string;
    lastName: string;
  };
  expect(user).toEqual({
    id: "abc-123",
    firstName: "John",
    lastName: "Maverick",
  });
});
