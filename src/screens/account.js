import React, {useState} from 'react';
import Clipboard from '@react-native-clipboard/clipboard';
import {Div, Icon, Snackbar, Text} from 'react-native-magnus';
import {useWalletStorage} from '../hooks';
import {
  SectionContainer,
  AccountAvatar,
  AccountAddress,
  RampNetworkDeposit,
} from '../components';

export default function AccountScreen({navigation}) {
  const [showOnRampInfo, setShowOnRampInfo] = useState(false);
  const {wallet} = useWalletStorage(set => ({
    wallet: set.wallet,
  }));
  this.snackbarRef = null;

  const onCopyPress = () => {
    Clipboard.setString(wallet?.address);
    this.snackbarRef.show('Address copied to clipboard', {
      duration: 2000,
      suffix: (
        <Icon
          name="checkcircle"
          color="white"
          fontSize="md"
          fontFamily="AntDesign"
        />
      ),
    });
  };

  return (
    <>
      <Div flex={1} p="xl">
        <Div rounded="md" bg="white" p="lg">
          <AccountAvatar mt="sm" />
          <AccountAddress mt="xl" onPress={onCopyPress} />
        </Div>
        <SectionContainer
          mt="xl"
          blueBorder
          title="💵 Fiat to crypto on-ramps"
          onInfoPress={() => setShowOnRampInfo(!showOnRampInfo)}>
          {showOnRampInfo && (
            <Div
              p="lg"
              rounded="md"
              borderWidth={1}
              bg="green100"
              borderColor="green500">
              <Text fontSize="lg" fontWeight="bold">
                🔛 What are on-ramps?
              </Text>
              <Text mt="md" fontSize="md" textAlign="justify">
                Stackup uses services like Ramp to offer the most efficient way
                for users to convert fiat money into crypto.
              </Text>
              <Text mt="md" fontSize="md" textAlign="justify">
                With on-ramps users don't have to go through the manual process
                of buying on exchange and transferring to their wallets.
              </Text>
            </Div>
          )}
          <RampNetworkDeposit mt={(showOnRampInfo && 'lg') || undefined} />
        </SectionContainer>
      </Div>
      <Div>
        <Snackbar
          ref={ref => (this.snackbarRef = ref)}
          bg="green700"
          color="white"
        />
      </Div>
    </>
  );
}
