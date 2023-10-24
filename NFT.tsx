import { useAddress, useContract, useContractWrite, useNFT, useNFTBalance, Web3Button, useSwitchChain } from "@thirdweb-dev/react-native";
import React from "react";
import { useEffect } from "react";
import {Image, StyleSheet, View, Text, ScrollView, Button} from 'react-native';
import { Zora } from "@thirdweb-dev/chains";
import {abi} from "./abi"
import { useNavigation, NavigationContainer, ParamListBase } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CameraModule from './CameraModule';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

const NFT = () => {
    const address = useAddress();
    const contractAddress = "0xf032D92A685fbCD4420E437B7903Ed866Be04b87";
    const {contract} = useContract(contractAddress);
    const switchChain = useSwitchChain();
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

    const { data: nft} = useNFT(contract, 1);
    const { data: nftBalance, isLoading} = useNFTBalance(contract, address, 0);
    const nftImage = nft?.metadata.image;

    {/*}
    const { mutateAsync, ismintLoading, error } = useContractWrite(
        contract,
        "mintWithRewards",
      );
    */}

    return (
    <ScrollView>
        {/*<Button title="hello" onPress={() => switchChain(Zora.chainId)}></Button>*/}
        <View style={{ paddingTop: 20 }}>
            <Text>NFT: {nft?.metadata.name}</Text>
            <Image source={{uri: nftImage?.toString(),}}/>
        </View>
        <View>
            <Text>NFT Description:</Text>
            <Text>{nft?.metadata.description}</Text>
        </View>
        <View style={{ paddingTop: 20 }}>
        <Text>
            <Text>You own:</Text>
            <Text>{isLoading ? ( 'loading' ) : ( nftBalance?.toString () )}</Text>
        </Text>
        {/*  action={() => mutateAsync({ args: ["My Name"] })}} */}
        {/*<Web3Button contractAddress={contractAddress} action={(contract) => contract.call("mintWithRewards",)}>MINT</Web3Button>*/}
        </View>
        <Button title="Open Camera" onPress={() => navigation.navigate("Camera")} />
    </ScrollView>
    );
}

export default NFT;