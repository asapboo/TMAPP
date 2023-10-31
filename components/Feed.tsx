import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Linking, StyleSheet, RefreshControl } from 'react-native';

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
  limit = 50,
  sort_direction = "DESC"
) => {
  try {
    const url = `https://api.zora.co/discover/premints/${chain_name}?limit=${limit}&sort_direction=${sort_direction}`;
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

const Feed = () => {
  const [premintsData, setPremintsData] = useState<PremintData[]>([]);
  const [imageURLs, setImageURLs] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchPremints("ZORA-MAINNET", setPremintsData);
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
    await fetchPremints("ZORA-MAINNET", setPremintsData);  // Refresh data
    setRefreshing(false);
  };

  return (
    <View style={{backgroundColor: 'black'}}>
    <ScrollView
        style={{ paddingTop: 20  }}
        refreshControl={
          <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#ffffff" // For iOS
          colors={["#ffffff"]} // For Android
          style={{ backgroundColor: 'black' }}
        />
        }
    >
      {premintsData.map((item, index) => (
        <View key={index} style={styles.container}>
          {imageURLs[index] && <Image source={{ uri: imageURLs[index] }} style={styles.image} />}
          <TouchableOpacity onPress={() => openURL(`https://zora.co/${item.mint_context.collection.contractAdmin}`)} style={styles.creatorContainer}>
            <View style={styles.greenDot}></View>
            <Text style={styles.creatorText}>{item.mint_context.collection.contractAdmin.slice(0, 5)}</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 350,
    height: 350,
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

export default Feed;