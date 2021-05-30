import React from 'react';
import {ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Div, Text, Image, Button, Icon} from 'react-native-magnus';
import {useAccount, usePrices} from '../hooks';
import Network from '../config/network';
import {ethers} from '../lib/ethers';

export default function CoinListScreen({route, navigation}) {
  const {saver} = route.params;
  const {maticLoading, balance, symbol, erc20Tokens} = useAccount(set => ({
    maticLoading: set.loading,
    balance: set.balance,
    symbol: set.symbol,
    erc20Tokens: saver ? set.stakedERC20Tokens : set.erc20Tokens,
  }));
  const {pricesLoading, spotPrices} = usePrices(set => ({
    pricesLoading: set.loading,
    spotPrices: set.spotPrices,
  }));
  const isLoading = maticLoading || pricesLoading;

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView>
        <Div flex={1} p="xl">
          <Text mb="lg" fontSize="6xl" fontWeight="500">
            {saver ? 'Coins in savers' : 'Coins in account'}
          </Text>
          {!isLoading &&
            [...(saver ? [] : [{balance, symbol}]), ...erc20Tokens].map(
              (token, index) => (
                <Div
                  key={`coin-list-${index}`}
                  row
                  mt="lg"
                  p="lg"
                  bg="white"
                  rounded="md"
                  alignItems="center"
                  justifyContent="space-between">
                  <Div row alignItems="center" justifyContent="center">
                    <Image
                      source={
                        Network.MATIC.ERC20_TOKENS[token.symbol]?.LOGO ||
                        Network.MATIC.LOGO
                      }
                      w={32}
                      h={32}
                    />
                    <Div ml="xl">
                      <Text fontSize="xl" fontWeight="500">
                        {`${ethers.utils.commify(
                          parseFloat(
                            ethers.utils.formatUnits(
                              token.balance,
                              Network.MATIC.ERC20_TOKENS[token.symbol]?.UNITS ||
                                Network.MATIC.UNITS,
                            ),
                          ).toFixed(4),
                        )} ${token.symbol}`}
                      </Text>
                      <Text mt="sm" fontSize="sm">
                        {`$ ${ethers.utils.commify(
                          (
                            parseFloat(
                              ethers.utils.formatUnits(
                                token.balance,
                                Network.MATIC.ERC20_TOKENS[token.symbol]
                                  ?.UNITS || Network.MATIC.UNITS,
                              ),
                            ) *
                            spotPrices.find(
                              p => p.contract_ticker_symbol === token.symbol,
                            ).quote_rate
                          ).toFixed(2),
                        )} USD`}
                      </Text>
                    </Div>
                  </Div>
                  <Button bg="white" p="xs" onPress={() => {}}>
                    <Icon
                      name="more-vertical"
                      fontFamily="Feather"
                      fontSize="6xl"
                      color="gray700"
                    />
                  </Button>
                </Div>
              ),
            )}
        </Div>
      </ScrollView>
    </SafeAreaView>
  );
}
