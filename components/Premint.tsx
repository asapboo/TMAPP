import React, {
    useState,
    useCallback,
    SyntheticEvent,
    useEffect,
    ReactNode,
    useMemo,
  } from "react";

import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { PremintAPI } from "@zoralabs/premint-sdk";
import { Text, View, TouchableOpacity, StyleSheet, Linking, Image} from 'react-native';

const styles = StyleSheet.create({
    page: {
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,
      width: '100%',
      position: 'absolute',
      bottom: 0,
      height: '30%',
      alignItems: 'center',
    },
    minting: {
      top: '40%',
    },
    inactiveMinting: {
      top: '40%',
    },

    message: {
      fontSize: 18,
      fontWeight: 'bold',
      alignItems: 'center',
    },

    messageView: {
    },
    takePhoto: {
    },
    switch: {
    },
    zorb: {
    },
    tryAgain: {
      backgroundColor: 'black',
      borderRadius: 30,
      height: 30,
      width: 100,
      alignSelf: 'center',
      justifyContent: 'center',
    },
  });

  const successIcon = require("../public/successIcon.png");
  const errorIcon = require("../public/errorIcon.png");

const Premint = (props: { imageData: string, navigate: () => void }) => {
    const [mintContract, setMintContract] = useState("");
    const [uid, setUID] = useState("");
    const [minting, setMinting] = useState<null | string>(null);
    const [success, setSuccess] = useState<ReactNode | null>(null);
    const [failure, setFailure] = useState<ReactNode | null>(null);
    const { isConnected, address } = useAccount();
    const { data: walletClient, isError, isLoading } = useWalletClient()
    const publicClient = usePublicClient();
    const userAddress = useAccount();
    const [successfullyClipped, setSuccessfullyClipped] = useState(false);

    console.log("Premint Opened")

    useEffect(() => {
      if (props.imageData && !isLoading) {
        uploadImage();
      }
    }, [props.imageData, isLoading]);    

    useEffect(() => {
      if (successfullyClipped) {
        setTimeout(() => {
          props.navigate();
        }, 1000); // 1 second delay
      }
    }, [successfullyClipped]);    
    
    const processPremint = useCallback(
        async (url: string) => {
            if (!walletClient) {
            console.error("no walletclient");
            return;
            }
            const premintAPI: any = new PremintAPI(walletClient.chain);

            const premint = await premintAPI.createPremint({
            checkSignature: true,
            collection: {
                contractAdmin: address,
                contractName: "Camera Roll",
                contractURI:
                "ipfs://bafkreibhv77r5pijfaafx3vv6hphlira2kefouzrbhow2dzl7kornv5wcq",
            },
            publicClient,
            account: walletClient.account.address,
            walletClient,
            token: {
                tokenURI: url,
            },
            });
            console.log({ premint });
            return premint;
        },
        [publicClient, walletClient, mintContract, uid, isConnected]
        );

        const clearState = useCallback(() => {
        setFailure(null);
        setSuccess(null);
        setMinting(null);
        }, [setFailure, setSuccess, setMinting]);

        const uploadImage = useCallback(
            async () => {
              setFailure(null);
              setSuccess(null);
              const imageData = props.imageData;
        
              if (!walletClient) {
                console.error("Missing walletClient");
                setFailure("Missing walletClient");
                return;
              }
              
              setMinting(imageData);
              console.log('Sending request with imageData:', imageData);
              const response = await fetch("https://photo.automat.sh/api/store", {
                method: "POST",
                headers: {
                  "content-type": "application/json",
                  accept: "application/json",
                },
                body: JSON.stringify({
                  image: imageData,
                }),
              });
              //console.log('Received response:', response);
      
              if (response.status === 200) {
                console.log("loaded");
                setSuccess(
                  <View style={{flexDirection:'column', alignItems: 'center', justifyContent:'center'}}>
                    <View style={{flexDirection:'row', alignItems: 'center', paddingBottom: 30}}>
                      <Image
                              source={successIcon}
                              style={{ width: 30, height: 30, marginEnd: 5 }}
                        />
                      <Text style={styles.message}>Successfully Uploaded.</Text>
                    </View>
                      <Text style={styles.message}>Approve transaction...</Text>
                  </View>
                );
                const { url } = await response.json();
        
                try {
                  console.log({ url });
                  const { zoraUrl } = await processPremint(url);
                  setSuccessfullyClipped(true);
                  setSuccess(
                    <View style={{flexDirection:'row', alignItems: 'center', paddingBottom: 30}}>
                    <Image
                            source={successIcon}
                            style={{ width: 30, height: 30, marginEnd: 5 }}
                      />
                    <Text style={styles.message}>Successfully Clipped.</Text>
                  </View> 
                  );
                } catch (err: any) {
                  if (err.message === "Bad response: 403") {
                    setFailure(
                      <View style={{flexDirection:'row', alignItems: 'center', paddingBottom: 30}}>
                        <Text style={styles.message}>Mint failed. Your wallet needs to be verified on zora.co.</Text>
                      </View>
                    );
                  }
                  setFailure("Premint failed");
                  console.error(err);
                }
              } else {
                setFailure("Issue uploading");
                console.error(`Upload failed with status: ${response.status}`);
              }
            },
            [
              processPremint,
              walletClient,
              clearState,
              setFailure,
              setSuccess,
              props.imageData
            ]
          );
            
            return (
                <View style={styles.page}>
                  <View
                    style={[
                      styles.minting,
                      minting ? styles.inactiveMinting : null
                    ]}
                  >
                    {minting && !success && !failure && (
                      <View style={styles.messageView}>
                        <Text style={styles.message}>Uploading...</Text>
                      </View>
                    )}

                    {success && !failure && <Text>{success}</Text>}            

                    {failure && (
                      <View>
                        <View style={{flexDirection:'row', alignItems: 'center', paddingBottom: 30}}>
                          <Image
                            source={errorIcon}
                            style={{ width: 30, height: 30, marginEnd: 5 }}
                          />
                          <Text style={styles.message}>Error Uploading.</Text>
                        </View>
                            {/* minting */ minting && (
                              <TouchableOpacity style= {styles.tryAgain} onPress={() => uploadImage()}>
                                <Text style={{color: 'white', fontWeight: 'bold', alignSelf: 'center', fontSize: 16}}>Try again</Text>
                            </TouchableOpacity>
                        )}
                        </View>
                      )}
                  </View>
                </View>
              );
            };

export default Premint;

{/* 
 <TouchableOpacity 
                    style={styles.zorb}
                    onPress={() => {
                      if (address) {
                        const url = `https://zora.co/${address}`;
                        Linking.canOpenURL(url)
                          .then((supported) => {
                            if (supported) {
                              Linking.openURL(url);
                            } else {
                              console.log(`Ehh sorry ${url}`);
                            }
                          })
                          .catch((err) => console.error('An error occurred', err));
                      }
                    }}
                  >
                    <Text>View posts</Text>
                </TouchableOpacity>


                                   <View style={{flexDirection:'column', alignItems:'center'}}>
                    <View style={{flexDirection:'row', alignItems: 'center', paddingBottom: 30}}>
                      <Image
                              source={successIcon}
                              style={{ width: 30, height: 30, marginEnd: 5 }}
                        />
                      <Text style={styles.message}>Successfully Uploaded.</Text>
                    </View>
                      <Text>Approve transaction in wallet...</Text>
                  </View>   
              
*/}
