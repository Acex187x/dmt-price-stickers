

export type Transaction = {
  readonly id: string;
  readonly type: string;
  readonly attributes: {
    readonly block_number: number;
    readonly tx_hash: string;
    readonly tx_from_address: string;
    readonly from_token_amount: string;
    readonly to_token_amount: string;
    readonly price_from_in_currency_token: string;
    readonly price_to_in_currency_token: string;
    readonly price_from_in_usd: string;
    readonly price_to_in_usd: string;
    readonly block_timestamp: string;
    readonly kind: string;
    readonly volume_in_usd: string;
    readonly from_token_address: string;
    readonly to_token_address: string;
  };
};

export type Pool = {
  readonly id: string;
  readonly type: string;
  readonly attributes: {
    readonly base_token_price_usd: string;
    readonly base_token_price_native_currency: string;
    readonly quote_token_price_usd: string;
    readonly quote_token_price_native_currency: string;
    readonly base_token_price_quote_token: string;
    readonly quote_token_price_base_token: string;
    readonly address: string;
    readonly name: string;
    readonly pool_created_at: string;
    readonly fdv_usd: string;
    readonly market_cap_usd: string | null;
    readonly price_change_percentage: {
      readonly m5: string;
      readonly h1: string;
      readonly h6: string;
      readonly h24: string;
    };
    readonly transactions: {
      readonly m5: {
        readonly buys: number;
        readonly sells: number;
        readonly buyers: number;
        readonly sellers: number;
      };
      readonly m15: {
        readonly buys: number;
        readonly sells: number;
        readonly buyers: number;
        readonly sellers: number;
      };
      readonly m30: {
        readonly buys: number;
        readonly sells: number;
        readonly buyers: number;
        readonly sellers: number;
      };
      readonly h1: {
        readonly buys: number;
        readonly sells: number;
        readonly buyers: number;
        readonly sellers: number;
      };
      readonly h24: {
        readonly buys: number;
        readonly sells: number;
        readonly buyers: number;
        readonly sellers: number;
      };
    };
    readonly volume_usd: {
      readonly m5: string;
      readonly h1: string;
      readonly h6: string;
      readonly h24: string;
    };
    readonly reserve_in_usd: string;
  };
  readonly relationships: {
    readonly base_token: {
      readonly data: {
        readonly id: string;
        readonly type: string;
      };
    };
    readonly quote_token: {
      readonly data: {
        readonly id: string;
        readonly type: string;
      };
    };
    readonly dex: {
      readonly data: {
        readonly id: string;
        readonly type: string;
      };
    };
  };
};

export type EventTransaction = {
  readonly wallet: string;
  readonly eventId: string;
  readonly fullWallet: string;
  readonly walletDMT: number;
  readonly topHolder: number;
  readonly walletPercent: number;
  readonly action: string;
  readonly amountDMT: number;
  readonly amountTON: number;
  readonly priceDMTTONChange: number;
  readonly priceDMTUSDChange: number;
};
