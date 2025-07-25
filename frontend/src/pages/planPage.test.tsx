import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";

import { PlansPage } from "@/app/plans/page.client";
import { Providers } from "@/tests/Providers";
import {
  mockGroups1,
  mockGroups2,
  mockGroups3,
  mockPlans,
} from "@/tests/mocks/mock-data";
import { push } from "@/tests/mocks/utils";

describe("Plans Page", () => {
  const setup = () => {
    const user = userEvent.setup();
    render(
      <Providers>
        <PlansPage plans={mockPlans} />
      </Providers>,
    );
    return user;
  };

  it("should display plans existing online", () => {
    setup();
    expect(screen.getByText(mockPlans[0].name)).toBeInTheDocument();
    expect(
      screen.getByText(
        new RegExp(`${mockPlans[0].registrations.length} kurs(y)?`, "i"),
      ),
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(
        `${mockGroups1.length + mockGroups2.length + mockGroups3.length} wybranych grup`,
      ),
    );
  });

  it("should navigate when pressing the create plan button", async () => {
    const user = setup();
    const createButton = screen.getByTestId("create-button");
    await user.click(createButton);
    expect(push).toHaveBeenCalledWith(expect.stringContaining("plans/edit/"));
  });
});
