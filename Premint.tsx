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
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    page: {
      // Add your styles here
    },
    minting: {
      // Add your styles here
    },
    inactiveMinting: {
      // Add your styles here
    },
    message: {
      // Add your styles here
    },
    takePhoto: {
      // Add your styles here
    },
    switch: {
      // Add your styles here
    },
    zorb: {
      // Add your styles here
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
    const { data: walletClient } = useWalletClient();
    const publicClient = usePublicClient();

    console.log("Premint Opened")

    useEffect(() => {
      // Only trigger uploadImage when imageData is present
      if (props.imageData) {
        uploadImage();
      }
    }, [props.imageData]);

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
              const imageData = props.imageData; // <-- get imageData from props
        
              if (!walletClient) {
                console.error("Missing walletClient");
                setFailure("Missing walletClient");
                return;
              }
              
              setMinting(imageData);
              
              const response = await fetch("/api/store", {
                method: "POST",
                headers: {
                  "content-type": "application/json",
                  accept: "application/json",
                },
                body: JSON.stringify({
                  image: imageData,
                }),
              });
        
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
                          <Text>fauhgeddaboudit – 📸 another</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                  <View style={styles.takePhoto}>
                    <TouchableOpacity
                      onPress={() => {
                        // Your take photo logic here
                      }}
                    >
                      <Text>📸 Take Photo</Text>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity style={styles.zorb}>
                    <Text>View posts</Text>
                  </TouchableOpacity>
                </View>
              );
            };

export default Premint;
