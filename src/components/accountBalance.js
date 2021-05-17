import React from 'react';
import {Dimensions} from 'react-native';
import {Div, Text, Image, Skeleton} from 'react-native-magnus';
import Carousel from 'react-native-snap-carousel';
import {useWalletStorage, useAccount} from '../hooks';
import {ethers} from '../lib/ethers';
import Network from '../config/network';

const {width: viewportWidth} = Dimensions.get('window');
const wp = percentage => {
  const value = (percentage * viewportWidth) / 100;
  return Math.round(value);
};

const sliderWidth = viewportWidth;
const sliderHeight = 128;
const itemWidth = wp(75) + wp(2) * 2;
const logoHeight = 48;

export const AccountBalance = props => {
  const {walletLoading} = useWalletStorage(set => ({
    walletLoading: set.loading,
  }));
  const {balance, erc20Tokens, maticLoading} = useAccount(set => ({
    balance: set.balance,
    erc20Tokens: set.erc20Tokens,
    maticLoading: set.loading,
  }));

  const renderItem = ({item, index}) => {
    return (
      <Div
        rounded="md"
        h={sliderHeight}
        bg="white"
        alignItems="center"
        justifyContent="center">
        <Image
          mt="lg"
          h={logoHeight}
          w={logoHeight}
          source={
            (index === 0 && Network.MATIC.LOGO) ||
            Network.MATIC.ERC20_TOKENS[item.symbol].LOGO
          }
        />
        <Div row my="lg" alignItems="baseline" justifyContent="center">
          <Text fontWeight="bold" fontSize="6xl">
            {ethers.utils.formatEther(item.balance.toString())}
          </Text>
          <Text fontWeight="bold" fontSize="lg">
            {' '}
            {item.symbol}
          </Text>
        </Div>
      </Div>
    );
  };

  return (
    <Div alignItems="center" h={sliderHeight} {...props}>
      {walletLoading || maticLoading ? (
        <Div
          rounded="md"
          w={itemWidth}
          h={sliderHeight}
          bg="white"
          alignItems="center"
          justifyContent="center">
          <Skeleton.Circle mt="lg" h={logoHeight} w={logoHeight} />
          <Div row my="lg" alignItems="baseline" justifyContent="center">
            <Skeleton.Box h={32} w={64} />
            <Skeleton.Box ml="sm" h={16} w={64} />
          </Div>
        </Div>
      ) : (
        <Carousel
          data={[{symbol: Network.MATIC.SYMBOL, balance}, ...erc20Tokens]}
          renderItem={renderItem}
          sliderWidth={sliderWidth}
          itemWidth={itemWidth}
        />
      )}
    </Div>
  );
};
