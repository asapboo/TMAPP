import React from 'react';
import {StyleSheet, Text, useColorScheme, View, Button, FlatList, TouchableOpacity, Image} from 'react-native';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation, NavigationContainer, ParamListBase } from '@react-navigation/native';

const cameraIcon = require("./public/camera.png");

const data = [{ type: 'camera' }, { type: 'text' }, { type: 'text' }, { type: 'text' }];

const Create = () => {
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
    return (
        <View style={styles.view}>
          <View style={{ position: 'absolute'}}>
            <FlatList
              data={data}
              numColumns={2}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  style={styles.appContainer}
                  onPress={() => {
                    if (item.type === 'camera') {
                      navigation.navigate("Camera");
                    }
                  }}
                >
                  {item.type === 'camera' ? (
                    <Image 
                    source={cameraIcon}  // Replace this URI with the actual path
                    style={{ width: 40, height: 40 }}
                    />
                  ) : (
                    <Text>Camera</Text>
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
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

export default Create;
