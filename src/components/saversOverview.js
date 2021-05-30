import React from 'react';
import {PressableOpacity} from 'react-native-pressable-opacity';
import {Div, Skeleton, Text} from 'react-native-magnus';
import * as Progress from 'react-native-progress';
import {useAccount, usePrices} from '../hooks';
import {ethers} from '../lib/ethers';
import Network from '../config/network';

const NUMBER_OF_LOADERS = Object.keys(Network.MATIC.ERC20_TOKENS).length;
const LOADER_HEIGHT = 32;

export const SaversOverview = ({onShowYields = () => {}, ...props}) => {
  const {maticLoading, stakedERC20Tokens, savers} = useAccount(set => ({
    maticLoading: set.loading,
    stakedERC20Tokens: set.stakedERC20Tokens,
    savers: set.savers,
  }));
  const {pricesLoading, spotPrices} = usePrices(set => ({
    pricesLoading: set.loading,
    spotPrices: set.spotPrices,
  }));
  const loading = pricesLoading || maticLoading;

  const renderLoader = (_, index) => {
    return (
      <Div
        key={`saver-overview-loader-${index}`}
        mt="lg"
        p="lg"
        rounded="md"
        bg="white">
        <Div row alignItems="center" justifyContent="center">
          <Skeleton h={LOADER_HEIGHT} w={LOADER_HEIGHT} />
          <Div ml="lg" flex={1}>
            <Skeleton.Box />
          </Div>
          <Div flex={1}>
            <Skeleton.Box w="30%" alignSelf="flex-end" />
            <Skeleton.Box mt="sm" w="25%" alignSelf="flex-end" />
          </Div>
        </Div>
        <Skeleton.Box mt="lg" />
      </Div>
    );
  };

  const renderOverview = (saver, index) => {
    const token = stakedERC20Tokens.find(t => t.symbol === saver.symbol) || {
      symbol: saver.symbol,
      balance: 0,
    };
    const price = spotPrices.find(
      p => p.contract_ticker_symbol === saver.symbol,
    );
    const units = Network.MATIC.ERC20_TOKENS[token.symbol].UNITS;

    const balance = ethers.BigNumber.from(token.balance);
    const saverBalance =
      parseFloat(ethers.utils.formatUnits(balance, units)) *
      saver.ratio *
      price.quote_rate;

    return (
      <PressableOpacity key={`savers-overview-${index}`}>
        <Div mt="lg" p="lg" rounded="md" bg="white">
          <Div row alignItems="center" justifyContent="center">
            <Text fontSize="4xl">{saver.icon}</Text>
            <Div ml="lg" flex={1}>
              <Text
                fontSize="lg"
                fontWeight="bold"
                ellipsizeMode="tail"
                numberOfLines={1}>
                {saver.name}
              </Text>
            </Div>
            <Div flex={1} ml="lg" alignItems="flex-end" justifyContent="center">
              <Text fontSize="lg" fontWeight="bold">
                {`$${ethers.utils.commify(saverBalance.toFixed(2))} USD`}
              </Text>
              <Text fontSize="xs" fontWeight="normal">
                {`of $${ethers.utils.commify(saver.target)} USD`}
              </Text>
            </Div>
          </Div>
          <Div mt="lg">
            <Progress.Bar
              color="#4299e1"
              progress={Math.min(1, saverBalance / saver.target)}
              width={null}
              height={8}
            />
          </Div>
        </Div>
      </PressableOpacity>
    );
  };

  return (
    <Div {...props}>
      <PressableOpacity onPress={onShowYields}>
        <Div
          p="lg"
          rounded="md"
          borderWidth={1}
          bg="green100"
          borderColor="green500">
          <Div row alignItems="center" justifyContent="center">
            <Div flex={1}>
              <Text fontSize="md" fontWeight="bold">
                Explore interest rates
              </Text>
              <Text mt="xs" fontSize="sm">
                Learn more about yields in DeFi
              </Text>
            </Div>
            <Text fontSize="2xl">👻</Text>
          </Div>
        </Div>
      </PressableOpacity>
      {loading
        ? new Array(NUMBER_OF_LOADERS).fill(0).map(renderLoader)
        : savers.map(renderOverview)}
    </Div>
  );
};
