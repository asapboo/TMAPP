import { useAddress, useContract, useNFT, useNFTBalance, Web3Button, useSwitchChain } from "@thirdweb-dev/react-native";
import React from "react";
import {Image, StyleSheet, View, Text, ScrollView, Button} from 'react-native';
import { Zora } from "@thirdweb-dev/chains";
import {abi} from "./abi"

const NFT = () => {
    const address = useAddress();
    const contractAddress = "0x020F79e26D59293f06097bA4216ED43f7a0C8fdD";
    const {contract} = useContract(contractAddress, abi);
    const switchChain = useSwitchChain();

    const { data: nft} = useNFT(contract, 1);
    const { data: nftBalance, isLoading} = useNFTBalance(contract, address, 0);
    const nftImage = nft?.metadata.image;
    
    return (
    <ScrollView>
        <Button title="hello" onPress={() => switchChain(Zora.chainId)}></Button>
        <View>
            <Text>{nft?.metadata.name}</Text>
            <Image source={{uri: nftImage?.toString(),}}/>
            <Text>
                <Text>You own:</Text>
                <Text>{isLoading ? ( 'loading' ) : ( nftBalance?.toString () )}</Text>
            </Text>
            <Web3Button contractAddress={contractAddress} action={(contract) => contract.erc1155.claim(0,1)}>MINT</Web3Button>
        </View>
        <View>
            <Text>Description:</Text>
            <Text>{nft?.metadata.description}</Text>
        </View>
    </ScrollView>
    );
}

export default NFT;