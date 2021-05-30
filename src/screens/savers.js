import React, {useState} from 'react';
import {ScrollView, RefreshControl} from 'react-native';
import {Div, Fab} from 'react-native-magnus';
import {useInit} from '../hooks';
import {AccountOverview, SaversOverview} from '../components';
import Router from '../config/router';

export default function SaversScreen({navigation}) {
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
    <>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <Div flex={1} p="xl">
          <AccountOverview
            savers
            onShowCoin={() =>
              navigation.navigate(Router.COIN_LIST, {saver: true})
            }
          />
          <SaversOverview
            mt="3xl"
            onShowYields={() => navigation.navigate(Router.YIELDS_LIST)}
          />
        </Div>
      </ScrollView>
      <Fab p="lg" shadow="xs" fontSize="4xl" onPress={() => {}} />
    </>
  );
}
