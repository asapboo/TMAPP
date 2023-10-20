import React from "react";
import {Image, StyleSheet, View, Text, ScrollView, Button, Dimensions} from 'react-native';
import { useCameraPermission, useCameraDevice } from "react-native-vision-camera";
import { Camera } from "react-native-vision-camera";

const CameraModule = () => {
    const { hasPermission, requestPermission } = useCameraPermission();
    const device = useCameraDevice('back');
    const { width, height } = Dimensions.get('window');
    //const { hasPermission, requestPermission } = useMicrophonePermission()
    console.log("hello camera is open")
    return (
        <View>
       {device && (
          <Camera
            style={{ width: 200, height: 200 }}
            device={device}
            isActive={true}
          />
        )}
        </View>
    );
}

export default CameraModule;
