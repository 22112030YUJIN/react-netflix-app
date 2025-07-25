import axios from "axios";

const instance = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  params: {
    //api_key: process.env.REACT_APP_MOVIE_DB_API_KEY,
    api_key: "efa7a18b2411a58e5f64f4e6e25329e0",
    language: "ko-KR",
  },
});

export default instance;
