import { useState, useEffect } from "react";
import axios from "axios";

const fetchCountry = (id) => {
  const [country, setCountry] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);

    try {
      const response = await axios.get(
        `http://localhost:5003/api/countries/${id}`
      );

      setCountry(response.data);
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

  return { country, isLoading, error, refetch };
};

export default fetchCountry;
