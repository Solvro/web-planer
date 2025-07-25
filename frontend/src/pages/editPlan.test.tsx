import {
  act,
  prettyDOM,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { CreateNewPlanPage } from "@/app/plans/edit/[id]/page.client";
import { Providers } from "@/tests/Providers";
import { respond_with_404 } from "@/tests/mocks/handlers";
import {
  mockFaculties,
  mockRegistrations,
  newPlan,
} from "@/tests/mocks/mock-data";
import { server } from "@/tests/mocks/server";
import { push } from "@/tests/mocks/utils";

describe("Edit Plan", () => {
  const setup = async () => {
    const user = userEvent.setup();
    render(
      <Providers>
        <CreateNewPlanPage planId="testplan1" />
      </Providers>,
    );
    return user;
  };

  it("should create a new plan", async () => {
    await setup();
    const name = screen.getByRole("textbox", { name: "Nazwa" });
    expect(name).toHaveValue("Nowy plan");
  });

  it("should allow user to select faculty", async () => {
    const user = await setup();

    const label = screen.getByText("Wydział");
    expect(label.tagName).toBe("LABEL");

    const facultyTrigger = screen.getByTestId("faculty-select");
    await user.click(facultyTrigger);

    const option = await screen.findByText(
      new RegExp(mockFaculties[1].name, "i"),
    );
    await user.click(option);

    const fac1 = screen.queryByText(new RegExp(mockFaculties[0].name, "i"));
    const fac2 = screen.queryByText(new RegExp(mockFaculties[1].name, "i"));
    expect(fac1).toBeNull();
    expect(fac2).toBeVisible();
  });

  it("should allow user to select registration", async () => {
    const user = await setup();
    const facultyTrigger = screen.getByTestId("faculty-select");
    await user.click(facultyTrigger);

    const option = await screen.findByText(
      new RegExp(mockFaculties[1].name, "i"),
    );
    await user.click(option);

    await waitFor(() => {
      const label = screen.getByText("Rejestracja");
      expect(label.tagName).toBe("LABEL");
    });

    const registrationTrigger = screen.getByTestId("registration-select");
    await user.click(registrationTrigger);

    const regOption = await screen.findByText(
      new RegExp(mockRegistrations[0].name, "i"),
    );

    await user.click(regOption);

    const reg1 = screen.queryByText(new RegExp(mockRegistrations[0].name, "i"));
    const reg2 = screen.queryByText(new RegExp(mockRegistrations[1].name, "i"));
    expect(reg1).toBeVisible();
    expect(reg2).toBeNull();

    // screen.debug();
  });
});
