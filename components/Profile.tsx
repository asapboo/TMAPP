import React from 'react';
import {StyleSheet, Text, useColorScheme, View, Button, FlatList, TouchableOpacity, Image} from 'react-native';
import { createConfig, configureChains, WagmiConfig, useAccount} from "wagmi";
import { useOwnedNFTs, useContract, useAddress } from "@thirdweb-dev/react-native";
import NFT from './NFT';

const Profile = () => {

    const { isConnected, address } = useAccount();
    const contractAddress = "0x7183209867489E1047f3A7c23ea1Aed9c4E236E8";

    const { contract } = useContract(contractAddress);
    const { data, isLoading, error } = useOwnedNFTs(contract, address);

    if (isLoading) {
        return <Text>Loading...</Text>;
      }
    
      if (error) {
        return <Text>Error</Text>;
      }
    
      return (
        <View>
          <FlatList
            data={data}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <Text>{NFT.name}</Text>  // Assuming 'name' exists on each NFT object
            )}
          />
        </View>
      );
    };

export default Profile;
