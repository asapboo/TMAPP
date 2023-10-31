import React, { useRef, useState, useCallback} from "react";
import {Image, StyleSheet, View, Text, ScrollView, Button, Dimensions, ActivityIndicator, TouchableOpacity, Modal, Pressable, useColorScheme} from 'react-native';
import { useCameraPermission, useCameraDevice, useCameraFormat, Camera, CameraProps} from "react-native-vision-camera";
import Premint from "./Premint";
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import Reanimated,  {
  useAnimatedProps,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import RNFS from 'react-native-fs';
import {launchImageLibrary, MediaType} from 'react-native-image-picker';
import {useNavigation, ParamListBase } from '@react-navigation/native';
import {NativeStackNavigationProp } from '@react-navigation/native-stack';

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    position: 'absolute',
    top: '22%',
    right: '8%',
  },
  button: {
    marginVertical: 5,
    backgroundColor: 'black',
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
const imgPickerIcon = require("../public/imgPickerIcon.png");
const captureIcon = require("../public/captureIcon.png");

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
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();


    const toggleFlash = () => {
      setFlashMode(flashMode === 'off' ? 'on' : 'off');
    };

    const tapToFocus = async () => {
      await camera.current.focus({ x: camera, y: camera })
    } 

    const animatedProps = useAnimatedProps<Partial<CameraProps>>(
      () => ({ zoom: zoom.value }),
      [zoom]
    )  

    const toBase64Url = (base64: string) => {
      const urlSafeBase64 = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      return `data:image/jpeg;base64,${urlSafeBase64}`;
    };  

    const toggleCameraDevice = () => {
      setCurrentDevice(currentDevice === 'back' ? 'front' : 'back');
    };


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

    const openPhotos = async () => {
      const options = {
        selectionLimit: 1,
        mediaType: 'photo' as MediaType,
        //includeBase64: true,
      };

      const result = await launchImageLibrary(options);
      if (result.assets && result.assets[0].uri) {
        const imageAsBase64 = await RNFS.readFile(result.assets[0].uri, 'base64');
        const imageAsBase64Url = toBase64Url(imageAsBase64);
        
        setImageData(imageAsBase64Url);
        setRawImageData(result.assets[0].uri);
        setTakePhoto(true);
      }
    };

    const navigateHome = () => {
      navigation.navigate('Tabs');
    };

    const navigateFeed = () => {
      navigation.navigate("Tabs", { screen: "Home" });
    };
    
    console.log("hello camera is open")

    return (
      <View style={{ width, height, backgroundColor: 'black' }}>
        <Text style={{ color: 'white', fontWeight:'bold', fontSize:18, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', position: 'absolute', top: '10%', }}>Create</Text>
        <TouchableOpacity
          style={{
            left: '7%',
            top: '10%',
          }}
          onPress={navigateFeed}
        >
          <Text style={{ color: 'white' }}>Cancel</Text>
        </TouchableOpacity>
    
        {device && (
          <View style={{ flex: 1 }}>
            {takePhoto ? (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                {showPremint ? (
                  <Modal
                    animationType="slide"
                    transparent={true}
                    visible={showPremint}>
                    <Premint imageData={imageData} navigate={navigateFeed} /> 
                    <TouchableOpacity style={{position:'absolute', top: '72%', right: '5%'}} onPress={() => setShowPremint(false)}>
                          <Text style={{color: 'black'}}>X</Text>
                    </TouchableOpacity>
                  </Modal>
                ) : null}
                    <Image
                      source={{ uri: 'file://' + rawImageData }}
                      style={{ width: '90%', height: '60%', borderRadius: 30 }}
                    />
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'relative',
                        bottom: '7%',
                      }}
                    >
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
                        <Image source={undoIcon} style={{ width: 30, height: 30 }} />
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                      style={{
                        width: '50%',
                        height: 50,
                        borderWidth: 1,
                        borderColor: 'black',
                        alignSelf: 'center',
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'absolute',
                        backgroundColor: 'white',
                        top: '85%',
                        borderRadius: 30,
                      }}
                      onPress={() => setShowPremint(true)}
                    >
                      <Text style={{ color: 'black', fontSize:16, fontWeight:'bold' }}>Clip</Text>
                    </TouchableOpacity>
              </View>
            ) : (
              <>
                <TouchableOpacity onPress={openPhotos} style={{ left: '20%', top: '85%' }}>
                  <Image source={imgPickerIcon} style={{ width: 40, height: 40 }} />
                </TouchableOpacity>
                <View style={{ height: '60%', width: '90%', alignSelf: 'center', top: '15%', borderRadius: 30, overflow: 'hidden'}}>
                  <ReanimatedCamera
                    ref={camera}
                    style={{ height: '100%', width: '100%', backgroundColor: 'black'}}
                    //@ts-ignore
                    device={device}
                    isActive={true}
                    photo={true}
                    animatedProps={animatedProps}
                  />
                </View>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.button} onPress={toggleFlash}>
                    <Image
                      source={flashMode === 'on' ? flashOn : flashOff}
                      style={{ width: 25, height: 25 }}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.button} onPress={toggleCameraDevice}>
                    <Image source={cameraSwitch} style={{ width: 25, height: 25 }} />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={{
                    top: '20%',
                    alignSelf: 'center',
                  }}
                  onPress={takePicture}
                >
                  <Image source={captureIcon} style={{ width: 65, height: 65 }} />
                </TouchableOpacity>
              </>
            )}
          </View>
        )}
      </View>
    );
};    

export default CameraModule;



