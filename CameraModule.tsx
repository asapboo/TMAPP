import React, { useRef, useState, useCallback} from "react";
import {Image, StyleSheet, View, Text, ScrollView, Button, Dimensions, ActivityIndicator, TouchableOpacity} from 'react-native';
import { useCameraPermission, useCameraDevice, useCameraFormat, Camera, CameraProps} from "react-native-vision-camera";
import { abi } from "./abi";
import Premint from "./Premint";
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import Reanimated,  {
  useAnimatedProps,
  useSharedValue,
  withSpring,
} from "react-native-reanimated"
import Icon from "react-native-ionicons";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import RNFS from 'react-native-fs';

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    position: 'absolute',
    top: 100,
    right: 10,
  },
  button: {
    marginVertical: 5,
    backgroundColor: '#000',
    opacity: 0.7,
    width: 40, 
    height: 40,  
    borderRadius: 30, 
    alignItems: 'center',  
    justifyContent: 'center',  
  },
  buttonText: {
    fontSize: 24,
    color: '#fff',
  },  
});

const ReanimatedCamera = Reanimated.createAnimatedComponent(Camera)
Reanimated.addWhitelistedNativeProps({
  zoom: true,
})

const CameraModule = () => {
    const { hasPermission, requestPermission } = useCameraPermission();
    const device = useCameraDevice('back');
    const { width, height } = Dimensions.get('window');
    const [imageData, setImageData]= useState('');
    const [rawImageData, setRawImageData]= useState('');
    const [takePhoto, setTakePhoto] = useState(false);
    const [flashMode, setFlashMode] = useState('off');
    const camera = useRef<any>(null);
    const format = useCameraFormat(device, [
      { photoResolution: 'max' }
    ])
    const [showPremint, setShowPremint] = useState(false);
    const zoom = useSharedValue(0);

    const takePicture = async () => {
      if (camera != null) {
        const photo = await camera.current.takePhoto({
          flash: flashMode,
          qualityPrioritization: 'speed',
        });
        const imageAsBase64 = await RNFS.readFile(photo.path, 'base64');
        const imageAsBase64Url = toBase64Url(imageAsBase64);
        setImageData(imageAsBase64Url);
        setRawImageData(photo.path)
        setTakePhoto(true);
        console.log('Base64URL Image Data:', imageAsBase64Url);
      }
    };
    const toBase64Url = (base64: string) => {
      const urlSafeBase64 = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      return `data:image/jpeg;base64,${urlSafeBase64}`;
    };          

    const toggleFlash = () => {
      setFlashMode(flashMode === 'off' ? 'on' : 'off');
    };

    const tapToFocus = async () => {
      // Replace these with a gesturehandler x & y tap values
      await camera.current.focus({ x: camera, y: camera })
    }

    const zoomIn = () => {
      zoom.value = Math.min(zoom.value + 0.1, 1); // Max zoom level is 1
    };
    
    const zoomOut = () => {
      zoom.value = Math.max(zoom.value - 0.1, 0); // Min zoom level is 0
    };    

    const animatedProps = useAnimatedProps<Partial<CameraProps>>(
      () => ({ zoom: zoom.value }),
      [zoom]
    )  

    const savePhoto = async () => {
      try {
        if (camera.current) {
          const file = await camera.current.takePhoto();
          await CameraRoll.save(`file://${imageData}`, {
            type: 'photo',
          });
          console.log('Photo saved successfully');
        } else {
          console.error('Camera is not available');
        }
      } catch (error) {
        console.error('An error occurred while saving the photo:', error);
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
                        source={{ uri: "file://" + rawImageData }}
                        style={{ width: "80%", height: "60%" }}
                      />
                    )}
                    <View>
                        <TouchableOpacity
                        style={styles.button}
                        onPress={savePhoto}
                      >
                        <Text style={styles.buttonText}>+</Text>
                      </TouchableOpacity>
                    </View>
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
                      <Text>+++</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            ) : (
              <>
                <ReanimatedCamera
                  ref={camera}
                  style={{ width, height }}
                  device={device}
                  isActive={true}
                  photo={true}
                  animatedProps={animatedProps}
                />

                <TouchableOpacity
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 30,
                    backgroundColor: "#FFFFFF",
                    position: "absolute",
                    bottom: 50,
                    alignSelf: "center",
                  }}
                  onPress={takePicture}
                >
                </TouchableOpacity>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={toggleFlash}
                  >
                    <Text style={styles.buttonText}>
                      {flashMode === 'on' ? '⚡️' : '🌙'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={zoomIn}
                  >
                    <Text style={styles.buttonText}>+</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={zoomOut}
                  >
                    <Text style={styles.buttonText}>-</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        )}
      </View>
    );
  };

export default CameraModule;


