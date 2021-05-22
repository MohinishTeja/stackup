export default Network = {
  MATIC: {
    LOGO: require('../assets/matic-logo.png'),
    SYMBOL: 'MATIC',
    UNITS: 'ether',
    CHAIN_ID: __DEV__ ? 80001 : 137,
    EXPLORER_URL: `https://explorer-${
      __DEV__ ? 'mumbai' : 'mainnet'
    }.maticvigil.com`,
    RPC_URL: __DEV__
      ? 'https://rpc-mumbai.maticvigil.com'
      : 'https://rpc-mainnet.maticvigil.com/',
    ERC20_TOKENS: {
      DAI: {
        LOGO: require('../assets/dai-logo.png'),
        SYMBOL: 'DAI',
        UNITS: 'ether',
        ADDRESS: __DEV__
          ? '0x001B3B4d0F3714Ca98ba10F6042DaEbF0B1B7b6F'
          : '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
      },
      USDC: {
        LOGO: require('../assets/usdc-logo.png'),
        SYMBOL: 'USDC',
        UNITS: 'mwei',
        ADDRESS: __DEV__
          ? '0x2058A9D7613eEE744279e3856Ef0eAda5FCbaA7e'
          : '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
      },
    },
  },
};
