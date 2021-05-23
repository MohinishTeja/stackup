import React, {useState} from 'react';
import {ScrollView, RefreshControl} from 'react-native';
import {Div} from 'react-native-magnus';
import {useInit} from '../hooks';
import {AccountBalance, AaveReserveOverview} from '../components';

export default function EarnScreen({navigation}) {
  const [refreshing, setRefreshing] = useState(false);
  const init = useInit();

  const onRefresh = async () => {
    try {
      setRefreshing(true);

      await init();
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <Div flex={1} p="xl">
        <AccountBalance stakedTokens />
        <AaveReserveOverview mt="xl" />
      </Div>
    </ScrollView>
  );
}
