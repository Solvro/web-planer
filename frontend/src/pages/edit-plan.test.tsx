import { QueryClient } from "@tanstack/react-query";
import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { UserEvent } from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { CreateNewPlanPage } from "@/app/plans/edit/[id]/page.client";
import {
  mockCourses,
  mockFaculties,
  mockRegistrations,
} from "@/tests/mocks/mock-data";
import { generateMockUser } from "@/tests/mocks/user";
import { Providers } from "@/tests/setup-providers";

const selectRegistration = async (user: UserEvent) => {
  const registrationTrigger = await screen.findByTestId("registration-select");
  await user.click(registrationTrigger);

  const regOption = await screen.findByText(
    new RegExp(mockRegistrations[0].name, "i"),
  );
  await act(async () => {
    await user.click(regOption);
  });
};

const selectFaculty = async (user: UserEvent) => {
  const facultyTrigger = await screen.findByTestId("faculty-select");
  await user.click(facultyTrigger);

  const option = await screen.findByText(
    new RegExp(mockFaculties[1].name, "i"),
  );
  await act(async () => {
    await user.click(option);
  });
};

describe("Edit Plan", () => {
  const setup = () => {
    const user = userEvent.setup();
    render(
      <Providers user={generateMockUser()} queryClient={new QueryClient()}>
        <CreateNewPlanPage planId="testplan1" />
      </Providers>,
    );
    return user;
  };

  it("should create a new plan", () => {
    setup();
    const name = screen.getByRole("textbox", { name: "Nazwa" });
    expect(name).toHaveValue("Nowy plan");
  });

  it("should allow user to select faculty", async () => {
    const user = setup();

    const label = screen.getByText("Wydział");
    expect(label.tagName).toBe("LABEL");

    await selectFaculty(user);

    const fac1 = screen.queryByText(new RegExp(mockFaculties[0].name, "i"));
    const fac2 = screen.queryByText(new RegExp(mockFaculties[1].name, "i"));
    expect(fac1).toBeNull();
    expect(fac2).toBeVisible();
  });

  it("should allow user to select registration", async () => {
    const user = setup();

    await selectFaculty(user);

    await waitFor(() => {
      const label = screen.getByText("Rejestracja");
      expect(label.tagName).toBe("LABEL");
    });

    await selectRegistration(user);

    const regs1 = screen.getAllByText(
      new RegExp(mockRegistrations[0].name, "i"),
    );
    const regs2 = screen.getAllByText(
      new RegExp(mockRegistrations[1].name, "i"),
    );
    const span1 = regs1.find(
      (element) => element.tagName.toLowerCase() === "span",
    );
    const span2 = regs2.find(
      (element) => element.tagName.toLowerCase() === "span",
    );
    expect(span1).toBeVisible();
    expect(span2).toBeUndefined();
  });

  it("should display all groups for a course", async () => {
    const user = setup();
    await selectFaculty(user);
    await selectRegistration(user);

    const courseLabels = await screen.findAllByText(mockCourses[0].name);
    const courseButtons = courseLabels.map((element) =>
      element.closest("button"),
    );
    const groupLabels = courseButtons.map((button) => {
      if (button == null) {
        return "";
      }
      const groupText = within(button).getByText(/Grupa \d+/i);
      return groupText.textContent;
    });
    const uniqueGroups = new Set(groupLabels);
    expect(courseButtons).toHaveLength(mockCourses[0].groups.length);
    expect(uniqueGroups.size).toBe(mockCourses[0].groups.length);
  });

  it("should disable other groups if one group selected", async () => {
    const user = setup();
    await selectFaculty(user);
    await selectRegistration(user);

    const courseLabels = await screen.findAllByText(mockCourses[0].name);
    const courseButtons = courseLabels.map((element) =>
      element.closest("button"),
    );

    await waitFor(async () => {
      if (courseButtons[0] == null) {
        throw new Error("First course button not found");
      }
      await user.click(courseButtons[0]);
    });
    expect(courseButtons[1]).toBeDisabled();
  });
});
