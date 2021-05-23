import React from 'react';
import {useWindowDimensions} from 'react-native';
import {Div, Text, Image, Skeleton} from 'react-native-magnus';
import Carousel from 'react-native-snap-carousel';
import {useWalletStorage, useAccount} from '../hooks';
import {ethers} from '../lib/ethers';
import Network from '../config/network';
import {numberWithCommas} from '../utils/formatHelpers';

export const AccountBalance = ({stakedTokens = false, ...props}) => {
  const {width: viewportWidth} = useWindowDimensions();
  const wp = percentage => {
    const value = (percentage * viewportWidth) / 100;
    return Math.round(value);
  };
  const sliderWidth = viewportWidth;
  const sliderHeight = 128;
  const itemWidth = wp(75) + wp(2) * 2;
  const logoHeight = 48;

  const {walletLoading} = useWalletStorage(set => ({
    walletLoading: set.loading,
  }));
  const {balance, erc20Tokens, maticLoading} = useAccount(set => ({
    balance: set.balance,
    erc20Tokens: stakedTokens ? set.stakedERC20Tokens : set.erc20Tokens,
    maticLoading: set.loading,
  }));

  const renderItem = ({item, index}) => {
    const source =
      (index === erc20Tokens.length && Network.MATIC.LOGO) ||
      Network.MATIC.ERC20_TOKENS[item.symbol].LOGO;
    const units =
      (index === erc20Tokens.length && Network.MATIC.UNITS) ||
      Network.MATIC.ERC20_TOKENS[item.symbol].UNITS;

    const balance = numberWithCommas(
      ethers.utils.formatUnits(item.balance, units),
    );
    let fontSize = '6xl';
    if (balance.length > 10) fontSize = '3xl';
    if (balance.length > 20) fontSize = 'xl';

    const showPool = stakedTokens && item.pool;

    return (
      <Div
        rounded="md"
        h={sliderHeight}
        bg="white"
        alignItems="center"
        justifyContent="center">
        <Image mt="lg" h={logoHeight} w={logoHeight} source={source} />
        {showPool && (
          <Text mt="sm" color="gray700" fontSize="sm">
            {item.pool}
          </Text>
        )}
        <Div
          row
          my={showPool ? 'md' : 'lg'}
          alignItems="baseline"
          justifyContent="center">
          <Text fontWeight="bold" fontSize={fontSize}>
            {balance}
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
          useScrollView
          data={[...erc20Tokens, {symbol: Network.MATIC.SYMBOL, balance}]}
          renderItem={renderItem}
          sliderWidth={sliderWidth}
          itemWidth={itemWidth}
        />
      )}
    </Div>
  );
};
