import axios from "axios";
import { baseUrl } from "../config/config";


export default axios.create({
    baseURL: baseUrl,
    headers: {
        "Content-type": "application/json",
    },
});