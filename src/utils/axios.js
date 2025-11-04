import axios from 'axios';
import localStorageService from './localStorageService';
import { toast } from "react-toastify";
import counterpart from './counterpart';
import { isBlank, isNotBlank, isNotEmpty } from "./common";

const apiHost = process.env.REACT_APP_APIURL;
const apiVersion = process.env.REACT_APP_APIVERSION;
const axiosInstance = axios.create({ baseURL: apiHost + '/' + apiVersion });

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
            if (isBlank(cid) && isNotEmpty(error.response.data) && isNotBlank(error.response.data.cid)) {
                cid = error.response.data.cid
            }

            let i18n_code = ""
            if (isNotEmpty(error.response.data) && isNotBlank(error.response.data.i18n_code)) {
                i18n_code = error.response.data.i18n_code
            }

            let auth_failed = error.response.status === 401 && i18n_code === "auth_failed"
            let blocked_account = error.response.status === 403 && i18n_code === "blocked_account"
            let error_msg = counterpart(`error_codes.${error.response.status}`)

            if (isNotBlank(i18n_code)) {
                error_msg = counterpart(`error_codes.${i18n_code}`)
            }

            if (isNotBlank(cid) && !auth_failed && !blocked_account) {
                error_msg = `${error_msg}, CID: ${cid}`
            }

            toast.error(error_msg, {
                autoClose: 3000,
                onClose: () => {
                    if (error.response.status === 401 || blocked_account) {
                        localStorageService.clearToken()
                        window.location.href = "/"
                    }
                }
            })
        } else if (error.message) {
            toast.error(error.message)
        } else {
            toast.error(`Error ${error}`)
        }

        return Promise.reject(error)
    }
);
export default axiosInstance;