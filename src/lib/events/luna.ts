import type { ChronosEvent } from "../types";

/**
 * Terra Luna / UST Death Spiral — May 7-13, 2022.
 *
 * UST broke its peg on May 9 after a series of large withdrawals from
 * the Anchor Protocol drained reserves. The mint-burn arbitrage between
 * UST and LUNA reflexively destroyed LUNA's market cap as more LUNA was
 * printed to defend the peg, leading to ~$50B in market cap erased in
 * under a week.
 */
export const lunaUst: ChronosEvent = {
  id: "luna-ust-collapse",
  name: "Terra Luna / UST Death Spiral",
  shortName: "Luna",
  category: "stablecoin-depeg",
  startsAt: "2022-05-07T00:00:00Z",
  endsAt: "2022-05-13T23:59:59Z",
  blurb:
    "An algorithmic stablecoin and its reflexive sister token unwound $50B in five days. The UST peg broke on May 9; by May 13 LUNA traded at $0.0001 — and the mint-burn mechanism kept printing.",
  primaryAsset: "LUNA",
  relatedAssets: ["UST", "BTC", "ETH"],
  tags: [
    "stablecoin-depeg",
    "reflexive-mint-burn",
    "liquidity-spiral",
    "bank-run",
    "leverage-unwind",
    "balance-sheet-leak",
    "anchor-yield-collapse",
  ],
  heroChart: "/charts/luna-price.png",
  moments: [
    {
      t: Date.parse("2022-05-07T20:30:00Z"),
      label: "$285M UST swap",
      anchor:
        "A single wallet swaps $285M of UST for USDC on Curve's UST-3pool, draining the UST side of the pool and pushing UST to $0.985.",
      severity: 4,
    },
    {
      t: Date.parse("2022-05-08T05:00:00Z"),
      label: "Anchor TVL bleeds",
      anchor:
        "Anchor Protocol TVL drops from $14B to $11B overnight as users withdraw UST en masse, fearing peg risk.",
      severity: 4,
    },
    {
      t: Date.parse("2022-05-09T13:00:00Z"),
      label: "UST breaks $0.95",
      anchor:
        "UST trades at $0.93 across major venues. The Luna Foundation Guard begins selling its $3B BTC reserve to defend the peg.",
      severity: 5,
    },
    {
      t: Date.parse("2022-05-10T08:00:00Z"),
      label: "Death spiral begins",
      anchor:
        "Each $1 of UST burned mints $1 of LUNA at oracle price. LUNA supply jumps from 350M to 700M in 24 hours as arbitrageurs exit through the LUNA side.",
      severity: 5,
    },
    {
      t: Date.parse("2022-05-11T22:00:00Z"),
      label: "Terra chain halt",
      anchor:
        "Terra validators halt the chain at block 7607789 to prevent governance attacks — supply has reached 6.5T LUNA. Withdrawals from Binance suspended.",
      severity: 5,
    },
    {
      t: Date.parse("2022-05-12T18:00:00Z"),
      label: "LUNA → $0.00001",
      anchor:
        "LUNA trades at $0.00001 on Binance. The original token will be renamed Luna Classic; a new chain (Terra 2.0) is announced.",
      severity: 5,
    },
  ],
  prices: [
    { t: Date.parse("2022-05-06T00:00:00Z"), p: 84.5 },
    { t: Date.parse("2022-05-07T12:00:00Z"), p: 78.2 },
    { t: Date.parse("2022-05-07T20:30:00Z"), p: 76.0 },
    { t: Date.parse("2022-05-08T06:00:00Z"), p: 64.3 },
    { t: Date.parse("2022-05-08T18:00:00Z"), p: 63.2 },
    { t: Date.parse("2022-05-09T06:00:00Z"), p: 49.0 },
    { t: Date.parse("2022-05-09T13:00:00Z"), p: 38.4, v: 1_800_000_000 },
    { t: Date.parse("2022-05-09T18:00:00Z"), p: 30.1 },
    { t: Date.parse("2022-05-10T08:00:00Z"), p: 18.6 },
    { t: Date.parse("2022-05-10T18:00:00Z"), p: 8.0 },
    { t: Date.parse("2022-05-11T06:00:00Z"), p: 1.6 },
    { t: Date.parse("2022-05-11T18:00:00Z"), p: 0.6 },
    { t: Date.parse("2022-05-11T22:00:00Z"), p: 0.04 },
    { t: Date.parse("2022-05-12T06:00:00Z"), p: 0.005 },
    { t: Date.parse("2022-05-12T18:00:00Z"), p: 0.00002 },
    { t: Date.parse("2022-05-13T12:00:00Z"), p: 0.00001 },
  ],
  txs: [
    {
      t: Date.parse("2022-05-07T20:34:00Z"),
      hash: "0xcfee...curve-drain",
      chain: "ethereum",
      from: "0x8d47...d4 (whale)",
      to: "Curve UST-3pool",
      summary:
        "Single wallet swaps 285M UST for USDC on Curve's UST-3pool — drains the pool's UST side and forces a 1.5% peg deviation.",
      usd: 285_000_000,
    },
    {
      t: Date.parse("2022-05-09T11:45:00Z"),
      hash: "luna1lfg...btc-deploy",
      chain: "bnb",
      from: "Luna Foundation Guard",
      to: "Binance OTC",
      summary:
        "LFG transfers 28,200 BTC to Binance to defend the UST peg with spot bids.",
      usd: 850_000_000,
    },
    {
      t: Date.parse("2022-05-10T03:00:00Z"),
      hash: "terra-mint-1",
      chain: "ethereum",
      from: "Terra mint module",
      to: "LUNA holders",
      summary:
        "LUNA supply expands from 386M to 1.06B in a 4-hour window as UST is redeemed at the protocol-level oracle price.",
    },
    {
      t: Date.parse("2022-05-11T15:00:00Z"),
      hash: "anchor-withdraw",
      chain: "ethereum",
      from: "Anchor Protocol",
      to: "User wallets",
      summary:
        "Anchor TVL falls from $11B to $1.7B in 48 hours. The 19.5% APY that funded the UST demand is functionally over.",
      usd: 9_300_000_000,
    },
  ],
  social: [
    {
      t: Date.parse("2022-05-08T06:00:00Z"),
      author: "Do Kwon",
      handle: "@stablekwon",
      text: "Anon, you could listen to CT influensoors about UST depegging for the 69th time. Or you could remember that they're all now poor and stop talking to them.",
    },
    {
      t: Date.parse("2022-05-09T16:00:00Z"),
      author: "Luna Foundation Guard",
      handle: "@LFG_org",
      text: "The LFG is loaning $750M of BTC to OTC trading firms to help protect the UST peg, and 750M UST to accumulate BTC as market conditions normalize.",
    },
    {
      t: Date.parse("2022-05-10T04:00:00Z"),
      author: "Hasu",
      handle: "@hasufl",
      text: "Reminder that the only thing backing UST right now is the willingness to print LUNA. Reflexive systems unwind faster than they wind up.",
    },
    {
      t: Date.parse("2022-05-11T22:30:00Z"),
      author: "Terra",
      handle: "@terra_money",
      text: "Validators have decided to halt the Terra chain to prevent governance attacks following severe $LUNA inflation and a significantly reduced cost of attack.",
    },
  ],
  sources: [
    {
      label: "Nansen: On-chain forensics of UST depeg",
      url: "https://www.nansen.ai/research/on-chain-forensics-demystifying-terrausd-de-peg",
    },
    {
      label: "Cumberland: anatomy of an algo-stable death spiral",
      url: "https://cumberland.io/insights",
    },
  ],
};
