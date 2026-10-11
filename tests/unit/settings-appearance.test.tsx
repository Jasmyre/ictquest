// @vitest-environment jsdom
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/auth", () => ({ auth: vi.fn(async () => null) }));
vi.mock("@/lib/db", () => ({ db: {} }));
vi.mock("@/lib/redis", () => ({ redis: {} }));
vi.mock("@/env", () => ({ env: { NODE_ENV: "test" } }));

const mutateAsync = vi.fn(async () => ({
  success: true as const,
  data: {
    id: "learner-a",
    name: "Learner A",
    userName: "learner-a",
    biography: null,
    isPrivate: false,
  },
}));

vi.mock("@/trpc/react", () => ({
  api: {
    useUtils: () => ({ user: { getProfile: { invalidate: vi.fn() } } }),
    user: {
      updateProfile: {
        useMutation: () => ({ mutateAsync, isPending: false }),
      },
    },
  },
}));

import { SettingsTabs } from "@/components/settings/settings-tabs";
import { ThemeProvider } from "@/components/theme-provider";

const initial = {
  id: "learner-a",
  name: "Learner A",
  userName: "learner-a",
  biography: null as string | null,
  isPrivate: false,
};

function renderAppearance() {
  return render(
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SettingsTabs profile={initial} />
    </ThemeProvider>
  );
}

function stubMatchMedia() {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

afterEach(() => {
  window.localStorage.clear();
  document.documentElement.className = "";
});

describe("Settings appearance (#83)", () => {
  it("offers light/dark/system and applies the choice immediately", async () => {
    stubMatchMedia();
    const user = userEvent.setup();
    renderAppearance();

    await user.click(screen.getByRole("tab", { name: "Appearance" }));

    const group = screen.getByRole("radiogroup", { name: /theme/i });
    expect(group).toBeInTheDocument();
    for (const name of ["Light", "Dark", "System"]) {
      expect(
        screen.getByRole("radio", { name: new RegExp(name, "i") })
      ).toBeInTheDocument();
    }

    await user.click(screen.getByRole("radio", { name: /dark/i }));
    await waitFor(() => {
      expect(document.documentElement.classList.contains("dark")).toBe(true);
    });
    expect(window.localStorage.getItem("theme")).toBe("dark");
  });

  it("persists the choice locally across reloads on the same device", async () => {
    stubMatchMedia();
    const user = userEvent.setup();
    const { unmount } = renderAppearance();

    await user.click(screen.getByRole("tab", { name: "Appearance" }));
    await user.click(screen.getByRole("radio", { name: /light/i }));
    await waitFor(() => {
      expect(window.localStorage.getItem("theme")).toBe("light");
    });
    unmount();

    // Same device = same localStorage: a fresh mount reads the stored theme.
    renderAppearance();
    await user.click(screen.getByRole("tab", { name: "Appearance" }));
    await waitFor(() => {
      expect(screen.getByRole("radio", { name: /light/i })).toHaveAttribute(
        "data-state",
        "checked"
      );
    });
  });

  it("never hits the server when switching theme", async () => {
    stubMatchMedia();
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const user = userEvent.setup();
    renderAppearance();

    await user.click(screen.getByRole("tab", { name: "Appearance" }));
    // Leave the default first so the switch back to system is a real change.
    await user.click(screen.getByRole("radio", { name: /dark/i }));
    await waitFor(() => {
      expect(window.localStorage.getItem("theme")).toBe("dark");
    });
    await user.click(screen.getByRole("radio", { name: /system/i }));
    await waitFor(() => {
      expect(window.localStorage.getItem("theme")).toBe("system");
    });
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(mutateAsync).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
  });
});
