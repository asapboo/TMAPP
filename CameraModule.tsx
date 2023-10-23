Camera import React, { useRef, useState } from "react";
import {Image, StyleSheet, View, Text, ScrollView, Button, Dimensions, ActivityIndicator, TouchableOpacity} from 'react-native';
import { useCameraPermission, useCameraDevice, useCameraFormat, Camera} from "react-native-vision-camera";
import { abi } from "./abi";
import Premint from "./Premint";

const CameraModule = () => {
    const { hasPermission, requestPermission } = useCameraPermission();
    const device = useCameraDevice('back');
    const { width, height } = Dimensions.get('window');
    const [imageData, setImageData]= useState('');
    const [takePhoto, setTakePhoto] = useState(false);
    //const { hasPermission, requestPermission } = useMicrophonePermission()
    const camera = useRef<any>(null);
    const format = useCameraFormat(device, [
      { photoResolution: 'max' }
    ])
    const [showPremint, setShowPremint] = useState(false);

    const takePicture = async() => {
      if(camera!=null) {
        const photo = await camera.current.takePhoto();
        setImageData(photo.path)
        setTakePhoto(true);
        console.log(photo.path);
      }
    };

    console.log("hello camera is open")
    return (
      <View style={{ width, height }}>
        {device && (
          <View style={{ flex: 1 }}>
            {takePhoto ? (
              <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                {showPremint ? (
                  <Premint imageData={imageData} />
                ) : (
                  <>
                    {imageData !== "" && (
                      <Image
                        source={{ uri: "file://" + imageData }}
                        style={{ width: "80%", height: "60%" }}
                      />
                    )}
                    <TouchableOpacity
                      style={{
                        width: "90%",
                        height: 50,
                        borderWidth: 1,
                        alignSelf: "center",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      onPress={() => {
                        setTakePhoto(false);
                      }}
                    >
                      <Text>Retake</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        width: "90%",
                        height: 50,
                        borderWidth: 1,
                        alignSelf: "center",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      onPress={() => {
                        setShowPremint(true);
                      }}
                    >
                      <Text>Mint</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            ) : (
              <>
                <Camera
                  ref={camera}
                  style={{ width, height }}
                  device={device}
                  isActive={true}
                  photo={true}
                />
                <TouchableOpacity
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 30,
                    backgroundColor: "#FF0037",
                    position: "absolute",
                    bottom: 200,
                    alignSelf: "center",
                  }}
                  onPress={takePicture}
                ></TouchableOpacity>
              </>
            )}
          </View>
        )}
      </View>
    );
  };

export default CameraModule;

