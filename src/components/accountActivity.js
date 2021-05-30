import React from 'react';
import {SectionList, Linking} from 'react-native';
import {PressableOpacity} from 'react-native-pressable-opacity';
import {InAppBrowser} from 'react-native-inappbrowser-reborn';
import {Div, Text, Skeleton, Tag} from 'react-native-magnus';
import dayjs from 'dayjs';
import {useWalletStorage, useAccount} from '../hooks';
import {startAndEnd} from '../utils/formatHelpers';
import {ethers} from '../lib/ethers';

export const AccountActivity = props => {
  const {walletLoading, wallet} = useWalletStorage(set => ({
    walletLoading: set.loading,
    wallet: set.wallet,
  }));
  const {maticLoading, transactions} = useAccount(set => ({
    maticLoading: set.loading,
    transactions: set.transactions,
  }));
  const loading = walletLoading || maticLoading;

  const onRowPress = async tx => {
    try {
      const url = `${Network.MATIC.EXPLORER_URL}/tx/${tx}`;
      if (await InAppBrowser.isAvailable()) {
        await InAppBrowser.open(url);
      } else Linking.openURL(url);
    } catch (error) {
      console.error(error);
    }
  };

  const renderHeader = ({section: {date}}) => {
    return (
      <Div px="lg" py="md" bg="white">
        <Text fontSize="lg" fontWeight="500">
          {dayjs(date).format('MMM D, YYYY')}
        </Text>
      </Div>
    );
  };

  const renderRow = ({item}) => {
    const isOutbound =
      item.from_address.toLowerCase() === wallet?.address.toLowerCase();
    const direction = isOutbound ? 'To ' : 'From ';
    const address = isOutbound
      ? startAndEnd(item.to_address)
      : startAndEnd(item.from_address);
    const color = isOutbound ? 'black' : 'green500';
    const sign = isOutbound ? '' : '+ ';
    const status = isOutbound ? 'OUT' : 'IN';

    return (
      <PressableOpacity onPress={() => onRowPress(item.tx_hash)}>
        <Div row px="lg" py="md">
          <Tag
            fontSize="sm"
            w={52}
            bg="transparent"
            borderWidth={1}
            borderColor={color}>
            {status}
          </Tag>
          <Div flex={1} ml="lg">
            <Div row>
              <Text fontSize="lg">{direction}</Text>
              <Text
                fontSize="lg"
                fontWeight="bold"
                ellipsizeMode="tail"
                numberOfLines={1}>
                {address}
              </Text>
            </Div>
            <Text mt="sm" fontSize="sm" color="gray700" fontWeight="500">
              {dayjs(item.block_signed_at).format('h:mm A')}
            </Text>
          </Div>
          <Div flex={1} ml="lg" alignItems="flex-end">
            <Text
              fontSize="lg"
              fontWeight="500"
              color={color}
              ellipsizeMode="tail"
              numberOfLines={1}>
              {`${sign}${ethers.utils.commify(item.value)} ${item.symbol}`}
            </Text>
          </Div>
        </Div>
      </PressableOpacity>
    );
  };

  const renderHeaderLoader = () => {
    return (
      <Div p="md" bg="white">
        <Skeleton.Box w="30%" />
      </Div>
    );
  };

  const renderRowLoader = () => {
    return (
      <Div row px="lg" mt="lg">
        <Skeleton h={32} w={32} />
        <Div ml="sm" flex={1}>
          <Skeleton.Box mt="sm" />
          <Skeleton.Box mt="sm" w="25%" />
        </Div>
        <Div flex={1}>
          <Skeleton.Box mt="sm" w="25%" alignSelf="flex-end" />
        </Div>
      </Div>
    );
  };

  return (
    <Div {...props}>
      {loading ? (
        <>
          <Div>
            {renderHeaderLoader()}
            {renderRowLoader()}
            {renderRowLoader()}
            {renderRowLoader()}
          </Div>
          <Div mt="xl">
            {renderHeaderLoader()}
            {renderRowLoader()}
            {renderRowLoader()}
          </Div>
        </>
      ) : (
        <SectionList
          sections={transactions}
          keyExtractor={(item, index) => `${item.tx_hash}_${index}`}
          renderItem={renderRow}
          renderSectionHeader={renderHeader}
        />
      )}
    </Div>
  );
};
