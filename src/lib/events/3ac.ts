import type { ChronosEvent } from "../types";

/**
 * Three Arrows Capital (3AC) Blowup — June 2022.
 *
 * Started long Grayscale GBTC arb at premium, levered into stETH and Luna.
 * Luna wipe in May erased ~$600M. June 13 stETH depeg + BlockFi/Voyager/Genesis
 * margin calls cascaded; Su Zhu and Kyle Davies stopped responding to lenders.
 * Filed BVI liquidation June 27.
 */
export const threeAcBlowup: ChronosEvent = {
  id: "3ac-blowup",
  name: "Three Arrows Capital Blowup",
  shortName: "3AC",
  category: "fund-blowup",
  startsAt: "2022-06-12T00:00:00Z",
  endsAt: "2022-06-27T23:59:59Z",
  blurb:
    "A $10B crypto hedge fund that became a leverage Ponzi. After Luna evaporated $600M in May, stETH's June depeg triggered margin calls 3AC couldn't meet — and lenders discovered the same collateral had been pledged in multiple places.",
  primaryAsset: "ETH",
  relatedAssets: ["stETH", "BTC", "GBTC"],
  tags: [
    "leverage-unwind",
    "rehypothecation",
    "liquidity-spiral",
    "balance-sheet-leak",
    "stETH-depeg",
    "fund-blowup",
    "margin-call-cascade",
  ],
  heroChart: "/charts/3ac-eth-price.png",
  moments: [
    {
      t: Date.parse("2022-06-13T08:00:00Z"),
      label: "stETH depegs to 0.94",
      anchor:
        "Lido stETH/ETH ratio falls to 0.94 on Curve as Celsius and 3AC offload. The largest holder of stETH on Aave is a 3AC-controlled wallet.",
      severity: 5,
    },
    {
      t: Date.parse("2022-06-14T18:00:00Z"),
      label: "BlockFi margin call",
      anchor:
        "BlockFi liquidates a portion of 3AC's collateral after a missed margin call. The liquidation depresses BTC further and triggers cascading calls at Genesis and Voyager.",
      severity: 5,
    },
    {
      t: Date.parse("2022-06-15T20:00:00Z"),
      label: "Founders go silent",
      anchor:
        "Su Zhu tweets 'we are in the process of communicating with relevant parties' — last public communication for two weeks. Phones to founders go unanswered.",
      severity: 4,
    },
    {
      t: Date.parse("2022-06-17T12:00:00Z"),
      label: "Voyager $670M default",
      anchor:
        "Voyager Digital discloses 3AC failed to repay a $350M USDC + 15,250 BTC loan. The disclosure forces Voyager to halt withdrawals.",
      severity: 5,
    },
    {
      t: Date.parse("2022-06-22T14:00:00Z"),
      label: "BVI liquidation",
      anchor:
        "British Virgin Islands court orders 3AC liquidation. Teneo appointed as liquidator — they later report assets are 'commingled across at least 7 venues'.",
      severity: 5,
    },
    {
      t: Date.parse("2022-06-27T20:00:00Z"),
      label: "Chapter 15 filing",
      anchor:
        "3AC files Chapter 15 in SDNY to prevent US creditors from grabbing assets. Liquidators reveal $3.5B in claims from Genesis alone.",
      severity: 5,
    },
  ],
  prices: [
    { t: Date.parse("2022-06-12T00:00:00Z"), p: 1424 },
    { t: Date.parse("2022-06-13T00:00:00Z"), p: 1206 },
    { t: Date.parse("2022-06-13T18:00:00Z"), p: 1080 },
    { t: Date.parse("2022-06-14T12:00:00Z"), p: 1230 },
    { t: Date.parse("2022-06-15T18:00:00Z"), p: 1090 },
    { t: Date.parse("2022-06-17T00:00:00Z"), p: 1037 },
    { t: Date.parse("2022-06-18T12:00:00Z"), p: 996 },
    { t: Date.parse("2022-06-19T00:00:00Z"), p: 928, v: 8_400_000_000 },
    { t: Date.parse("2022-06-20T12:00:00Z"), p: 1124 },
    { t: Date.parse("2022-06-22T00:00:00Z"), p: 1095 },
    { t: Date.parse("2022-06-25T00:00:00Z"), p: 1216 },
    { t: Date.parse("2022-06-27T18:00:00Z"), p: 1200 },
  ],
  txs: [
    {
      t: Date.parse("2022-06-13T07:30:00Z"),
      hash: "0x9c1d...steth-aave-liq",
      chain: "ethereum",
      from: "3AC Aave position",
      to: "Aave liquidators",
      summary:
        "$200M stETH position partially liquidated on Aave as health factor drops below 1.0. The liquidation widens the stETH-ETH spread further.",
      usd: 200_000_000,
    },
    {
      t: Date.parse("2022-06-14T15:00:00Z"),
      hash: "0xd812...gbtc-pledge",
      chain: "ethereum",
      from: "3AC OTC desk",
      to: "Genesis lending",
      summary:
        "Onchain analysts spot 3AC pledging the same GBTC shares simultaneously to Genesis and BlockFi — first hard evidence of rehypothecation.",
      usd: 350_000_000,
    },
    {
      t: Date.parse("2022-06-16T22:00:00Z"),
      hash: "0xfa44...btc-recovery",
      chain: "bitcoin",
      from: "3AC cold storage",
      to: "Unknown OTC",
      summary:
        "5,000 BTC moves out of a 3AC-attributed cold wallet to an OTC venue — likely a forced sale to meet a Genesis margin call.",
      usd: 105_000_000,
    },
  ],
  social: [
    {
      t: Date.parse("2022-06-15T20:14:00Z"),
      author: "Su Zhu",
      handle: "@zhusu",
      text: "We are in the process of communicating with relevant parties and fully committed to working this out.",
    },
    {
      t: Date.parse("2022-06-17T12:00:00Z"),
      author: "Voyager Digital",
      handle: "@investvoyager",
      text: "Voyager may issue a notice of default to Three Arrows Capital for failure to make required payments on its previously disclosed loan...",
    },
    {
      t: Date.parse("2022-06-21T18:00:00Z"),
      author: "FatMan",
      handle: "@FatManTerra",
      text: "3AC was running a $10B leverage Ponzi. They borrowed unsecured from every CeFi desk in town, told them it was secured, then pledged the same collateral 5x.",
    },
    {
      t: Date.parse("2022-06-22T16:00:00Z"),
      author: "BVI High Court",
      handle: "(court filing)",
      text: "Order to wind up Three Arrows Capital Ltd. Teneo Restructuring appointed as joint liquidators.",
    },
  ],
  sources: [
    {
      label: "Teneo first creditor report",
      url: "https://www.teneo.com/news-insights/three-arrows-capital",
    },
    {
      label: "Voyager 3AC default disclosure",
      url: "https://www.investvoyager.com/blog/notice-from-voyager-on-3ac-loan/",
    },
  ],
};
