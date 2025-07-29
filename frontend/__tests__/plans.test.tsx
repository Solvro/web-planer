import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Toaster } from "sonner";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { PlanItem } from "@/components/plan-item";
import { TooltipProvider } from "@/components/ui/tooltip";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/plans",
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  auth: vi.fn(),
  fetchToAdonis: vi.fn(),
}));

const { auth, fetchToAdonis } = await import("@/lib/auth");
vi.mocked(auth).mockResolvedValue(null);
vi.mocked(fetchToAdonis).mockResolvedValue(null);

const renderWithQueryClient = (component: React.ReactElement) => {
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
      <TooltipProvider>
        {component}
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>,
  );
};

describe("Plans page errors", () => {
  const mockPlan = {
    id: "123",
    name: "Nowy plan",
    sharedId: null,
    courses: [],
    registrations: [],
    createdAt: "2025-07-25T18:22:13.348Z",
    updatedAt: "2025-07-25T18:22:13.348Z",
    onlineId: null,
    toCreate: false,
    synced: false,
  };
  beforeEach(() => {
    localStorage.setItem("plansIds-v2", JSON.stringify([{ id: "123" }]));
    localStorage.setItem("123", JSON.stringify(mockPlan));
  });

  afterEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });
  it("Should display server error when logged in user fails to delete plan", async () => {
    renderWithQueryClient(
      <PlanItem
        key={mockPlan.id}
        id={mockPlan.id.toString()}
        name={mockPlan.name}
        synced={true}
        onlineId={mockPlan.id.toString()}
        onlineOnly={true}
        groupCount={0}
        registrationCount={mockPlan.registrations.length}
        updatedAt={new Date(mockPlan.updatedAt)}
      />,
    );

    const user = userEvent.setup();
    const btns = screen.getAllByRole("button");
    await user.click(btns[0]);
    const deleteButton = screen.getByText("Usuń");
    await user.click(deleteButton);
    const deleteButton2 = screen.getByText("Usuń");
    await user.click(deleteButton2);

    expect(
      await screen.findByText("Nie udało się usunąć planu"),
    ).toBeInTheDocument();
  });
});
