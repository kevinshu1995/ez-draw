import axios from "axios";

const AxiosApiInstagram = axios.create({
    baseURL: "/api-instagram",
});

const AxiosGraphInstagram = axios.create({
    baseURL: "/graph-instagram",
});

export default {
    AxiosApiInstagram,
    AxiosGraphInstagram,
};

