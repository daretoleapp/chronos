import type { ChronosEvent } from "../types";

/**
 * Ronin Bridge Hack — March 23, 2022 (disclosed March 29).
 *
 * Lazarus Group exploited a 5-of-9 multisig signer compromise on the Ronin
 * bridge (Axie Infinity sidechain). 173,600 ETH + 25.5M USDC drained in
 * two transactions. Largest DeFi hack at the time at $625M. Spent six
 * days undetected because Sky Mavis didn't actively monitor bridge
 * outflows — discovered when a user couldn't withdraw 5K ETH.
 */
export const roninBridge: ChronosEvent = {
  id: "ronin-bridge-hack",
  name: "Ronin Bridge Hack",
  shortName: "Ronin",
  category: "bridge-hack",
  startsAt: "2022-03-23T00:00:00Z",
  endsAt: "2022-03-30T23:59:59Z",
  blurb:
    "Lazarus Group quietly drained $625M from the Axie Infinity bridge by compromising 5 of 9 validator keys. The exploit went undetected for six days — discovered only when a user complained their withdrawal was stuck.",
  primaryAsset: "ETH",
  relatedAssets: ["AXS", "USDC"],
  tags: [
    "bridge-hack",
    "validator-compromise",
    "social-engineering",
    "north-korea-lazarus",
    "delayed-detection",
    "multisig-failure",
    "tornado-cash",
  ],
  heroChart: "/charts/ronin-axs-price.png",
  moments: [
    {
      t: Date.parse("2022-03-23T13:00:00Z"),
      label: "First drain tx",
      anchor:
        "Attacker submits two withdraw transactions on Ronin bridge — 173,600 ETH and 25.5M USDC. 5 validator signatures present, 4 from compromised Sky Mavis nodes plus 1 from the Axie DAO (still rotating an old key).",
      severity: 5,
    },
    {
      t: Date.parse("2022-03-23T13:45:00Z"),
      label: "Second drain tx",
      anchor:
        "Second batch of withdrawals through the same multisig path. Total drained: $625M at the day's prices.",
      severity: 5,
    },
    {
      t: Date.parse("2022-03-24T00:00:00Z"),
      label: "Six days of silence",
      anchor:
        "Sky Mavis monitoring fails to flag the outflow. The bridge keeps operating; AXS price unchanged. Stolen ETH remains parked in the attacker's wallet.",
      severity: 3,
    },
    {
      t: Date.parse("2022-03-29T08:30:00Z"),
      label: "User reports stuck withdrawal",
      anchor:
        "A user opens a Discord ticket reporting their 5K ETH withdrawal failed. Engineering investigates and discovers the bridge is empty.",
      severity: 5,
    },
    {
      t: Date.parse("2022-03-29T15:00:00Z"),
      label: "Sky Mavis discloses",
      anchor:
        "Sky Mavis publishes the post-mortem. Bridge halted. AXS drops 13% in the next hour.",
      severity: 5,
    },
    {
      t: Date.parse("2022-04-04T12:00:00Z"),
      label: "Tornado Cash laundering",
      anchor:
        "ZachXBT tracks the first batch of stolen ETH entering Tornado Cash — 6,250 ETH per round. By month-end, 80% of stolen funds laundered.",
      severity: 4,
    },
  ],
  prices: [
    { t: Date.parse("2022-03-22T00:00:00Z"), p: 65.4 },
    { t: Date.parse("2022-03-23T12:00:00Z"), p: 66.1 },
    { t: Date.parse("2022-03-25T00:00:00Z"), p: 67.3 },
    { t: Date.parse("2022-03-27T00:00:00Z"), p: 65.8 },
    { t: Date.parse("2022-03-29T08:00:00Z"), p: 64.9 },
    { t: Date.parse("2022-03-29T16:00:00Z"), p: 56.3, v: 410_000_000 },
    { t: Date.parse("2022-03-29T22:00:00Z"), p: 52.1 },
    { t: Date.parse("2022-03-30T12:00:00Z"), p: 49.4 },
  ],
  txs: [
    {
      t: Date.parse("2022-03-23T13:01:23Z"),
      hash: "0xc28fc...ronin-drain-1",
      chain: "ethereum",
      from: "Ronin bridge",
      to: "0x098B716...attacker EOA",
      summary:
        "First drain: 173,600 ETH transferred from the Ronin bridge to the attacker's freshly funded wallet. 5-of-9 multisig signed.",
      usd: 540_000_000,
      url: "https://etherscan.io/tx/0xc28fc6c0aae5fc8bf67d9d33bafbc0dbfc4de8d6e8cf8a8ae2eba8ecbb1e93b5",
    },
    {
      t: Date.parse("2022-03-23T13:42:11Z"),
      hash: "0xed2a6...ronin-drain-2",
      chain: "ethereum",
      from: "Ronin bridge",
      to: "0x098B716...attacker EOA",
      summary:
        "Second drain: 25.5M USDC withdrawn through the same multisig path.",
      usd: 25_500_000,
    },
    {
      t: Date.parse("2022-04-04T11:00:00Z"),
      hash: "tornado-mix-batch-1",
      chain: "ethereum",
      from: "0x098B716",
      to: "Tornado Cash 100ETH pool",
      summary:
        "Lazarus begins laundering — 6,250 ETH deposited into Tornado Cash 100ETH anonymity sets across 62 transactions.",
      usd: 22_000_000,
    },
  ],
  social: [
    {
      t: Date.parse("2022-03-29T15:14:00Z"),
      author: "Sky Mavis",
      handle: "@SkyMavisHQ",
      text: "Ronin Network Validators were compromised, resulting in 173,600 ETH and 25.5M USDC drained from the Ronin bridge in two transactions. The attack occurred on March 23rd.",
    },
    {
      t: Date.parse("2022-03-29T16:00:00Z"),
      author: "ZachXBT",
      handle: "@zachxbt",
      text: "Confirming the Ronin attacker has begun moving funds. Watching 0x098B716 — first hop to a fresh address, expecting Tornado Cash next.",
    },
    {
      t: Date.parse("2022-04-14T19:00:00Z"),
      author: "FBI",
      handle: "(press release)",
      text: "The FBI attributes the Ronin Validator Security Breach and theft of approximately $620 million in cryptocurrency to North Korean state-sponsored cyber actors (Lazarus Group / APT38).",
    },
  ],
  sources: [
    {
      label: "Sky Mavis post-mortem",
      url: "https://roninblockchain.substack.com/p/community-alert-ronin-validators",
    },
    {
      label: "FBI attribution to Lazarus",
      url: "https://www.fbi.gov/news/press-releases/fbi-statement-on-attribution-of-malicious-cyber-activity-posed-by-the-democratic-peoples-republic-of-korea",
    },
  ],
};
