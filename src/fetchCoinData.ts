import axios from 'axios';
import puppeteer from 'puppeteer';
import { EventTransaction, Pool, Transaction } from './types';
import TonWeb from 'tonweb';
import { HttpClient, Api } from 'tonapi-sdk-js';

const httpClient = new HttpClient({
  baseUrl: 'https://tonapi.io',
  baseApiParams: {
    headers: {
      'Content-type': 'application/json'
    }
  }
});

const client = new Api(httpClient);

function formatLiquidty(liquidity: number): string {
  if (liquidity < 1000000) {
    return (liquidity / 1000).toFixed(2) + 'K';
  } else {
    return (liquidity / 1000000).toFixed(2) + 'M';
  }

}

function normalizeGraphData(data: {
  readonly priceDMTTON: number;
  readonly priceDMTUSD: number;
}[]): readonly {
  readonly priceDMTTON: number;
  readonly priceDMTUSD: number;
}[] {

  const tonRange = [
    Math.min(...data.map(d => d.priceDMTTON)),
    Math.max(...data.map(d => d.priceDMTTON)),
  ]

  const usdRange = [
    Math.min(...data.map(d => d.priceDMTUSD)),
    Math.max(...data.map(d => d.priceDMTUSD)),
  ]

  return data.map(d => ({
    priceDMTTON: 3 + ((d.priceDMTTON - tonRange[0]) / (tonRange[1] - tonRange[0]) * 5),
    priceDMTUSD: 3 + ((d.priceDMTUSD - usdRange[0]) / (usdRange[1] - usdRange[0]) * 5),
  }))
}

export function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const TRADES_URL = "https://api.geckoterminal.com/api/v2/networks/ton/pools/EQBTbu-Q5sOShpEXfEUAq9lL378Fog2DdVcem8mebNND_lsf/trades";
const POOL_URL = "https://api.geckoterminal.com/api/v2/networks/ton/pools/EQBTbu-Q5sOShpEXfEUAq9lL378Fog2DdVcem8mebNND_lsf?include=base_token%2C%20quote_token%2C%20dex";

const ton = new TonWeb()

function walletToAddress(wallet: string): string {
  return new ton.utils.Address(wallet).toString(false)
}

function shortenWallet(wallet: string): string {
  return `${wallet.slice(2, 4)}...${wallet.slice(-4)}`
}

function priceChange(current: number, previous: number): string {
  const res = ((current - previous) / previous) * 100;
  return `${res > 0 ? '+' : ''}${res.toFixed(2)}%`;
}

function getDmtTonPrice(t: Transaction): number {
  if (t.attributes.kind === 'buy') {
    return parseFloat(t.attributes.price_to_in_currency_token);
  } else {
    return parseFloat(t.attributes.price_from_in_currency_token);
  }
}

function getDmtUsdPrice(t: Transaction): number {
  if (t.attributes.kind === 'buy') {
    return parseFloat(t.attributes.price_to_in_usd);
  } else {
    return parseFloat(t.attributes.price_from_in_usd);
  }
}

export async function fetchCoinData(): Promise<{
  readonly transactions: readonly EventTransaction[];
}> {
  const transactions = await axios.get(TRADES_URL);
  const pool = await axios.get(POOL_URL);

  const transactionsData = transactions.data.data as readonly Transaction[]
  const poolData = pool.data.data as Pool

  const holders = await client.jettons.getJettonHolders(
    '0:ea665ac046fe233c9a70cdb60f3623ad0ff0a8b96c5e0066e9edac00ce87b340',
    {
      limit: 1000,
    }
  )

  await wait(1000)

  const eventTransactions = transactionsData
    .reduce<readonly EventTransaction[]>((acc, t, i, arr) => {
      if (i === arr.length - 1) return acc;
      return [...acc, {
        wallet: shortenWallet(t.attributes.tx_from_address),
        eventId: t.attributes.tx_hash,
        fullWallet: t.attributes.tx_from_address,
        walletDMT: 0,
        walletPercent: 0,
        action: t.attributes.kind,
        amountDMT: (t.attributes.kind === 'buy' ? parseFloat(t.attributes.to_token_amount) : parseFloat(t.attributes.from_token_amount)).toFixed(2),
        amountTON: (t.attributes.kind === 'buy' ? parseFloat(t.attributes.from_token_amount) : parseFloat(t.attributes.to_token_amount)).toFixed(2),
        priceDMTTONChange: priceChange(getDmtTonPrice(t), getDmtTonPrice(arr[i + 1])),
        priceDMTUSDChange: priceChange(getDmtUsdPrice(t), getDmtUsdPrice(arr[i + 1])),
      }]
    }, [])
    .filter(t => {
      return t.amountTON >= 5
    })

  const finalTransactions = []

  for (const et of eventTransactions) {
    if (finalTransactions.length >= 3) {
      break;
    }

    // Check if the event is suspicious

    const event = await client.events.getEvent(et.eventId)

    const dmtTransfer = !!event.actions.find(a => {
      a?.JettonTransfer?.jetton?.symbol && a?.JettonTransfer?.jetton?.symbol === 'DMT'
    });

    const dmtFlow = !!event.value_flow.find(v => {
      return v.jettons?.find(j => j.jetton.symbol === 'DMT')
    })

    if (!(dmtTransfer || dmtFlow)) {
      continue;
    }

    await wait(1000)

    // Get holder waller

    const res = await client.accounts.getAccountJettonBalance(
      et.fullWallet,
      "0:ea665ac046fe233c9a70cdb60f3623ad0ff0a8b96c5e0066e9edac00ce87b340"
    )

    console.log("wallet", res)

    finalTransactions.push({
      ...et,
      walletDMT: (parseFloat(res.balance) / 1000000000).toFixed(2),
      walletPercent: ((parseFloat(res.balance) / 1000000000) / 10000).toFixed(2),
      topHolder: holders.addresses.findIndex(a => a.owner.address === walletToAddress(et.fullWallet)) + 1,
    })

    await wait(1000);
  }

  const priceHistory = normalizeGraphData(transactionsData.map(t => {
    return {
      priceDMTTON: getDmtTonPrice(t),
      priceDMTUSD: getDmtUsdPrice(t),
    }
  }))

  console.log({
    finalTransactions
  })

  return {
    transactions: finalTransactions as readonly EventTransaction[],
    priceHistory,
    holders: holders.total,
    priceDMTTON: getDmtTonPrice(transactionsData[0]).toFixed(2),
    priceDMTUSD: getDmtUsdPrice(transactionsData[0]).toFixed(2),
    liquidity: formatLiquidty(parseFloat(poolData.attributes.reserve_in_usd)),
  }
}

