import React from 'react';
import {PressableOpacity} from 'react-native-pressable-opacity';
import {Div, Icon, Text, Skeleton} from 'react-native-magnus';
import {useAccount, usePrices} from '../hooks';
import {ethers} from '../lib/ethers';
import Network from '../config/network';

export const AccountOverview = ({
  savers = false,
  onShowCoin = () => {},
  ...props
}) => {
  const {maticLoading, balance, erc20Tokens} = useAccount(set => ({
    maticLoading: set.loading,
    balance: set.balance,
    erc20Tokens: savers ? set.stakedERC20Tokens : set.erc20Tokens,
  }));
  const {pricesLoading, spotPrices} = usePrices(set => ({
    pricesLoading: set.loading,
    spotPrices: set.spotPrices,
  }));
  const loading = maticLoading || pricesLoading;

  const calculateAvailable = () => {
    const balanceQuote = savers
      ? 0
      : parseFloat(ethers.utils.formatUnits(balance, Network.MATIC.UNITS)) *
        spotPrices.find(p => p.contract_ticker_symbol === Network.MATIC.SYMBOL)
          .quote_rate;

    return erc20Tokens.reduce((prev, curr) => {
      const tokenBalanceQuote =
        parseFloat(
          ethers.utils.formatUnits(
            curr.balance,
            Network.MATIC.ERC20_TOKENS[curr.symbol].UNITS,
          ),
        ) *
        spotPrices.find(p => p.contract_ticker_symbol === curr.symbol)
          .quote_rate;

      return prev + tokenBalanceQuote;
    }, balanceQuote);
  };

  return (
    <>
      {loading ? (
        <Div pt="xl" pb="lg" px="lg" rounded="md" bg="white" {...props}>
          <Skeleton.Box h={32} w={128} alignSelf="center" />
          <Skeleton.Box mt="xs" h={21} w={64} alignSelf="center" />
          <Skeleton.Box mt="xl" h={21} />
        </Div>
      ) : (
        <Div pt="xl" pb="lg" px="lg" rounded="md" bg="white" {...props}>
          <Text fontSize="6xl" fontWeight="bold" textAlign="center">
            {`$${ethers.utils.commify(calculateAvailable().toFixed(2))} USD`}
          </Text>
          <Text mt="xs" fontSize="lg" textAlign="center">
            {savers ? 'Total saved' : 'Available'}
          </Text>
          <PressableOpacity onPress={onShowCoin}>
            <Div
              row
              mt="xl"
              p="sm"
              rounded="md"
              borderWidth={1}
              bg="teal100"
              borderColor="teal500"
              alignItems="center"
              justifyContent="space-between">
              <Text fontSize="sm" fontWeight="500">
                Show coins
              </Text>
              <Icon name="coins" fontFamily="FontAwesome5" color="gray700" />
            </Div>
          </PressableOpacity>
        </Div>
      )}
    </>
  );
};
