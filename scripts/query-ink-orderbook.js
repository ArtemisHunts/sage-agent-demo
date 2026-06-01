#!/usr/bin/env node
'use strict';

const MARKETPLACE_PROGRAM = 'traderDnaR5w6Tcoi3NFm53i48FTDNbGjBSZwWXDRrg';
const ATLAS_MINT = 'ATLASXmbPQxBUYbxPsV97usA3fPQYEqzQBUHgiFCUsXx';
const INK_MINT = 'inkTd6G5fWSLhmTgY7tTkCR2a75ACrgM86e7HF6DkHh';

const DEFAULT_ENDPOINTS = [
  'https://api.mainnet-beta.solana.com',
  'https://solana-rpc.publicnode.com',
];

let nextRpcId = 1;

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

async function fetchOrderbook(endpoint) {
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
        { memcmp: { offset: 72, bytes: INK_MINT } },
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
    assetMint: INK_MINT,
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
  const endpoints = process.argv.slice(2);
  const candidates = endpoints.length ? endpoints : DEFAULT_ENDPOINTS;
  const failures = [];

  for (const endpoint of candidates) {
    try {
      console.log(JSON.stringify(await fetchOrderbook(endpoint), null, 2));
      return;
    } catch (error) {
      failures.push({ endpoint, error: error.message });
    }
  }

  console.error(JSON.stringify({ failures }, null, 2));
  process.exitCode = 1;
}

main();
