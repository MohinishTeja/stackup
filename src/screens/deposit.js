import React from 'react';
import Clipboard from '@react-native-clipboard/clipboard';
import {Div, Icon, Snackbar} from 'react-native-magnus';
import {useWalletStorage} from '../hooks';
import {
  SectionContainer,
  AccountAvatar,
  AccountAddress,
  RampNetworkDeposit,
} from '../components';

export default function DepositScreen({navigation}) {
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
        <SectionContainer mt="xl" blueBorder title="💵 Fiat to crypto">
          <RampNetworkDeposit />
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
