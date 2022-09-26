import axios from "axios";
import { baseRestAPIUrl } from "../config/config";

export default axios.create({
    baseURL: baseRestAPIUrl,
    headers: {
        "Content-type": "application/json",
    },
});