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
import { Text, View, TouchableOpacity, StyleSheet, Linking } from 'react-native';

const styles = StyleSheet.create({
    page: {
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,
      width: '100%',
      position: 'absolute',
      bottom: 0,
      height: 200,
      alignItems: 'center',
    },
    minting: {
    },
    inactiveMinting: {
    },
    message: {
    },
    takePhoto: {
    },
    switch: {
    },
    zorb: {
    }
  });

const Premint = (props: { imageData: string }) => {
    const [mintContract, setMintContract] = useState("");
    const [uid, setUID] = useState("");
    const [minting, setMinting] = useState<null | string>(null);
    const [success, setSuccess] = useState<ReactNode | null>(null);
    const [failure, setFailure] = useState<ReactNode | null>(null);
    const [hasMultipleDevices, setHasMultipleDevices] = useState(false);
    const { isConnected, address } = useAccount();
    //var data = await sdk.wallet.IsConnected(); - thirdweb call
    const { data: walletClient, isError, isLoading } = useWalletClient()
    const publicClient = usePublicClient();
    const userAddress = useAccount();
    

    console.log("Premint Opened")

    useEffect(() => {
      if (props.imageData && !isLoading) {
        uploadImage();
      }
    }, [props.imageData, isLoading]);    

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
                  <View>
                    <Text>Uploaded...</Text>
                    <Text>sign mint in wallet</Text>
                  </View>
                );
                const { url } = await response.json();
        
                try {
                  console.log({ url });
                  const { zoraUrl } = await processPremint(url);
                  setSuccess(
                    <View>
                      <Text>Minted 🎉</Text>
                      <Text>
                        📸 view on ZORA
                      </Text>
                      <TouchableOpacity onPress={() => clearState()}>
                        <Text>📷 take another...</Text>
                      </TouchableOpacity>
                    </View>
                  );
                } catch (err: any) {
                  if (err.message === "Bad response: 403") {
                    setFailure(
                      <View>
                        <Text>Mint failed. Your wallet needs to be verified on zora.co.</Text>
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
                      <View style={styles.message}>
                        <Text>☁☁️☁️️ uploading ☁️☁️☁</Text>
                      </View>
                    )}
                    {success && !failure && <View style={styles.message}>{success}</View>}
                    {failure && (
                      <View style={styles.message}>
                        <Text>{failure}</Text>
                        {minting && (
                          <TouchableOpacity onPress={() => uploadImage()}>
                            <Text>↭ try again ↭</Text>
                          </TouchableOpacity>
                        )}
                        <TouchableOpacity onPress={() => clearState()}>
                          <Text>take another</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                  <View style={styles.takePhoto}>
                  </View>
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
                </View>
              );
            };

export default Premint;
