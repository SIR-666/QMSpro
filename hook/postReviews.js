import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const postReviews = async (review, rating, placeId) => {
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
    }
    console.log(response.data);
  } catch (error) {
    console.log(error);
  }
};

export default postReviews;
