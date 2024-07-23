import styled from 'styled-components';
import Ton from '../src/icons/ton.svg'
import Dmt from '../src/icons/dmt.svg'
import ArrowSell from '../src/icons/arrow_sell.svg'
import ArrowBuy from '../src/icons/arrow_buy.svg'

const emojiUrl = {

}

function getEmojiByBalance(balance) {
  if (balance > 50) {
    return `🐳`
  } else if (balance > 10) {
    return `🐙`
  } else if (balance > 5) {
    return `🐠`
  } else if (balance > 2) {
    return `🍤`
  } else if (balance > 1) {
    return `🐹`
  } else if (balance < 1) {
    return `💀`
  }
}

export function Transaction({ t }) {

  const {
    wallet,
    walletDMT,
    action,
    amountDMT,
    amountTON,
    priceDMTTONChange,
    priceDMTUSDChange,
    topHolder
  } = t


  const amountFrom = action === "buy" ? amountTON : amountDMT;
  const amountTo = action === "buy" ? amountDMT : amountTON;

  return <Container>
    <WalletContainer>
      <WalletEmoji src={`https://emojicdn.elk.sh/${getEmojiByBalance(walletDMT)}`}/>
      <div>
        <WallerTitle>{wallet}</WallerTitle>
        <WalletSubtitle>{walletDMT} $DMT</WalletSubtitle>
        {/*<WalletSubtitle>💰 {walletDMT} $DMT {topHolder !== 0 ? `| TOP-${topHolder} holder` : ''}</WalletSubtitle>*/}
      </div>
    </WalletContainer>
    <TransactionContainer>
      <TransactionTitleContainer>
        <TokenContainer>
          <TokenAmount coin={action === 'buy' ? 'ton' : 'dmt'}>{amountFrom}</TokenAmount>
          <TokenIconContainer><img src={action === 'buy' ? Ton : Dmt} alt={'ton'} /></TokenIconContainer>
        </TokenContainer>
        <img src={action === 'buy' ? ArrowBuy : ArrowSell} alt={'dmt'} />
        <TokenContainer>
          <TokenAmount coin={action === 'buy' ? 'dmt' : 'ton'}>{amountTo}</TokenAmount>
          <TokenIconContainer><img src={action === 'buy' ? Dmt : Ton} alt={'dmt'} /></TokenIconContainer>
        </TokenContainer>
      </TransactionTitleContainer>
      <TransactionSubtitle>
        TON: {priceDMTTONChange} | USD: {priceDMTUSDChange}
      </TransactionSubtitle>
    </TransactionContainer>
  </Container>
}

const Container = styled.div`
    display: flex;
    margin-left: 70px;
    gap: 20px;
`;

const WalletContainer = styled.div`
    display: flex;
    flex-direction: row;
    gap: 20px;
    min-width: 380px;
`

const WallerTitle = styled.h1`
    font-size: 50px;
    color: #c8c8c8;
    height: 62px;
    font-weight: 600;
`

const WalletSubtitle = styled.h2`
    font-size: 45px;
    color: #b1b1b1;
    margin: 0;
`

const WalletEmoji = styled.img`
    width: 100px;
    height: 100px;
`

const TransactionContainer = styled.div`
    
`

const TransactionTitleContainer = styled.div`
    display: flex;
    gap: 24px;
    
    & img {
        width: 60px;
    }
`

const TokenContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
`

const TokenAmount = styled.h1`
    font-size: 75px;
    font-weight: 800;
    ${p => p.coin === 'ton' ? `
      background: linear-gradient(rgba(82, 127, 228, 1), rgba(111, 195, 251, 1));
    ` : `
      background: linear-gradient(#E5AB1F, #A1791A);
    `}
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    
`

const TokenIconContainer = styled.div`
    img {
        height: 52px;
    }
`

const TransactionSubtitle = styled.h2`
    font-size: 28px;
    color: #fff;
    margin: 0;
`



