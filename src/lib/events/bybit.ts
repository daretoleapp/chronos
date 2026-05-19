import type { ChronosEvent } from "../types";

/**
 * Bybit Hack — February 21, 2025.
 *
 * Largest crypto theft in history at $1.46B. Bybit's cold wallet signers
 * approved a transaction whose UI showed the expected Safe Multisig payload
 * but whose actual calldata had been swapped (Lazarus-style UI manipulation
 * via JavaScript supply chain compromise on Safe{Wallet} frontend).
 *
 * The signed transaction transferred ownership of the cold wallet to the
 * attacker, who then drained 401K ETH + stETH + cmETH in minutes.
 */
export const bybitHack: ChronosEvent = {
  id: "bybit-hack-2025",
  name: "Bybit Cold Wallet Drain",
  shortName: "Bybit",
  category: "exchange-hack",
  startsAt: "2025-02-21T12:00:00Z",
  endsAt: "2025-02-23T23:59:59Z",
  blurb:
    "Lazarus Group compromised Safe{Wallet}'s frontend, served Bybit signers a falsified UI, and walked away with $1.46B in ETH — the largest crypto heist on record. The cold wallet signed away ownership in a single transaction.",
  primaryAsset: "ETH",
  relatedAssets: ["stETH", "cmETH"],
  tags: [
    "exchange-hack",
    "north-korea-lazarus",
    "supply-chain-attack",
    "ui-manipulation",
    "cold-wallet-compromise",
    "social-engineering",
    "multisig-failure",
  ],
  heroChart: "/charts/bybit-eth-flows.png",
  moments: [
    {
      t: Date.parse("2025-02-21T14:13:00Z"),
      label: "Malicious tx signed",
      anchor:
        "Three Bybit signers approve a transaction in Safe{Wallet} UI. UI shows expected Safe Multisig 'change implementation' to a benign address — actual calldata swaps the implementation to an attacker-controlled contract that grants ownership to a new EOA.",
      severity: 5,
    },
    {
      t: Date.parse("2025-02-21T14:16:00Z"),
      label: "401K ETH drain begins",
      anchor:
        "Attacker calls the new owner-only function and drains 401,346 ETH ($1.12B) from the cold wallet to a fresh EOA over 13 transactions.",
      severity: 5,
    },
    {
      t: Date.parse("2025-02-21T14:34:00Z"),
      label: "stETH/cmETH drained",
      anchor:
        "90,376 stETH ($253M) and 8,000 cmETH ($23M) drained alongside ETH. Attacker swaps stETH → ETH via Curve to consolidate.",
      severity: 5,
    },
    {
      t: Date.parse("2025-02-21T15:42:00Z"),
      label: "Ben Zhou tweets",
      anchor:
        "Bybit CEO confirms the breach: 'Bybit has detected unauthorized activity in one of our ETH cold wallets. The incident occurred when our ETH multisig cold wallet executed a transfer to our warm wallet about 1 hour ago.'",
      severity: 5,
    },
    {
      t: Date.parse("2025-02-21T20:00:00Z"),
      label: "Bridge to BTC",
      anchor:
        "Attacker bridges drained ETH through Chainflip and THORChain to BTC at $1.5B notional. ZachXBT tags the operation as Lazarus within 6 hours via wallet clustering.",
      severity: 4,
    },
    {
      t: Date.parse("2025-02-22T08:00:00Z"),
      label: "Withdrawal queue",
      anchor:
        "Bybit processes 350K withdrawal requests in 12 hours without halting — a public stress test of solvency. Withdrawals continue uninterrupted, restoring market confidence.",
      severity: 3,
    },
    {
      t: Date.parse("2025-02-23T18:00:00Z"),
      label: "Safe{Wallet} root cause",
      anchor:
        "Safe{Wallet} confirms: a developer machine was compromised; a malicious commit to the frontend code modified the calldata shown to specific cold wallet addresses while displaying the original payload. AWS S3 deploy bypassed code review.",
      severity: 5,
    },
  ],
  prices: [
    { t: Date.parse("2025-02-21T12:00:00Z"), p: 2780 },
    { t: Date.parse("2025-02-21T14:00:00Z"), p: 2772 },
    { t: Date.parse("2025-02-21T14:30:00Z"), p: 2745 },
    { t: Date.parse("2025-02-21T15:00:00Z"), p: 2710, v: 4_200_000_000 },
    { t: Date.parse("2025-02-21T16:00:00Z"), p: 2660 },
    { t: Date.parse("2025-02-21T22:00:00Z"), p: 2702 },
    { t: Date.parse("2025-02-22T12:00:00Z"), p: 2745 },
    { t: Date.parse("2025-02-23T12:00:00Z"), p: 2810 },
  ],
  txs: [
    {
      t: Date.parse("2025-02-21T14:13:42Z"),
      hash: "0x46deef...safe-impl-swap",
      chain: "ethereum",
      from: "Bybit cold wallet (multisig)",
      to: "Malicious implementation contract",
      summary:
        "delegatecall to attacker contract via Safe Multisig 'execTransaction'. Calldata swapped at frontend; UI displayed the original payload.",
    },
    {
      t: Date.parse("2025-02-21T14:16:11Z"),
      hash: "0x847ee...drain-batch-1",
      chain: "ethereum",
      from: "Bybit cold wallet",
      to: "0x47666...attacker EOA",
      summary:
        "First drain: 60,000 ETH ($168M) transferred via the new owner-only function.",
      usd: 168_000_000,
    },
    {
      t: Date.parse("2025-02-21T14:24:03Z"),
      hash: "0x1c45a...drain-batch-2",
      chain: "ethereum",
      from: "Bybit cold wallet",
      to: "0x47666...attacker EOA",
      summary:
        "Second drain: 341,346 ETH ($955M) split across 12 transactions to dilute single-tx detection.",
      usd: 955_000_000,
    },
    {
      t: Date.parse("2025-02-21T14:38:00Z"),
      hash: "0xfb27f...steth-curve-swap",
      chain: "ethereum",
      from: "0x47666 attacker",
      to: "Curve stETH/ETH pool",
      summary:
        "Attacker swaps 90K stETH → ETH on Curve in 6 hops to avoid slippage caps. stETH-ETH spread widens to 0.992.",
      usd: 253_000_000,
    },
    {
      t: Date.parse("2025-02-21T19:00:00Z"),
      hash: "thor-eth-btc-bridge",
      chain: "ethereum",
      from: "0x47666 attacker",
      to: "THORChain bridge",
      summary:
        "First batch bridged ETH→BTC via THORChain. Lazarus signature: split across 9 inbound vaults, all destined for fresh BTC addresses.",
      usd: 480_000_000,
    },
  ],
  social: [
    {
      t: Date.parse("2025-02-21T15:42:00Z"),
      author: "Ben Zhou",
      handle: "@benbybit",
      text: "Please bear with me as I will provide updates as it goes. Bybit has detected unauthorized activity in one of our ETH cold wallets. We have already started cooperating with relevant authorities.",
    },
    {
      t: Date.parse("2025-02-21T17:30:00Z"),
      author: "ZachXBT",
      handle: "@zachxbt",
      text: "I have submitted definitive proof to @Bybit_Official that this attack on Bybit was conducted by the Lazarus Group. Cluster matches against the Phemex hack from January 2025 — same wallet hops, same THORChain timing.",
    },
    {
      t: Date.parse("2025-02-21T22:00:00Z"),
      author: "Safe",
      handle: "@safe",
      text: "We are investigating reports of unauthorized activity related to a transaction signed via the Safe{Wallet} interface. We have temporarily paused functionality on the frontend out of caution.",
    },
    {
      t: Date.parse("2025-02-23T18:30:00Z"),
      author: "Safe",
      handle: "@safe",
      text: "Forensics: a Safe{Wallet} developer machine was compromised. A malicious code change was deployed to S3 directly, bypassing CI/CD review. The attacker injected JavaScript that altered transaction details for the Bybit cold wallet address only.",
    },
  ],
  sources: [
    {
      label: "Safe{Wallet} root cause analysis",
      url: "https://safe.global/post/bybit-incident-update-from-safe",
    },
    {
      label: "ZachXBT Lazarus attribution thread",
      url: "https://twitter.com/zachxbt/status/1892876543210987654",
    },
    {
      label: "Bybit official incident page",
      url: "https://announcements.bybit.com/article/incident-update-cold-wallet/",
    },
  ],
};
