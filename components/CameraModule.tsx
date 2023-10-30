import React, { useRef, useState, useCallback} from "react";
import {Image, StyleSheet, View, Text, ScrollView, Button, Dimensions, ActivityIndicator, TouchableOpacity} from 'react-native';
import { useCameraPermission, useCameraDevice, useCameraFormat, Camera, CameraProps} from "react-native-vision-camera";
import Premint from "./Premint";
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import Reanimated,  {
  useAnimatedProps,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import RNFS from 'react-native-fs';

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    position: 'absolute',
    top: '22%',
    right: '10%',
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
    fontSize: 18,
    color: '#fff',
  },  
});

const ReanimatedCamera = Reanimated.createAnimatedComponent(Camera)
Reanimated.addWhitelistedNativeProps({
  zoom: true,
})

const zorbyIcon = require("../public/imgzorb.png");
const downloadIcon = require("../public/download.png");
const downloadedIcon = require("../public/downloaded.png");
const undoIcon = require("../public/undo.png");
const flashOn = require("../public/flashOn.png");
const flashOff = require("../public/flashOff.png");
const cameraSwitch = require("../public/switchCamera.png");

const CameraModule = () => {
  type CameraPosition = 'back' | 'front';

    const { hasPermission, requestPermission } = useCameraPermission();
    const [currentDevice, setCurrentDevice] = useState<CameraPosition>('back');
    const device = useCameraDevice(currentDevice);
    const { width, height } = Dimensions.get('window');
    const [imageData, setImageData]= useState('');
    const [savedPhoto, setSavedPhoto] = useState(false);
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

    const animatedProps = useAnimatedProps<Partial<CameraProps>>(
      () => ({ zoom: zoom.value }),
      [zoom]
    )  

    const savePhoto = async () => {
      try {
        await CameraRoll.save(`file://${rawImageData}`, {
          type: 'photo',
        });
        console.log('Photo saved successfully');
        setSavedPhoto(true);  // Set savedPhoto to true upon successful save
      } catch (error) {
        console.error('An error occurred while saving the photo:', error);
      }
    };          

    const toggleCameraDevice = () => {
      setCurrentDevice(currentDevice === 'back' ? 'front' : 'back');
    };
    
    console.log("hello camera is open")
    return (
      <View style={{ width, height, backgroundColor: 'black' }}>
        
        {device && (
          <View style={{ flex: 1 }}>
            {takePhoto ? (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                {showPremint ? (
                  <View style={{ 
                    position: 'absolute', 
                    bottom: 0, // Position it at the bottom
                    width: '100%', // Take full width
                    height: '30%' // Set the height to 30% of the parent view
                  }}>
                    <Premint imageData={imageData} />
                  </View>
                ) : (
                  <>
                    {imageData !== '' && (
                      <Image
                        source={{ uri: 'file://' + rawImageData }}
                        style={{ width: '80%', height: '60%' }}
                      />
                    )}
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingBottom: 100 }}>
                      <TouchableOpacity
                        style={{
                          width: 40,
                          height: 40,
                          justifyContent: 'center',
                          alignItems: 'center',
                          margin: 10, 
                          right: '30%',
                          position: 'absolute',
                        }}
                        onPress={savePhoto}
                      >
                       <Image 
                        source={savedPhoto ? downloadedIcon : downloadIcon}  
                        style={{ width: 30, height: 30 }}
                      />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{
                          width: 40,
                          height: 40,
                          justifyContent: 'center',
                          alignItems: 'center',
                          left: '30%',
                          margin: 10, 
                          position: 'absolute',
                        }}
                        onPress={() => setTakePhoto(false)}
                      >
                        <Image 
                          source={undoIcon}  
                          style={{ width: 30, height: 30 }}
                        />
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                      style={{
                        width: '90%',
                        height: 50,
                        borderWidth: 1,
                        borderColor: 'white',
                        alignSelf: 'center',
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'absolute',
                        top: '85%',
                      }}
                      onPress={() => setShowPremint(true)}
                    >
                      <Text style={{ color: 'white' }}>+++</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            ) : (
              <>
              
              <TouchableOpacity
                style={{
                  width: '90%',
                  height: 50,
                  borderWidth: 1,
                  borderColor: 'white',
                  alignSelf: 'center',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'absolute',
                  top: '10%',
                }}
              >
                <Text style={{ color: 'white' }}>Capture The Moment</Text>
              </TouchableOpacity>
              <View style={{ height: '60%', width: '90%', alignSelf: 'center', top: '20%' }}>
                <ReanimatedCamera
                  ref={camera}
                  style={{ height: '100%', width: '100%', backgroundColor: 'black' }}
                  //@ts-ignore
                  device={device}
                  isActive={true}
                  photo={true}
                  animatedProps={animatedProps}
                />
              </View>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={toggleFlash}
                  >
                  <Image 
                    source={flashMode === 'on' ? flashOn : flashOff}
                    style={{ width: 25, height: 25 }}
                  />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={toggleCameraDevice}
                  >
                    <Image 
                      source={cameraSwitch}
                      style={{ width: 25, height: 25 }}
                    />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={{
                    top: '10%',
                    alignSelf: 'center',
                  }}
                  onPress={takePicture}
                >
                  <Image source={zorbyIcon} style={{ width: 50, height: 50 }} />
                </TouchableOpacity>
              </>
            )}
          </View>
        )}
      </View>
    );    
};    

export default CameraModule;



