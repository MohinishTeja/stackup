import React, {useState, useEffect} from 'react';
import {ScrollView, RefreshControl, LogBox} from 'react-native';
import {Div} from 'react-native-magnus';
import {AccountExplorer, AccountActivity, AccountOverview} from '../components';
import {useInit} from '../hooks';
import Router from '../config/router';

export default function MainScreen({navigation}) {
  const [refreshing, setRefreshing] = useState(false);
  const init = useInit();

  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  }, []);

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
    <>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <Div px="lg" pt="xl" pb="lg">
          <AccountOverview
            onShowCoin={() =>
              navigation.navigate(Router.COIN_LIST, {saver: false})
            }
          />

          <AccountExplorer mt="xl" />
        </Div>
        <AccountActivity />
      </ScrollView>
    </>
  );
}
