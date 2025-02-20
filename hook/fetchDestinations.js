import { useState, useEffect } from "react";
import axios from "axios";

const fetchDestinations = (id) => {
  const [places, setPlace] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);

    try {
      const response = await axios.get(
        `http://localhost:5003/api/places/byCountry/${id}`
      );

      setPlace(response.data.places);
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

  return { places, isLoading, error, refetch };
};

export default fetchDestinations;
