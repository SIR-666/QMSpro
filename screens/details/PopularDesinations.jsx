import { View, Text, FlatList } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AppBar from "../../components/Reusable/AppBar";
import { COLORS, SIZES } from "../../constants/theme";
import ReusableTile from "../../components/Reusable/ReusableTile";
import HorizontalShimmer from "../../components/Shimmers/HorizontalShimmer";
import fetchPlace from "../../hook/fetchPlace";
import { useRoute } from "@react-navigation/native";
import fetchDestinations from "../../hook/fetchDestinations";

const PopularDestinations = ({ navigation }) => {
    const router = useRoute();
    const id = router.params;
    const {places, isLoading, error, refetch} = fetchDestinations(id);


  return (
    <SafeAreaView style={{ marginHorizontal: 20 }}>
      <View style={{ height: 50 }}>
        <AppBar
         top={10}
         left={0}
         right={0}
          title={"Popular Destinations"}
          color={COLORS.white}
          icon={"search1"}
          color1={COLORS.white}
          onPress={()=> navigation.goBack()}
          onPress1={()=> navigation.navigate('HotelSearch')}
        />
      </View>

      {isLoading ? 
      ( <HorizontalShimmer
        horizontal={false}
        width={'100%'}
        height={95}
        radius={12}
        paddingTop={12}
      />)
      
      : (
        <View style={{ paddingTop: 20 }}>
        <FlatList
          data={places}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={{ marginBottom: 10 }}>
              <ReusableTile
                item={item}
                onPress={() => navigation.navigate("HotelDetails", item._id)}
              />
            </View>
          )}
        />
      </View>
      )}
    </SafeAreaView>
  );
};

export default PopularDestinations;
