import React from 'react';
import {StyleSheet, Text, useColorScheme, View, Button, FlatList, TouchableOpacity, Image} from 'react-native';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation, NavigationContainer, ParamListBase } from '@react-navigation/native';
import { useAccount} from "wagmi";
import { Web3Modal, W3mButton } from '@web3modal/wagmi-react-native';
import { trigger } from "react-native-haptic-feedback";

const Welcome = () => {
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

  export default Welcome;
