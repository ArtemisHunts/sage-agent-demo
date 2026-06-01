#!/usr/bin/env node
'use strict';

const MARKETPLACE_PROGRAM = 'traderDnaR5w6Tcoi3NFm53i48FTDNbGjBSZwWXDRrg';
const ATLAS_MINT = 'ATLASXmbPQxBUYbxPsV97usA3fPQYEqzQBUHgiFCUsXx';

const KNOWN_ASSETS = {
  INK: {
    name: 'Ink',
    mint: 'inkTd6G5fWSLhmTgY7tTkCR2a75ACrgM86e7HF6DkHh',
  },
  IC3A: {
    name: 'Contract - Quantum Nodes',
    mint: 'ic3AfsMFGKjkftEkpZLLdCGHmSQX5RwH92zhXUZVNCW',
  },
  IC3B: {
    name: 'Contract - Starpath Cells',
    mint: 'ic3BNHDBzoW8suW4q9a9qt5PkK7D38T4raGDc1gyuRh',
  },
};

const DEFAULT_ENDPOINTS = [
  'https://api.mainnet-beta.solana.com',
  'https://solana-rpc.publicnode.com',
];

let nextRpcId = 1;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function usage() {
  const codes = Object.keys(KNOWN_ASSETS).join('|');
  return [
    `Usage: node scripts/query-atlas-orderbook.js [${codes}|assetMint] [rpcEndpoint...]`,
    'Default asset: INK',
  ].join('\n');
}

function resolveAsset(token) {
  const value = token || 'INK';
  const upper = value.toUpperCase();

  if (KNOWN_ASSETS[upper]) {
    return {
      code: upper,
      ...KNOWN_ASSETS[upper],
    };
  }

  if (/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(value)) {
    return {
      code: 'CUSTOM',
      name: 'Custom asset',
      mint: value,
    };
  }

  throw new Error(`Unknown asset "${value}".\n${usage()}`);
}

function parseArgs(argv) {
  const args = [...argv];
  if (args.includes('--help') || args.includes('-h')) {
    console.log(usage());
    process.exit(0);
  }

  let assetToken;
  if (args[0] && !args[0].startsWith('http')) {
    assetToken = args.shift();
  }

  return {
    asset: resolveAsset(assetToken),
    endpoints: args.length ? args : DEFAULT_ENDPOINTS,
  };
}

function readU64(buffer, offset) {
  return buffer.readBigUInt64LE(offset);
}

function readI64(buffer, offset) {
  return buffer.readBigInt64LE(offset);
}

function decimalString(raw, decimals) {
  const value = raw < 0n ? -raw : raw;
  const base = 10n ** BigInt(decimals);
  const whole = value / base;
  const fraction = value % base;
  const sign = raw < 0n ? '-' : '';

  if (fraction === 0n) {
    return `${sign}${whole.toString()}`;
  }

  return `${sign}${whole.toString()}.${fraction
    .toString()
    .padStart(decimals, '0')
    .replace(/0+$/, '')}`;
}

async function rpc(endpoint, method, params) {
  const delays = [0, 1000, 2500];
  let lastError;

  for (const delay of delays) {
    if (delay) {
      await sleep(delay);
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: nextRpcId++,
          method,
          params,
        }),
      });

      if (!response.ok) {
        throw new Error(`${method} HTTP ${response.status}`);
      }

      const payload = await response.json();
      if (payload.error) {
        throw new Error(`${method} RPC error: ${payload.error.message || JSON.stringify(payload.error)}`);
      }

      return payload.result;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
}

function parseOrder(account, currencyDecimals) {
  const buffer = Buffer.from(account.account.data[0], 'base64');
  if (buffer.length !== 201) {
    throw new Error(`Unexpected order account size for ${account.pubkey}: ${buffer.length}`);
  }

  const sideFlag = buffer[168];
  const side = sideFlag === 0 ? 'buy' : sideFlag === 1 ? 'sell' : `unknown-${sideFlag}`;
  const priceRaw = readU64(buffer, 169);

  return {
    id: account.pubkey,
    side,
    priceRaw: priceRaw.toString(),
    priceAtlas: decimalString(priceRaw, currencyDecimals),
    orderOriginationQty: readU64(buffer, 177).toString(),
    orderRemainingQty: readU64(buffer, 185).toString(),
    createdAtTimestamp: readI64(buffer, 193).toString(),
  };
}

async function fetchOrderbook(endpoint, asset) {
  const supply = await rpc(endpoint, 'getTokenSupply', [
    ATLAS_MINT,
    { commitment: 'confirmed' },
  ]);
  const currencyDecimals = supply.value.decimals;

  const accounts = await rpc(endpoint, 'getProgramAccounts', [
    MARKETPLACE_PROGRAM,
    {
      commitment: 'confirmed',
      encoding: 'base64',
      filters: [
        { dataSize: 201 },
        { memcmp: { offset: 40, bytes: ATLAS_MINT } },
        { memcmp: { offset: 72, bytes: asset.mint } },
      ],
    },
  ]);

  const orders = accounts
    .map((account) => parseOrder(account, currencyDecimals))
    .filter((order) => BigInt(order.orderRemainingQty) > 0n);

  const topAsks = orders
    .filter((order) => order.side === 'sell')
    .sort((left, right) => Number(left.priceRaw) - Number(right.priceRaw))
    .slice(0, 5);
  const topBids = orders
    .filter((order) => order.side === 'buy')
    .sort((left, right) => Number(right.priceRaw) - Number(left.priceRaw))
    .slice(0, 5);

  return {
    timestamp: new Date().toISOString(),
    endpoint,
    marketplaceProgram: MARKETPLACE_PROGRAM,
    assetCode: asset.code,
    assetName: asset.name,
    assetMint: asset.mint,
    currencyMint: ATLAS_MINT,
    currencyDecimals,
    openOrderCount: orders.length,
    bestAsk: topAsks[0] || null,
    bestBid: topBids[0] || null,
    topAsks,
    topBids,
  };
}

async function main() {
  const { asset, endpoints } = parseArgs(process.argv.slice(2));
  const failures = [];

  for (const endpoint of endpoints) {
    try {
      console.log(JSON.stringify(await fetchOrderbook(endpoint, asset), null, 2));
      return;
    } catch (error) {
      failures.push({ endpoint, error: error.message });
    }
  }

  console.error(JSON.stringify({ asset, failures }, null, 2));
  process.exitCode = 1;
}

main();
