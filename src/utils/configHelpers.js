export const getErc20AddressMap = Network =>
  Object.entries(Network.MATIC.ERC20_TOKENS).reduce((prev, [key, value]) => {
    prev[value.ADDRESS.toLowerCase()] = key;
    return prev;
  }, {});

export const getAaveErc20AddressMap = Network =>
  Object.entries(Network.MATIC.ERC20_TOKENS).reduce((prev, [key, value]) => {
    prev[value.AAVE_ADDRESS.toLowerCase()] = key;
    return prev;
  }, {});
