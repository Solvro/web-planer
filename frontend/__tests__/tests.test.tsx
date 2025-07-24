import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test } from "vitest";

import { ToPWrSection } from "@/app/(homepage)/_components/topwr-section";

test("Home", async () => {
  render(<ToPWrSection />);
  const heading = screen.getByText(/Jesteś studentem/i);
  const user = userEvent.setup();
  await user.click(heading);
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
