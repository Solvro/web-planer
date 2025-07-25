import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Toaster } from "sonner";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { CreateNewPlanPage } from "@/app/plans/edit/[id]/page.client";
import { SidebarProvider } from "@/components/ui/sidebar";

import { departmentHandler } from "../mocks/handlers";
import { server } from "../mocks/server";

const mockUseSession = vi.fn(() => ({
  user: null,
}));

vi.mock("@/hooks/use-session", () => ({
  useSession: () => mockUseSession(),
}));

vi.mock("@/hooks/use-share", () => ({
  useShare: () => ({
    isDialogOpen: false,
    openDialog: vi.fn(),
    closeDialog: vi.fn(),
    setIsDialogOpen: vi.fn(),
  }),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

vi.mock("next/headers", () => ({
  cookies: () => ({
    get: (key: string) =>
      key === "XSRF-TOKEN" ? { value: "mock-csrf-token" } : undefined,
  }),
}));

const renderWithQueryClientSideBarProvider = (
  component: React.ReactElement,
) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        {component}
        <Toaster />
      </SidebarProvider>
    </QueryClientProvider>,
  );
};

describe("Create plan page errors", () => {
  beforeEach(() => {
    localStorage.setItem(
      "plansIds-v2",
      JSON.stringify([{ id: "a5e9b042-9151-4719-9f1d-8ff6fb216900" }]),
    );
    localStorage.setItem(
      "a5e9b042-9151-4719-9f1d-8ff6fb216900-plan-v2",
      JSON.stringify({
        id: "a5e9b042-9151-4719-9f1d-8ff6fb216900",
        name: "Nowy plan",
        sharedId: null,
        courses: [],
        registrations: [],
        createdAt: "2025-07-25T18:22:13.348Z",
        updatedAt: "2025-07-25T18:22:13.348Z",
        onlineId: null,
        toCreate: false,
        synced: false,
      }),
    );
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("Should display error for faculties without backend", async () => {
    const user = userEvent.setup();

    renderWithQueryClientSideBarProvider(
      <CreateNewPlanPage planId="a5e9b042-9151-4719-9f1d-8ff6fb216900" />,
    );

    const dropdownButton = screen.getByRole("combobox");
    expect(dropdownButton).toBeInTheDocument();

    await user.click(dropdownButton);
    expect(
      screen.getByText(/wystąpił błąd podczas ładowania wydziałów/i),
    ).toBeInTheDocument();
  });

  it("Should display error toast after selecting faculty but failing to load registrations", async () => {
    server.use(departmentHandler);

    const user = userEvent.setup();
    renderWithQueryClientSideBarProvider(
      <CreateNewPlanPage planId="a5e9b042-9151-4719-9f1d-8ff6fb216900" />,
    );

    const dropdownButton = screen.getByRole("combobox");
    await user.click(dropdownButton);
    const faculty = await screen.findByText("W1");

    await user.click(faculty);

    expect(dropdownButton).toHaveTextContent("W1");

    expect(
      await screen.findByText(
        /coś poszło nie tak podczas pobierania rejestracji, spróbuj ponownie/i,
      ),
    ).toBeInTheDocument();
  });
});
