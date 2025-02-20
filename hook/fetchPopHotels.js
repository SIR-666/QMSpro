import { useState, useEffect } from "react";
import axios from "axios";

const fetchHotelsByCountry = (id) => {
  const [hotels, setPlace] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);

    try {
      const response = await axios.get(
        `http://localhost:5003/api/hotels/byCountry/${id}?limit=all`
      );
      console.log(response.data);
      setPlace(response.data.hotels);
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

  return { hotels, isLoading, error, refetch };
};

export default fetchHotelsByCountry;
