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
        AAVE_ADDRESS: __DEV__
          ? '0x639cB7b21ee2161DF9c882483C9D55c90c20Ca3e'
          : '0x27F8D03b3a2196956ED754baDc28D73be8830A6e',
      },
      USDC: {
        LOGO: require('../assets/usdc-logo.png'),
        SYMBOL: 'USDC',
        UNITS: 'mwei',
        ADDRESS: __DEV__
          ? '0x2058A9D7613eEE744279e3856Ef0eAda5FCbaA7e'
          : '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
        AAVE_ADDRESS: __DEV__
          ? '0x2271e3Fef9e15046d09E1d78a8FF038c691E9Cf9'
          : '0x1a13F4Ca1d028320A707D99520AbFefca3998b7F',
      },
    },
    PROTOCOLS: {
      AAVE: {
        NAME: 'Aave Polygon Market',
        SUBGRAPH_URL: __DEV__
          ? 'https://api.thegraph.com/subgraphs/name/aave/aave-v2-polygon-mumbai'
          : 'https://api.thegraph.com/subgraphs/name/aave/aave-v2-matic',
        LENDING_POOL_ADDRESS_PROVIDER: __DEV__
          ? '0x178113104fecbcd7ff8669a0150721e231f0fd4b'
          : '0xd05e3e715d945b59290df0ae8ef85c1bdb684744',
      },
    },
  },
};
