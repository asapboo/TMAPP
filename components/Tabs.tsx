import React from 'react';
import {StyleSheet, Text, useColorScheme, View, Button, FlatList, TouchableOpacity, Image} from 'react-native';
import Welcome from './Welcome';
import Feed from './Feed';
import Create from './Create';
import Profile from './Profile';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import CameraModule from './CameraModule';
import { useNavigation, NavigationContainer, ParamListBase } from '@react-navigation/native';
import { createConfig, configureChains, WagmiConfig, useAccount} from "wagmi";
import { createWeb3Modal, defaultWagmiConfig, Web3Modal, W3mButton } from '@web3modal/wagmi-react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { trigger } from "react-native-haptic-feedback";

const hapticOptions = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

const addIcon = require("../public/plusIcon.png");
const homeIcon = require("../public/home.png");
const zorbyIcon = require("../public/imgzorb.png");

const Tab = createBottomTabNavigator();

const Tabs = () => {
  const { isConnected, address } = useAccount();
  const Stack = createNativeStackNavigator();
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          elevation: 0,
          backgroundColor: 'black',
          height: 80,
        },
        tabBarIcon: () => null, // Make icons invisible
      }}
    >
      {isConnected ? (
        <>
          <Tab.Screen
            name="Home"
            component={Feed}
            options={{
              header: () => (
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 100, width: '100%', backgroundColor: 'black', paddingTop: 30 }}>
                  <View style={{ width: '33%' }}> 
                  </View>
                  <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold', width: '33%', textAlign: 'center' }}>
                    +++
                  </Text>
                  <View style={{ width: '33%', alignItems: 'flex-end', paddingRight: 10 }}>
                    <W3mButton />
                  </View>
                </View>
              ),              
              headerShown: true,
              tabBarIcon: ({ focused }) => (
                <View style={{
                  borderRadius: 25,  // Make it round
                  backgroundColor: focused ? 'rgba(255, 255, 255, 0.3)' : 'transparent',  // 30% opacity white background if focused
                  width: 50,
                  height: 30,
                  justifyContent: 'center',  // Center the image
                  alignItems: 'center'
                }}>
                  <Image 
                    source={homeIcon}  // Replace this URI with the actual path
                    style={{ width: 25, height: 25 }}
                  />
                </View>
              ),
              tabBarLabel: () => null,
            }}
          />            

          <Tab.Screen name="Create" component={CameraModule} options={{
              header: () => (
                //Split this component out into a tab header once we have usernames
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', height: 100, width: '100%', backgroundColor: 'black'}}>
                  <Web3Modal />
                  <View style={{top: 20, right: 10}}>
                  <W3mButton/>
                  </View>
                </View>
              ),
              headerShown: false,
              tabBarIcon: ({ focused }) => (
                <View style={{
                  borderRadius: 25,  // Make it round
                  backgroundColor: focused ? 'rgba(255, 255, 255, 0.3)' : 'transparent',  // 30% opacity white background if focused
                  width: 50,
                  height: 30,
                  justifyContent: 'center',  // Center the image
                  alignItems: 'center'
                }}>
                  <Image 
                    source={addIcon}  // Replace this URI with the actual path
                    style={{ width: 25, height: 25 }}
                  />
                </View>
              ),
              tabBarLabel: () => null,
              tabBarStyle: { height: 0, display: 'none' }
            }}
          />

          <Tab.Screen name="Profile" component={Profile} options={{
              header: () => (
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 100, width: '100%', backgroundColor: 'black', paddingTop: 30 }}>
                <View style={{ width: '33%' }}> 
                </View>
                <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold', width: '33%', textAlign: 'center' }}>
                  +++
                </Text>
                <View style={{ width: '33%', alignItems: 'flex-end', paddingRight: 10 }}>
                  <W3mButton />
                </View>
              </View>
              ),
              headerShown: true,
              tabBarIcon: ({ focused }) => (
                <View style={{
                  borderRadius: 25,  // Make it round
                  backgroundColor: focused ? 'rgba(255, 255, 255, 0.3)' : 'transparent',  // 30% opacity white background if focused
                  width: 50,
                  height: 30,
                  justifyContent: 'center',  // Center the image
                  alignItems: 'center'
                }}>
                  <Image 
                    source={zorbyIcon}  // Replace this URI with the actual path
                    style={{ width: 25, height: 25 }}
                  />
                </View>
              ),
              tabBarLabel: () => null,
            }}
          />

        </>
      ) : (
        <Tab.Screen
          name="Welcome"
          component={Welcome}
          options={{
            tabBarIcon: () => null,
            tabBarLabel: () => null,
            tabBarButton: () => null,
            tabBarStyle: { display: 'none' },
          }}
        />
      )}
    </Tab.Navigator>
  );
};

export default Tabs;