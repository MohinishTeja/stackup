import {useWalletStorage, useAccount} from '.';

export const useInit = () => {
  const {wallet} = useWalletStorage(set => ({
    wallet: set.wallet,
  }));
  const {fetchBalance, fetchERC20Balance, fetchTransactions} = useAccount(
    set => ({
      fetchBalance: set.fetchBalance,
      fetchERC20Balance: set.fetchERC20Balance,
      fetchTransactions: set.fetchTransactions,
    }),
  );

  const init = async () => {
    return Promise.all([
      fetchBalance(wallet),
      fetchERC20Balance(wallet),
      fetchTransactions(wallet),
    ]);
  };

  return init;
};
