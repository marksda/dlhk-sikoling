import axios from "axios";
import { sikolingBaseRestAPIUrl } from "../config/config";

export default axios.create({
    baseURL: sikolingBaseRestAPIUrl,
    headers: {
        "Content-type": "application/json",
    },
});