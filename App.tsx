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
import {StyleSheet, Text, useColorScheme, View, Button, FlatList, TouchableOpacity} from 'react-native';
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
import { createConfig, configureChains, WagmiConfig, useAccount} from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { InjectedConnector } from "wagmi/connectors/injected";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { zora, zoraTestnet, mainnet } from "viem/chains";
import { createWeb3Modal, defaultWagmiConfig, Web3Modal, W3mButton } from '@web3modal/wagmi-react-native';
import Icon from 'react-native-ionicons';

const projectId = '3af6ea7020bb377913511bbd825b0d2d'

const metadata = {
  name: 'ZORA+',
  description: 'A hyper-exploration app.',
  url: 'https://zoraplus.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
  redirect: {
    native: 'YOUR_APP_SCHEME://',
    universal: 'YOUR_APP_UNIVERSAL_LINK.com'
  }
}

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [zora, mainnet],
  [publicProvider()],
)

const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });

createWeb3Modal({ 
  projectId,
  chains,
  wagmiConfig
})

{/*}
const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
})
*/}

const App = () => {
  return (
    <NavigationContainer>
      <WagmiConfig config={wagmiConfig}>
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
      </WagmiConfig>
    </NavigationContainer>
  );
};

const AppInner = () => {
  const Stack = createNativeStackNavigator();
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  return (
    <Stack.Navigator>
        <Stack.Screen
          name="ZORA+"
          component={AppInnerMost}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Home2" component={NFT} />
        <Stack.Screen name="Capture" component={CameraModule} options={{ headerShown: false }} />
      </Stack.Navigator>
  );
};

const AppInnerMost = () => {
  const { isConnected, address } = useAccount();
  const isDarkMode = useColorScheme() === 'dark';
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const data = [{ type: 'camera' }, { type: 'text' }, { type: 'text' }, { type: 'text' }];

  const textStyles = {
    //color: isDarkMode ? Colors.white : Colors.black,
    ...styles.heading,
  };

  return (
    <View style={styles.view}>
      {!isConnected && (
        <View style={{ alignItems: 'center' }}>
          <Text style={textStyles}>ZORA+</Text>
          <Text style={{...textStyles, fontSize: 14}}>+++ sign up, create, earn +++</Text>
        </View>
      )}

      <View style={{ top: 100 }}>
        <Web3Modal />
        <W3mButton />
      </View>

      {isConnected && (
        <View style={styles.centeredContainer}>
          <FlatList
            data={data}
            numColumns={2}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.appContainer}
                onPress={() => {
                  if (item.type === 'camera') {
                    navigation.navigate("Capture");
                  }
                }}
              >
                {item.type === 'camera' ? (
                  <Text>📸</Text>
                ) : (
                  <Text>Text App</Text>
                )}
              </TouchableOpacity>
            )}
          />
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
    backgroundColor: 'black',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
  },
  appContainer: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  centeredContainer: {
    top: '20%',
  },
});

export default App;


{/* <ThirdwebProvider
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
      </ThirdwebProvider> */}
