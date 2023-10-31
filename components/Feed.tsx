import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';

const fetchPremints = async (chain_name: string, limit = 20, sort_direction = "DESC") => {
  try {
    const url = `https://api.zora.co/discover/premints/${chain_name}?limit=${limit}&sort_direction=${sort_direction}`;
    const response = await fetch(url);
    
    if (response.ok) {
      const data = await response.json();
      return data.data; // Return the data array for use in Feed
    } else {
      console.log("Network response was not ok");
      return [];
    }
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    return [];
  }
};

const Feed = () => {
  const [premints, setPremints] = useState([]);

  useEffect(() => {
    fetchPremints("ZORA-MAINNET").then(data => setPremints(data));
  }, []);

  return (
    <FlatList
      data={premints}
      renderItem={({ item }) => <Text>{item.contract_address}</Text>}
      keyExtractor={item => item.uuid}
    />
  );
};

export default Feed;