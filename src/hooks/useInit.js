import {useWalletStorage, useAccount, useAave} from '.';

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
  const {fetchReserveData} = useAave(set => ({
    fetchReserveData: set.fetchReserveData,
  }));

  const init = async () => {
    return Promise.all([
      fetchBalance(wallet),
      fetchERC20Balance(wallet),
      fetchTransactions(wallet),
      fetchReserveData(),
    ]);
  };

  return init;
};
