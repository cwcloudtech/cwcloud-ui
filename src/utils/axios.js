import axios from 'axios';
import localStorageService from './localStorageService';
import { toast } from "react-toastify";
import counterpart from './counterpart';
const apiHost = process.env.REACT_APP_APIURL;
const apiVersion = process.env.REACT_APP_APIVERSION;
const axiosInstance = axios.create({ baseURL: apiHost + '/' + apiVersion });
import { isBlank, isNotBlank } from "./common";

axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorageService.getAccessToken();
        config.headers['X-User-Token'] = accessToken
        return config;
    },
    (error) => {
        Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    async (response) => {
        return response
    },
    function (error) {
        if (error.response) {
            let cid = error.response.headers['x-cwcloud-cid']
            if (isBlank(cid) && isNotBlank(error.response.cid)) {
                cid = error.response.cid
            }

            if (error.response.status === 401) {
                localStorageService.clearToken()
                window.location.href = "/"
            } else if (error.response.status === 500) {
                toast.error(`Internal Server Error, CID: ${cid}`)
                return Promise.reject(error)
            } else if (error.response.status === 422) {
                toast.error(counterpart(`error_codes.422`))
                return Promise.reject(error)
            } else if (error.response.data.i18n_code) {
                toast.error(counterpart(`error_codes.${error.response.data.i18n_code}`))
                return Promise.reject(error)
            } else {
                toast.error(`Error ${error.response.status}, CID: ${cid}`)
                return Promise.reject(error)
            }
        } else if (error.message) {
            toast.error(error.message)
            return Promise.reject(error)
        } else {
            toast.error(`Error ${error}`)
            return Promise.reject(error)
        }
    }
);
export default axiosInstance;