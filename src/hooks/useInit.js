import {useWalletStorage, useAccount} from '.';

export const useInit = () => {
  const {wallet} = useWalletStorage(set => ({
    wallet: set.wallet,
  }));
  const {fetchBalance, fetchERC20Balance} = useAccount(set => ({
    fetchBalance: set.fetchBalance,
    fetchERC20Balance: set.fetchERC20Balance,
  }));

  const init = async () => {
    return Promise.all([
      fetchBalance(wallet),
      fetchERC20Balance(
        wallet,
        Network.MATIC.ERC20_TOKENS.DAI.SYMBOL,
        Network.MATIC.ERC20_TOKENS.DAI.ADDRESS,
      ),
      fetchERC20Balance(
        wallet,
        Network.MATIC.ERC20_TOKENS.USDC.SYMBOL,
        Network.MATIC.ERC20_TOKENS.USDC.ADDRESS,
      ),
    ]);
  };

  return init;
};
