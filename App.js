import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {AppRegistry} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {ThemeProvider} from 'react-native-magnus';
import Router from './src/config/router';
import StartScreen from './src/screens/start';
import SettingsScreen from './src/screens/settings';
import ImportHDWalletScreen from './src/screens/importHDWallet';
import CreateHDWalletScreen from './src/screens/createHDWallet';
import MainScreen from './src/screens/main';
import {useWalletStorage} from './src/hooks';

const Stack = createStackNavigator();

export default function Main() {
  const {wallet, getWallet} = useWalletStorage(set => ({
    wallet: set.wallet,
    getWallet: set.getWallet,
  }));

  useEffect(async () => {
    await getWallet();
  }, []);

  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator>
            {Boolean(wallet) ? (
              <>
                <Stack.Screen
                  name={Router.MAIN}
                  component={MainScreen}
                  options={{headerShown: false, title: 'Home'}}
                />
                <Stack.Screen
                  name={Router.SETTINGS}
                  component={SettingsScreen}
                  options={{title: 'Settings'}}
                />
              </>
            ) : (
              <>
                <Stack.Screen
                  name={Router.START}
                  component={StartScreen}
                  options={{headerShown: false}}
                />
                <Stack.Screen
                  name={Router.IMPORT_HD_WALLET}
                  component={ImportHDWalletScreen}
                  options={{title: 'Import Wallet'}}
                />
                <Stack.Screen
                  name={Router.CREATE_HD_WALLET}
                  component={CreateHDWalletScreen}
                  options={{title: 'Create Wallet'}}
                />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}

AppRegistry.registerComponent('main', () => Main);
