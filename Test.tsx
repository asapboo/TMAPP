import React from "react";
import {Image, StyleSheet, View, Text, ScrollView, Button, Dimensions} from 'react-native';
import { useCameraPermission, useCameraDevice } from "react-native-vision-camera";
import { Camera } from "react-native-vision-camera";

const Test = () => {
    console.log("hello test opened.")
    return (
        <View style={{ flex: 1 }}>
            <Text>hello this is test component</Text>
            <Text>hello this is test component</Text>
            <Text>hello this is test component</Text>
            <Text>hello this is test component</Text>
            <Text>hello this is test component</Text>
            <Text>hello this is test component</Text>
            <Text>hello this is test component</Text>
            <Text>hello this is test component</Text>
            <Text>hello this is test component</Text>
            <Text>hello this is test component</Text>
            <Text>hello this is test component</Text>
        </View>
    );
}

export default Test;
