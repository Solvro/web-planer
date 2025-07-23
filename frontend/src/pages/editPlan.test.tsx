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
import { newPlan } from "@/tests/mocks/plans";
import { server } from "@/tests/mocks/server";
import { push } from "@/tests/mocks/utils";

describe("Edit Plan", () => {
  const setup = async () => {
    const user = userEvent.setup();
    await act(async () => {
      render(
        <Providers>
          <CreateNewPlanPage planId="testplan1" />
        </Providers>,
      );
    });
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

    const facultyTrigger = screen.getByRole("combobox");
    await act(async () => {
      await user.click(facultyTrigger);
    });
    const option = await within(document.body).findByRole("option", {
      name: /faculty 1/i,
    });
    await act(async () => {
      await user.click(option);
    });

    const fac1 = screen.queryByText(/faculty 1/i);
    const fac2 = screen.queryByText(/faculty 2/i);
    expect(fac1).toBeVisible();
    expect(fac2).not.toBeVisible();
  });

  it("should allow user to select registration", async () => {
    const user = await setup();
    const facultyTrigger = screen.getByRole("combobox");
    await act(async () => {
      await user.click(facultyTrigger);
    });
    const option = await screen.findByText(/faculty 1/i);
    await user.click(option);

    await waitFor(() => {
      const label = screen.getByText("Rejestracja");
      expect(label.tagName).toBe("LABEL");
    });
  });
});
