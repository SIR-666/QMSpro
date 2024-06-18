import { useState, useEffect } from "react";
import axios from "axios";

const fetchRecommendations = (places) => {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);

    try {
      if (places === 1) {
        const response = await axios.get(
          "http://localhost:5003/api/places?limit=3"
        );
        setRecommendations(response.data.places);
      } else {
        const response = await axios.get("http://localhost:5003/api/places");
        setRecommendations(response.data.places);
      }

      setIsLoading(false);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refetch = () => {
    setIsLoading(true);
    fetchData();
  };

  return { recommendations, isLoading, error, refetch };
};

export default fetchRecommendations;
