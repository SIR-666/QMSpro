import { View, Text, TextInput } from "react-native";
import React, { useState } from "react";
import {
  ReusableBtn,
  HeightSpacer,
  ReusableText,
  AppBar,
} from "../../../components";
import { COLORS, SIZES } from "../../../constants/theme";
import { SafeAreaView } from "react-native-safe-area-context";
import reusable from "../../../components/Reusable/reusable.style";
import styles from "./addReviews.style";
import { Rating, RatingInput } from "react-native-stock-star-rating";
import { useRoute } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
const AddReviews = ({ navigation }) => {
  const router = useRoute();
  const placeId = router.params;
  const [rating, setRating] = React.useState(0);
  const [reviewInput, setReviewInput] = useState("");

  const postReviews = async (review, rating) => {
    const userId = await AsyncStorage.getItem("id");
    const token = await AsyncStorage.getItem("token");
    const accessToken = JSON.parse(token);
    const id = JSON.parse(userId);

    const endpoint = "http://localhost:5003/api/reviews";

    const data = {
      review: review,
      rating: rating,
      user: id,
      place: placeId,
    };

    try {
      const response = await axios.post(endpoint, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 200) {
        navigation.replace("HotelDetails", placeId);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={reusable.container}>
      <View>
        <View style={{ height: 100 }}>
          <AppBar
            top={40}
            left={20}
            right={20}
            title={"Add Comment"}
            color={COLORS.white}
            onPress={() => navigation.goBack()}
          />
        </View>

        <View style={{ margin: 20, paddingTop: 30 }}>
          <ReusableText
            text={"Rate your stay"}
            family={"medium"}
            size={SIZES.large - 3}
            color={COLORS.black}
          />

          <HeightSpacer height={15} />

          <RatingInput
            rating={rating}
            setRating={setRating}
            size={70}
            maxStars={5}
            bordered={false}
            color={"#FD9942"}
          />

          <HeightSpacer height={15} />

          <ReusableText
            text={"Your review"}
            family={"medium"}
            size={SIZES.large - 3}
            color={COLORS.black}
          />

          <HeightSpacer height={15} />

          <View style={styles.wrapper}>
            <TextInput
              style={styles.input}
              value={reviewInput}
              onChangeText={setReviewInput}
              placeholder="Write your stay experience"
            />
          </View>

          <HeightSpacer height={20} />

          <ReusableBtn
            onPress={() => {
              postReviews(reviewInput, rating);
            }}
            btnText={"Submit your review"}
            width={SIZES.width - 50}
            backgroundColor={COLORS.green}
            borderColor={COLORS.green}
            borderWidth={0.5}
            textColor={COLORS.white}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AddReviews;
