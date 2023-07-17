import axios from "axios";
import { urlApiSikoling } from "../config/config";

export default axios.create({
    baseURL: urlApiSikoling,
    headers: {
        "Content-type": "application/json",
    },
});