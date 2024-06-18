import {
  StyleSheet,
  Text,
  View,
  VirtualizedList,
  ActivityIndicator,
} from "react-native";
import React from "react";
import HeightSpacer from "../Reusable/HeightSpacer";
import { COLORS, SIZES } from "../../constants/theme";
import Country from "../Tiles/Country/Country";
import fetchCountries from "../../hook/fetchCountries";
import HorizontalShimmer from "../Shimmers/HorizontalShimmer";

const Places = () => {
  const { countries, isLoading, error, refetch } = fetchCountries();

  if (isLoading) {
    return (
      <View>
        <HorizontalShimmer
          horizontal={true}
          width={85}
          height={95}
          radius={12}
          paddingTop={12}
        />
        <HorizontalShimmer
          horizontal={true}
          width={85}
          height={10}
          radius={12}
          paddingTop={10}
        />
      </View>
    );
  return <ActivityIndicator />

  }

  return (
    <View>
      <HeightSpacer height={20} />

      <VirtualizedList
        data={countries}
        horizontal
        keyExtractor={(item) => item._id}
        showsHorizontalScrollIndicator={false}
        getItemCount={(data) => data.length}
        getItem={(data, index) => data[index]}
        renderItem={({ item, index }) => (
          <View style={{ marginRight: SIZES.medium }}>
            <Country item={item} />
          </View>
        )}
      />
    </View>
  );
};

export default Places;
