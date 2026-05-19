import type { ChronosEvent } from "../types";

/**
 * FTX Collapse — November 2-11, 2022.
 *
 * Trigger: CoinDesk leak of Alameda's balance sheet (Nov 2) revealing
 * $14.6B in assets, of which $5.8B was in FTT — a token printed by FTX
 * itself. Binance announced FTT liquidation on Nov 6, triggering a bank
 * run that exposed the missing $8B in customer deposits.
 *
 * Onchain anchor: massive FTT outflows from Alameda → FTX hot wallet,
 * USDT/USDC withdrawals draining FTX hot wallets, and the eventual
 * unauthorized $477M outflow on Nov 11 (post-bankruptcy hack).
 */
export const ftxCollapse: ChronosEvent = {
  id: "ftx-collapse",
  name: "FTX Collapse",
  shortName: "FTX",
  category: "exchange-collapse",
  startsAt: "2022-11-02T00:00:00Z",
  endsAt: "2022-11-11T23:59:59Z",
  blurb:
    "Nine days that ended a $32B exchange. CoinDesk's leak of Alameda's balance sheet exposed the FTT-collateral loop, Binance pulled the trigger, and customer withdrawals drained FTX hot wallets in real time.",
  primaryAsset: "FTT",
  relatedAssets: ["BTC", "SOL", "ETH"],
  tags: [
    "bank-run",
    "self-issued-collateral",
    "exchange-insolvency",
    "liquidity-spiral",
    "leverage-unwind",
    "centralized-custody",
    "balance-sheet-leak",
  ],
  heroChart: "/charts/ftx-ftt-price.png",
  moments: [
    {
      t: Date.parse("2022-11-02T13:30:00Z"),
      label: "CoinDesk leak drops",
      anchor:
        "Ian Allison publishes Alameda's balance sheet showing $14.6B assets, with $5.8B in FTT and $3.4B in 'crypto held'. The market sees the collateral is self-printed.",
      severity: 5,
    },
    {
      t: Date.parse("2022-11-06T15:47:00Z"),
      label: "CZ tweets FTT liquidation",
      anchor:
        "Binance CEO announces it will liquidate its remaining FTT holdings 'due to recent revelations'. FTT immediately sheds 8% before any selling lands.",
      severity: 5,
    },
    {
      t: Date.parse("2022-11-07T15:00:00Z"),
      label: "Caroline tweets $22 floor",
      anchor:
        "Alameda CEO Caroline Ellison offers to buy CZ's FTT 'over the counter' at $22 — confirming Alameda has the liquidity to defend the price. Market reads it as a dead-cat trap.",
      severity: 4,
    },
    {
      t: Date.parse("2022-11-08T11:00:00Z"),
      label: "FTX withdrawal queue clogs",
      anchor:
        "Onchain monitors observe FTX hot wallet outflows accelerating; users report ETH/USDC withdrawals taking hours instead of minutes.",
      severity: 4,
    },
    {
      t: Date.parse("2022-11-08T17:30:00Z"),
      label: "Binance LOI",
      anchor:
        "Binance signs a non-binding letter of intent to acquire FTX International. SBF tweets 'a huge thank you to CZ'. FTT bounces from $4.30 to $7.",
      severity: 3,
    },
    {
      t: Date.parse("2022-11-09T22:00:00Z"),
      label: "Binance walks",
      anchor:
        "Binance pulls out citing 'mishandled customer funds and alleged US agency investigations'. The exit liquidity vanishes and there is now no buyer of last resort.",
      severity: 5,
    },
    {
      t: Date.parse("2022-11-11T14:30:00Z"),
      label: "Chapter 11",
      anchor:
        "FTX, Alameda, and 130 affiliated entities file for Chapter 11. SBF resigns. John Ray III takes over as CEO.",
      severity: 5,
    },
    {
      t: Date.parse("2022-11-11T22:00:00Z"),
      label: "$477M drain",
      anchor:
        "An unauthorized actor begins draining FTX hot wallets — $477M moved within an hour, the largest tranche routed through Tornado Cash and bridged to BTC.",
      severity: 5,
    },
  ],
  prices: [
    { t: Date.parse("2022-11-01T00:00:00Z"), p: 25.6 },
    { t: Date.parse("2022-11-02T12:00:00Z"), p: 25.4 },
    { t: Date.parse("2022-11-02T18:00:00Z"), p: 23.9 },
    { t: Date.parse("2022-11-03T12:00:00Z"), p: 23.1 },
    { t: Date.parse("2022-11-04T12:00:00Z"), p: 22.7 },
    { t: Date.parse("2022-11-05T12:00:00Z"), p: 22.5 },
    { t: Date.parse("2022-11-06T15:00:00Z"), p: 22.1 },
    { t: Date.parse("2022-11-06T18:00:00Z"), p: 20.4, v: 480_000_000 },
    { t: Date.parse("2022-11-06T22:00:00Z"), p: 17.8 },
    { t: Date.parse("2022-11-07T06:00:00Z"), p: 16.2 },
    { t: Date.parse("2022-11-07T15:00:00Z"), p: 22.0 },
    { t: Date.parse("2022-11-07T22:00:00Z"), p: 17.1 },
    { t: Date.parse("2022-11-08T06:00:00Z"), p: 15.4 },
    { t: Date.parse("2022-11-08T11:00:00Z"), p: 8.9 },
    { t: Date.parse("2022-11-08T18:00:00Z"), p: 4.3 },
    { t: Date.parse("2022-11-09T00:00:00Z"), p: 5.1 },
    { t: Date.parse("2022-11-09T18:00:00Z"), p: 3.4 },
    { t: Date.parse("2022-11-10T12:00:00Z"), p: 2.6 },
    { t: Date.parse("2022-11-11T12:00:00Z"), p: 1.95 },
    { t: Date.parse("2022-11-11T22:00:00Z"), p: 1.32, v: 920_000_000 },
  ],
  txs: [
    {
      t: Date.parse("2022-11-06T17:42:00Z"),
      hash: "0xb2f9...alameda-ftt-redeem",
      chain: "ethereum",
      from: "Alameda OTC desk",
      to: "FTX hot wallet",
      summary:
        "Alameda redeems 23M FTT against FTX hot wallet collateral — first visible defensive move after CZ's tweet.",
      usd: 470_000_000,
    },
    {
      t: Date.parse("2022-11-07T08:15:00Z"),
      hash: "0x7c12...usdc-out",
      chain: "ethereum",
      from: "FTX hot wallet",
      to: "Various user wallets",
      summary:
        "FTX hot wallet processes $1.2B of USDC withdrawals over 2 hours — 8x normal throughput.",
      usd: 1_200_000_000,
    },
    {
      t: Date.parse("2022-11-08T11:30:00Z"),
      hash: "0xd344...stables-drain",
      chain: "ethereum",
      from: "FTX hot wallet",
      to: "User wallets",
      summary:
        "Stablecoin reserves on-chain visibly depleting. Hot wallet USDT balance drops from $260M to $40M in 90 minutes.",
      usd: 220_000_000,
    },
    {
      t: Date.parse("2022-11-11T22:14:00Z"),
      hash: "0x1d2f...unauthorized-drain",
      chain: "ethereum",
      from: "FTX hot wallet",
      to: "Unknown EOA → Tornado Cash",
      summary:
        "First unauthorized transfer of post-bankruptcy drain — 50,000 ETH moved to a fresh address, then routed through Tornado Cash.",
      usd: 80_000_000,
    },
    {
      t: Date.parse("2022-11-11T22:48:00Z"),
      hash: "0x44ab...renbtc-bridge",
      chain: "ethereum",
      from: "Drainer EOA",
      to: "renBTC bridge",
      summary:
        "Drainer bridges $185M to BTC via renBTC — irreversible cross-chain hop, signature of someone who knew the system.",
      usd: 185_000_000,
    },
  ],
  social: [
    {
      t: Date.parse("2022-11-02T13:30:00Z"),
      author: "CoinDesk",
      handle: "@CoinDesk",
      text: "Divisions in Sam Bankman-Fried's Crypto Empire Blur on His Trading Titan Alameda's Balance Sheet — $14.6B assets, $5.8B in FTT.",
    },
    {
      t: Date.parse("2022-11-06T15:47:00Z"),
      author: "CZ",
      handle: "@cz_binance",
      text: "Due to recent revelations that have come to light, we have decided to liquidate any remaining FTT on our books.",
    },
    {
      t: Date.parse("2022-11-07T15:00:00Z"),
      author: "Caroline Ellison",
      handle: "@carolinecapital",
      text: "@cz_binance if you're looking to minimize the market impact on your FTT sales, Alameda will happily buy it all from you today at $22!",
    },
    {
      t: Date.parse("2022-11-07T16:30:00Z"),
      author: "SBF",
      handle: "@SBF_FTX",
      text: "FTX is fine. Assets are fine. We don't invest client assets (even in treasuries). [tweet later deleted]",
    },
    {
      t: Date.parse("2022-11-09T22:14:00Z"),
      author: "Binance",
      handle: "@binance",
      text: "As a result of corporate due diligence, as well as the latest news reports regarding mishandled customer funds and alleged US agency investigations, we have decided that we will not pursue the potential acquisition of FTX.com.",
    },
    {
      t: Date.parse("2022-11-11T22:30:00Z"),
      author: "ZachXBT",
      handle: "@zachxbt",
      text: "It appears FTX wallets are being drained. Tracking outflows in real time — these don't look authorized.",
    },
  ],
  sources: [
    {
      label: "CoinDesk: Inside Alameda's balance sheet",
      url: "https://www.coindesk.com/business/2022/11/02/divisions-in-sam-bankman-frieds-crypto-empire-blur-on-his-trading-titan-alamedas-balance-sheet/",
    },
    {
      label: "John Ray III's Chapter 11 declaration",
      url: "https://pacer-documents.s3.amazonaws.com/33/188450/042020648197.pdf",
    },
    {
      label: "ZachXBT FTX drainer tracker",
      url: "https://twitter.com/zachxbt/status/1591147405258752000",
    },
  ],
};
