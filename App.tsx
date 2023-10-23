import {
  ConnectWallet,
  localWallet,
  metamaskWallet,
  rainbowWallet,
  ThirdwebProvider,
  trustWallet,
  useAddress,
  walletConnect,
  useSwitchChain,
} from '@thirdweb-dev/react-native';
import React from 'react';
import {StyleSheet, Text, useColorScheme, View, Button} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {TW_CLIENT_ID} from '@env';
import NFT from './NFT';
import Test from './Test';
//import CameraModule from './Camera';
import { Zora, Ethereum } from "@thirdweb-dev/chains";
import { useCameraPermission, useCameraDevice } from "react-native-vision-camera";
import { Camera } from 'react-native-vision-camera';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import CameraModule from './CameraModule';
import { useNavigation, NavigationContainer, ParamListBase } from '@react-navigation/native';

const App = () => {
  return (
    <NavigationContainer>
      <ThirdwebProvider
        activeChain={Zora}
        //NEXT_PUBLIC_ prefix for NEXT.js
        clientId={process.env.TW_CLIENT_ID} // uncomment this line after you set your clientId in the .env file
        supportedWallets={[
          metamaskWallet(),
          rainbowWallet(),
          walletConnect(),
          trustWallet(),
          localWallet(),
        ]}>
        <AppInner />
      </ThirdwebProvider>
    </NavigationContainer>
  );
};

const AppInner = () => {
  const Stack = createNativeStackNavigator();
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  return (
    <Stack.Navigator>
        {/* May not need this */}
        <Stack.Screen name="Home" component={AppInnerMost} />
        <Stack.Screen name="Home2" component={NFT} />
        <Stack.Screen name="Camera" component={CameraModule} />
      </Stack.Navigator>
  );
};

const AppInnerMost = () => {
  const address = useAddress();
  const isDarkMode = useColorScheme() === 'dark';
  const switchChain = useSwitchChain();

  const textStyles = {
    color: isDarkMode ? Colors.white : Colors.black,
    ...styles.heading,
  };

  return (      
    <View style={styles.view}>
      <Text style={textStyles}>ZORA+</Text>
      <ConnectWallet />
      {!address ? ( 
        <Text> Please connect wallet to begin</Text>
      ) : ( 
        <View>
          {/*<CameraModule />*/}
          <NFT/>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default App;
