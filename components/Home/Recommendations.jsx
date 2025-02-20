import { FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, View } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { SIZES } from "../../constants/theme";
import fetchRecommendations from "../../hook/fetchRecommendations";
import HorizontalShimmer from "../Shimmers/HorizontalShimmer";
import ReusableTile from "../Reusable/ReusableTile";

const Recommendations = () => {
  const navigation = useNavigation();
  const {recommendations, isLoading, error, refetch} = fetchRecommendations(1);
 

if(isLoading){
  return <HorizontalShimmer horizontal={true} width={'100%'} height={100} radius={12} paddingTop={15}/>
}

  return (
    <View style={styles.container}>
      

    <FlatList 
    data={recommendations}
    horizontal
    keyExtractor={(item)=> item._id}
    contentContainerStyle={{columnGap: SIZES.medium}}
    showsHorizontalScrollIndicator={false}
    renderItem={({item}) => (
        <ReusableTile item={item} onPress={()=> navigation.navigate('PlaceDetails', item._id)}/>
    )}
    />
    </View>
  );
};

export default Recommendations;

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
  },
});
