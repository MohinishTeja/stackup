import React from 'react';
import {PressableOpacity} from 'react-native-pressable-opacity';
import {Div, Skeleton, Image, Text} from 'react-native-magnus';
import {SectionContainer} from '.';
import {useAave} from '../hooks';
import Network from '../config/network';

const NUMBER_OF_LOADERS = Object.keys(Network.MATIC.ERC20_TOKENS).length;
const LOADER_HEIGHT = 32;
const IMAGE_HEIGHT = 32;

export const AaveReserveOverview = props => {
  const {loading, reserveData} = useAave(set => ({
    loading: set.loading,
    reserveData: set.reserveData,
  }));

  const renderLoader = (_, index) => {
    return (
      <Div
        row
        key={`aave-reserve-overview-loader-${index}`}
        mt={(index > 0 && 'xl') || undefined}>
        <Skeleton h={LOADER_HEIGHT} w={LOADER_HEIGHT} />
        <Div ml="lg" flex={1}>
          <Skeleton.Box />
          <Skeleton.Box mt="sm" w="25%" />
        </Div>
        <Div flex={1}>
          <Skeleton.Box w="25%" alignSelf="flex-end" />
        </Div>
      </Div>
    );
  };

  const renderOverview = (reserve, index) => {
    const source = Network.MATIC.ERC20_TOKENS[reserve.configKey].LOGO;
    return (
      <PressableOpacity key={`aave-reserve-overview-${index}`}>
        <Div row mt={(index > 0 && 'xl') || undefined}>
          <Image h={IMAGE_HEIGHT} w={IMAGE_HEIGHT} source={source} />
          <Div ml="lg" flex={1}>
            <Text fontSize="lg" fontWeight="bold">
              {Network.MATIC.ERC20_TOKENS[reserve.configKey].SYMBOL}
            </Text>
            <Text mt="sm" fontSize="sm" color="gray700" fontWeight="500">
              {Network.MATIC.PROTOCOLS.AAVE.NAME}
            </Text>
          </Div>
          <Div flex={1} ml="lg" alignItems="flex-end" justifyContent="center">
            <Text fontSize="lg" fontWeight="bold">
              {`${parseFloat(reserve.liquidityRate * 100).toFixed(2)}% `}
              <Text fontSize="md" fontWeight="normal">
                APY
              </Text>
            </Text>
          </Div>
        </Div>
      </PressableOpacity>
    );
  };

  return (
    <SectionContainer blueBorder title="👻 Lending pools" {...props}>
      {loading
        ? new Array(NUMBER_OF_LOADERS).fill(0).map(renderLoader)
        : reserveData.map(renderOverview)}
    </SectionContainer>
  );
};
