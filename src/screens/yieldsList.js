import React, {useState} from 'react';
import {ScrollView, RefreshControl} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Div, Text, Image, Button, Icon, Skeleton} from 'react-native-magnus';
import {useAave} from '../hooks';
import Network from '../config/network';

const NUMBER_OF_LOADERS = Object.keys(Network.MATIC.ERC20_TOKENS).length;
const LOADER_HEIGHT = 32;

export default function YieldsListScreen({navigation}) {
  const [showLendingInfo, setShowLendingInfo] = useState(false);
  const {aaveLoading, reserveData, fetchReserveData} = useAave(set => ({
    aaveLoading: set.loading,
    reserveData: set.reserveData,
    fetchReserveData: set.fetchReserveData,
  }));
  const isLoading = aaveLoading;

  const renderLoader = (_, index) => {
    return (
      <Div
        key={`yields-lending-rates-${index}`}
        mt="lg"
        p="lg"
        rounded="md"
        bg="white">
        <Div row alignItems="center" justifyContent="center">
          <Skeleton h={LOADER_HEIGHT} w={LOADER_HEIGHT} />
          <Div ml="lg" flex={1}>
            <Skeleton.Box />
            <Skeleton.Box mt="sm" w="25%" />
          </Div>
          <Div flex={1}>
            <Skeleton
              h={LOADER_HEIGHT}
              w={LOADER_HEIGHT}
              alignSelf="flex-end"
            />
          </Div>
        </Div>
      </Div>
    );
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={fetchReserveData} />
        }>
        <Div flex={1} p="xl">
          <Div row alignItems="center" justifyContent="space-between">
            <Text fontSize="5xl" fontWeight="500">
              Current lending rates
            </Text>
            <Button
              bg="transparent"
              underlayColor="blue100"
              p="md"
              rounded="circle"
              onPress={() => setShowLendingInfo(!showLendingInfo)}>
              <Icon
                name="questioncircleo"
                fontFamily="AntDesign"
                fontSize="3xl"
                color="blue500"
              />
            </Button>
          </Div>
          {showLendingInfo && (
            <Div
              p="lg"
              mt="lg"
              rounded="md"
              borderWidth={1}
              bg="green100"
              borderColor="green500">
              <Text fontSize="lg" fontWeight="bold">
                👻 How does DeFi lending work?
              </Text>
              <Text mt="md" fontSize="md" textAlign="justify">
                Markets like Aave enable savers to earn passive interest by
                depositing their assets into a pool which borrowers can then
                take loans from.
              </Text>
              <Text mt="md" fontSize="md" textAlign="justify">
                These interest rates are always changing depending on the usual
                market forces of supply and demand.
              </Text>
            </Div>
          )}
          {isLoading
            ? new Array(NUMBER_OF_LOADERS).fill(0).map(renderLoader)
            : reserveData.map((reserve, index) => (
                <Div
                  key={`yields-list-${index}`}
                  row
                  mt={index ? 'lg' : 'xl'}
                  p="lg"
                  bg="white"
                  rounded="md"
                  alignItems="center"
                  justifyContent="space-between">
                  <Div row alignItems="center" justifyContent="center">
                    <Image
                      source={Network.MATIC.ERC20_TOKENS[reserve.symbol]?.LOGO}
                      w={32}
                      h={32}
                    />
                    <Div ml="xl">
                      <Text fontSize="xl" fontWeight="500">
                        {`${reserve.symbol} @ ${parseFloat(
                          reserve.liquidityRate * 100,
                        ).toFixed(2)}%`}
                      </Text>
                      <Text mt="sm" fontSize="sm">
                        {Network.MATIC.PROTOCOLS.AAVE.NAME}
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
              ))}
        </Div>
      </ScrollView>
    </SafeAreaView>
  );
}
