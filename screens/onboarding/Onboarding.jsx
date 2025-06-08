import { View, FlatList, Dimensions } from "react-native";
import React from "react";
import Slides from "../../components/Onboard/Slides";

const Onboarding = () => {
  //Dimension
  const { width, height } = Dimensions.get("window");

  let slides = [];

  if (width < 720) {
    slides = [
      {
        id: 1,
        image: require("../../assets/images/1.png"),
        title:
          "Taklukkan unplanned downtime, tingkatkan produktivitas, dan hemat biaya perbaikan dengan pemeliharaan terjadwal!",
      },
      {
        id: 2,
        image: require("../../assets/images/2.png"),
        title: "Cleaning Excellence: Less Rejects, More Perfect Products!",
      },
      {
        id: 3,
        image: require("../../assets/images/3.png"),
        title: "",
      },
    ];
  } else {
    slides = [
      {
        id: 1,
        image: require("../../assets/images/6.jpg"),
        title:
          "Taklukkan unplanned downtime, tingkatkan produktivitas, dan hemat biaya perbaikan dengan pemeliharaan terjadwal!",
      },
      {
        id: 2,
        image: require("../../assets/images/4.jpg"),
        title: "Cleaning Excellence: Less Rejects, More Perfect Products!",
      },
      {
        id: 3,
        image: require("../../assets/images/5.jpg"),
        title: "",
      },
    ];
  }

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Mengacak urutan array data
  const randomData = shuffleArray(slides);
  // console.log(randomData); // Output: Array data dengan urutan acak

  return (
    <View>
      <FlatList
        pagingEnabled
        horizontal
        showHorizontalScrollIndicator={false}
        data={randomData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Slides item={item} />}
      />
    </View>
  );
};

export default Onboarding;
