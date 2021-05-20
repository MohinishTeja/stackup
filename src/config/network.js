export default Network = {
  MATIC: {
    LOGO: require('../assets/matic-logo.png'),
    SYMBOL: 'MATIC',
    EXPLORER_URL: `https://explorer-${
      __DEV__ ? 'mumbai' : 'mainnet'
    }.maticvigil.com/address`,
    RPC_URL: __DEV__
      ? 'https://rpc-mumbai.maticvigil.com'
      : 'https://rpc-mainnet.maticvigil.com/',
    ERC20_TOKENS: {
      DAI: {
        LOGO: require('../assets/dai-logo.png'),
        SYMBOL: 'DAI',
        ADDRESS: __DEV__
          ? '0x326C977E6efc84E512bB9C30f76E30c160eD06FB'
          : '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
      },
      USDC: {
        LOGO: require('../assets/usdc-logo.png'),
        SYMBOL: 'USDC',
        ADDRESS: __DEV__
          ? '0x326C977E6efc84E512bB9C30f76E30c160eD06FB'
          : '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
      },
    },
  },
};
