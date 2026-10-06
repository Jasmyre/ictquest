import { describe, expect, it } from "vitest";

import {
  getAllowedDevOrigins,
  getLanEntries,
  getLanHost,
  rankLanAddress,
  resolveLanHost,
} from "../../scripts/lan-address.mjs";

function nets(entries: [string, string, boolean][]) {
  return Object.fromEntries(
    entries.map(([name, address, internal]) => [
      name,
      [{ address, family: "IPv4", internal }],
    ])
  ) as never;
}

describe("rankLanAddress", () => {
  it("prefers real Wi-Fi over the WSL virtual adapter", () => {
    expect(rankLanAddress("192.168.1.27", false)).toBeLessThan(
      rankLanAddress("172.25.208.1", true)
    );
  });

  it("deprioritizes WSL-default 172.25.x even with a plain name", () => {
    expect(rankLanAddress("172.25.208.1", false)).toBeGreaterThan(
      rankLanAddress("192.168.1.27", false)
    );
  });
});

describe("getLanEntries", () => {
  it("sorts Wi-Fi first when the OS lists WSL first", () => {
    const result = getLanEntries(
      nets([
        ["vEthernet (WSL (Hyper-V firewall))", "172.25.208.1", false],
        ["Wi-Fi", "192.168.1.27", false],
      ])
    );
    expect(result[0]?.address).toBe("192.168.1.27");
    expect(result.find((e) => e.address === "172.25.208.1")?.virtual).toBe(
      true
    );
  });
});

describe("getLanHost", () => {
  it("returns the Wi-Fi address, not the virtual one", () => {
    expect(
      getLanHost(
        nets([
          ["vEthernet (WSL (Hyper-V firewall))", "172.25.208.1", false],
          ["Wi-Fi", "192.168.1.27", false],
        ])
      )
    ).toBe("192.168.1.27");
  });
});

describe("getAllowedDevOrigins", () => {
  it("includes the Wi-Fi host and loopbacks", () => {
    const origins = getAllowedDevOrigins(
      nets([
        ["vEthernet (WSL (Hyper-V firewall))", "172.25.208.1", false],
        ["Wi-Fi", "192.168.1.27", false],
      ])
    );
    expect(origins).toContain("192.168.1.27");
    expect(origins).toContain("localhost");
  });

  it("always includes the resolved host even when it is virtual-only", () => {
    const origins = getAllowedDevOrigins(
      nets([["vEthernet (WSL)", "172.25.208.1", false]]),
      { lanIpEnv: "172.25.208.1" }
    );
    expect(origins).toContain("172.25.208.1");
  });
});

describe("resolveLanHost", () => {
  const wifi = nets([
    ["vEthernet (WSL (Hyper-V firewall))", "172.25.208.1", false],
    ["Wi-Fi", "192.168.1.27", false],
  ]);

  it("prefers the --ip flag over env and auto-detect", () => {
    expect(
      resolveLanHost({ flag: "192.168.1.99", env: "192.168.1.27", nets: wifi })
        .host
    ).toBe("192.168.1.99");
  });

  it("prefers LAN_IP env over auto-detect", () => {
    const resolved = resolveLanHost({ env: "192.168.1.27", nets: wifi });
    expect(resolved.host).toBe("192.168.1.27");
    expect(resolved.source).toBe("LAN_IP");
  });

  it("falls back to auto-detect and names the interface", () => {
    const resolved = resolveLanHost({ nets: wifi });
    expect(resolved.host).toBe("192.168.1.27");
    expect(resolved.source).toBe("auto-detect");
  });

  it("throws on an invalid --ip flag", () => {
    expect(() => resolveLanHost({ flag: "not-an-ip", nets: wifi })).toThrow(
      /Invalid --ip value/
    );
  });

  it("ignores an invalid LAN_IP env and falls back to auto-detect", () => {
    expect(resolveLanHost({ env: "bogus", nets: wifi }).host).toBe(
      "192.168.1.27"
    );
  });
});
