
import { AreaPlot, LineChart, lineElementClasses, useDrawingArea } from '@mui/x-charts';
import React, { useEffect } from 'react';
import { AxisOptions, Chart } from "react-charts";
import styled from 'styled-components';
import { Transaction } from './Transaction';
import ArrowUsd from '../src/icons/arrow_usd.svg'
import ArrowTon from '../src/icons/arrow_ton.svg'
import Ton from '../src/icons/ton.svg'
import Dmt from '../src/icons/dmt.svg'
import Usd from '../src/icons/usd.svg'

const TON_GRADIENT = [
  "#2F4CDD",
  "#B519EC"
]

const USD_GRADIENT = [
  "#1A9A27",
  "#2AD382"
]

const exampleTransaction = {
  wallet: "UQ12..._iCe",
  walletDMT: 100,
  walletPercent: 10,
  action: "BUY",
  amountDMT: 5,
  amountTON: 100,
  priceDMTTONChange: 0.1,
  priceDMTUSDChange: 0.2,
}

const TransactionsTopOffset = 530

const ColorswitchTon = () => {
  const { top, height, bottom } = useDrawingArea();
  const svgHeight = top + bottom + height;

  return (
    <>
      <defs>
        <linearGradient id="paint0_linear_45_2" x1="300.25" y1="46.9999" x2="300.25" y2={`${svgHeight}px`} gradientUnits="userSpaceOnUse">
          <stop stopColor={TON_GRADIENT[0]} stopOpacity="0.4" />
          <stop offset="1" stopColor={TON_GRADIENT[0]} stopOpacity="0" />
        </linearGradient>
      </defs>

      <defs>
        <linearGradient id="paint0_linear_45_3" x1="299.498" y1="-4.28272" x2="299.498" y2={`${svgHeight}px`} gradientUnits="userSpaceOnUse">
          <stop stopColor={TON_GRADIENT[1]} stopOpacity="0.4" />
          <stop offset="1" stopColor={TON_GRADIENT[1]} stopOpacity="0" />
        </linearGradient>
      </defs>
    </>
  )
}

const ColorswitchUsd = () => {
  const { top, height, bottom } = useDrawingArea();
  const svgHeight = top + bottom + height;

  return (
    <>
      <defs>
        <linearGradient id="paint0_linear_46_2" x1="300.25" y1="46.9999" x2="300.25" y2={`${svgHeight}px`} gradientUnits="userSpaceOnUse">
          <stop stopColor={USD_GRADIENT[0]} stopOpacity="0.4" />
          <stop offset="1" stopColor={USD_GRADIENT[0]} stopOpacity="0" />
        </linearGradient>
      </defs>

      <defs>
        <linearGradient id="paint0_linear_46_3" x1="299.498" y1="-4.28272" x2="299.498" y2={`${svgHeight}px`} gradientUnits="userSpaceOnUse">
          <stop stopColor={USD_GRADIENT[1]} stopOpacity="0.4" />
          <stop offset="1" stopColor={USD_GRADIENT[1]} stopOpacity="0" />
        </linearGradient>
      </defs>
    </>
  )
}

export default function App() {
  const uData = [10, 20, 30, 40, 50, 60, 70];
  const xLabels = [
    'Page A',
    'Page B',
    'Page C',
    'Page D',
    'Page E',
    'Page F',
    'Page G',
  ];

  const [transactions, setTransactions] = React.useState([])
  const [priceHistory, setPriceHistory] = React.useState([])
  const [priceDMTTON, setPriceDMTTON] = React.useState([])
  const [priceDMTUSD, setPriceDMTUSD] = React.useState([])
  const [holders, setHolders] = React.useState("")
  const [liquidity, setLiqudity] = React.useState("")

  useEffect(() => {
    document.addEventListener("data", (e) => {
      console.log(e.detail)
      if (e.detail.transactions) {
        setTransactions(e.detail.transactions)
        setPriceHistory(e.detail.priceHistory)
        setPriceDMTTON(e.detail.priceDMTTON)
        setPriceDMTUSD(e.detail.priceDMTUSD)
        setLiqudity(e.detail.liquidity)
        setHolders(e.detail.holders)
      }
    })
  }, [])

  return (
    <>
      <div className="background">
        <TimeStamp>
          <TimeStampTime>{(new Date()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })}<br/></TimeStampTime>
            <TimeStampDate>{(new Date()).toLocaleDateString('ru-RU')} </TimeStampDate>
        </TimeStamp>
        <div className="content">
          <h1 style={{lineHeight: "260px"}}>$DMT</h1>
          <Prices>
            <Value className="value ton"><Amount><span>{priceDMTTON}</span> <Coin src={Ton}/></Amount></Value>
            <Value className="value usd"><Amount><span>{priceDMTUSD}</span> <Coin src={Usd}/></Amount></Value>
            {/*<span className="currency usd"></span>*/}
          </Prices>
        </div>
        <div style={{ width: "1200px", height: "300px", position: "absolute", top: TransactionsTopOffset }}>
          <LineChart
            width={1200}
            height={370}
            series={[{ data: priceHistory.map(el => el.priceDMTTON).reverse(), area: true, showMark: false }]}
            sx={{
              [`& .${lineElementClasses.root}`]: {
                display: 'none',
              },
              '.MuiAreaElement-root': {
                fill: 'url(#paint0_linear_45_2)',
              },
            }}
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            colors={TON_GRADIENT}
          ><ColorswitchTon></ColorswitchTon></LineChart>
        </div>
        <div style={{ width: "1200px", height: "300px", position: "absolute", top: TransactionsTopOffset }}>
          <LineChart
            width={1200}
            height={370}
            series={[{ data: priceHistory.map(el => el.priceDMTUSD).reverse(), area: true, showMark: false }]}
            sx={{
              [`& .${lineElementClasses.root}`]: {
                display: 'none',
              },
              '.MuiAreaElement-root': {
                fill: 'url(#paint0_linear_46_2)',
              },
            }}
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            colors={USD_GRADIENT}
          ><ColorswitchUsd></ColorswitchUsd></LineChart>
        </div>
        <TransactionsContainer>
          {
            transactions.map((t, i) => {
              return <Transaction key={i} t={t}></Transaction>
            })
          }
        </TransactionsContainer>
        <Liquidty>
          <span>${liquidity} LIQ</span><span>{holders} HOLDERS</span>
        </Liquidty>
      </div>
    </>
  );
}

const TransactionsContainer = styled.div`
    width: 1200px;
    height: 600px;
    justify-content: flex-end;
    padding-bottom: 50px;
    position: absolute;
    top: ${TransactionsTopOffset}px;
    z-index: 10;
    display: flex;
    gap: 24px;
    flex-direction: column;
    opacity: 1;

    background: linear-gradient(rgba(0, 0, 0, 0), rgb(0, 0, 0, 0.5));
`

const Arrow = styled.img`
    height: 50px;
`

const Coin = styled.img`
    height: 90px;
    margin-bottom: 40px;
`

const Prices = styled.div`
    display: flex;
    gap: 60px;
`

const Amount = styled.div`
    display: flex;
    align-items: flex-end;
    gap: 32px;
`

const Liquidty = styled.div`
    background: linear-gradient(.25turn, rgb(80 70 44), rgb(37 27 0));
    color: #838383;
    font-size: 60px;
    position: absolute;
    height: 70px;
    bottom: 0;
    width: 100%;
    font-weight: 900;
    left: 0;
    display: flex;
    justify-content: space-evenly;
`

const Value = styled.div`
    font-size: 160px;
    font-weight: 900;
    display: flex;
    align-items: center;
    gap: 27px;
`

const TimeStamp = styled.div`
    color: #afafaf;
    position: absolute;
    top: 70px;
    right: 60px;
    text-align: right;
`

const TimeStampTime = styled.span`
    font-size: 70px;
`

const TimeStampDate = styled.span`
    font-size: 35px;
`
