import { describe, expect, it } from "vitest";
import { getHeaderNav } from "@/components/site-header";

describe("site header nav visibility by session state", () => {
  it("shows only Home and Lessons for guests", () => {
    const nav = getHeaderNav(false);
    expect(nav.navItems.map((item) => item.name)).toEqual(["Home", "Lessons"]);
    expect(nav.showSearch).toBe(false);
  });

  it("shows the full app nav for signed-in users", () => {
    const nav = getHeaderNav(true);
    expect(nav.navItems.map((item) => item.name)).toEqual([
      "Home",
      "Lessons",
      "Profile",
      "People",
    ]);
    expect(nav.showSearch).toBe(true);
  });

  it("attaches serializable icon names shared by server shell and islands", () => {
    const guest = getHeaderNav(false);
    expect(guest.navItems.map((item) => item.icon)).toEqual([
      "home",
      "lessons",
    ]);
    const authed = getHeaderNav(true);
    expect(authed.navItems.map((item) => item.icon)).toEqual([
      "home",
      "lessons",
      "profile",
      "people",
    ]);
    expect(authed.pageItems.map((item) => item.icon)).toEqual([
      "terms",
      "privacy",
    ]);
  });
});
