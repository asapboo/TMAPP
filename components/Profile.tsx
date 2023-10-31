import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Linking, StyleSheet, RefreshControl } from 'react-native';
import { useAccount } from 'wagmi';

interface PremintData {
    mint_context: {
      signature: string;
      collection: {
        contractAdmin: string;
        contractURI: string;
        contractName: string;
      };
      premint: {
        tokenConfig: {
          tokenURI: string;
        };
      };
    };
  }  

  const fetchPremints = async (
    chain_name: string,
    setPremintsData: React.Dispatch<React.SetStateAction<PremintData[]>>,
    signer?: string,  // <-- Add this optional signer parameter
    limit = 50,
    sort_direction = "DESC"
  ) => {
    try {
      let url = `https://api.zora.co/discover/premints/${chain_name}?limit=${limit}&sort_direction=${sort_direction}`;
      if (signer) {
        url += `&signer=${signer}`;  // <-- Add the signer query parameter if provided
      }
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setPremintsData(data.data);
      } else {
        console.log("Network response was not ok");
      }
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

const resolveTokenURI = async (tokenURI: string) => {
  const ipfsHash = tokenURI.split('ipfs://')[1];
  const httpURL = `https://ipfs.io/ipfs/${ipfsHash}`;
  const response = await fetch(httpURL);
  const data = await response.json();
  return data.image;
};

const Profile = () => {
  const [premintsData, setPremintsData] = useState<PremintData[]>([]);
  const [imageURLs, setImageURLs] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const { isConnected, address } = useAccount();

  useEffect(() => {
    fetchPremints("ZORA-MAINNET", setPremintsData, address);
  }, []);

  useEffect(() => {
    const fetchImages = async () => {
      const newImageURLs = await Promise.all(
        premintsData.map(async (item) => {
          const imageURI = await resolveTokenURI(item.mint_context.premint.tokenConfig.tokenURI);
          const imageHash = imageURI.split('ipfs://')[1];
          return `https://ipfs.io/ipfs/${imageHash}`;
        })
      );
      setImageURLs(newImageURLs);
    };
    fetchImages();
  }, [premintsData]);

  const openURL = (url: string) => {
    Linking.openURL(url);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPremints("ZORA-MAINNET", setPremintsData, address);  // Refresh data
    setRefreshing(false);
  };

  return (
    <View style={{ backgroundColor: 'black' }}>
      <Text style={{color:'white', fontSize: 24, fontWeight: 'bold', left: 10, paddingBottom: 10}}>My Clips</Text>
      <ScrollView
        style={{ paddingTop: 20 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#ffffff"
            colors={["#ffffff"]}
            style={{ backgroundColor: 'black' }}
          />
        }
      >
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {premintsData.map((item, index) => (
            <View key={index} style={[styles.container, { width: '50%' }]}>
              {imageURLs[index] && <Image source={{ uri: imageURLs[index] }} style={styles.image} />}
              {/*}
              <TouchableOpacity onPress={() => openURL(`https://zora.co/${item.mint_context.collection.contractAdmin}`)} style={styles.creatorContainer}>
                <View style={styles.greenDot}></View>
                <Text style={styles.creatorText}>{item.mint_context.collection.contractAdmin.slice(0, 5)}</Text>
              </TouchableOpacity>
              */}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 175,
    height: 175,
    borderRadius: 30,
  },
  creatorContainer: {
    position: 'absolute',
    bottom: 20,
    left: 40,
    backgroundColor: 'white',
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  greenDot: {
    width: 10,
    height: 10,
    backgroundColor: '#0DCE4F',
    borderRadius: 5,
    marginRight: 5,
  },
  creatorText: {
    fontSize: 14,
  },
});

export default Profile;