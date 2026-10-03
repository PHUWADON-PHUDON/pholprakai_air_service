import axios from "axios";

const axiosCore = axios.create({
  timeout: 3 * 60 * 1000,
});

export default axiosCore;
