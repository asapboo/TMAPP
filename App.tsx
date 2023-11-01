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
  Web3Button,
} from '@thirdweb-dev/react-native';
import React from 'react';
import { Zora, Ethereum } from "@thirdweb-dev/chains";
import { useNavigation, NavigationContainer, ParamListBase } from '@react-navigation/native';
import { createConfig, configureChains, WagmiConfig, useAccount} from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { zora, zoraTestnet, mainnet } from "viem/chains";
import { createWeb3Modal, defaultWagmiConfig, Web3Modal, W3mButton } from '@web3modal/wagmi-react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import Welcome from './components/Welcome';

const projectId = '3af6ea7020bb377913511bbd825b0d2d'

const metadata = {
  name: 'TMAPP',
  description: 'meep',
  url: 'https://toymakers.fun',
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

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <WagmiConfig config={wagmiConfig}>
        <Stack.Navigator>
          <Stack.Screen name="Camera" component={Welcome} options={{ headerShown: false }} />
        </Stack.Navigator>
      </WagmiConfig>
    </NavigationContainer>
  );
};

export default App;