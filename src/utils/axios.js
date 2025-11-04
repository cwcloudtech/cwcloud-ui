import axios from 'axios';
import localStorageService from './localStorageService';
import { toast } from "react-toastify";
import counterpart from './counterpart';
import { isBlank, isNotBlank, isNotEmpty } from "./common";

const apiHost = process.env.REACT_APP_APIURL;
const apiVersion = process.env.REACT_APP_APIVERSION;
const axiosInstance = axios.create({ baseURL: apiHost + '/' + apiVersion });

const handleApiError = (error) => {
    let redirect_home = false
    let error_msg = `Error ${error}`
    let auto_close_time = 3000

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
        let account_not_confirmed = error.response.status === 403 && i18n_code === "account_not_confirmed"
        error_msg = counterpart(`error_codes.${error.response.status}`)
        redirect_home = error.response.status === 401 || blocked_account || account_not_confirmed

        if (isNotBlank(i18n_code)) {
            error_msg = counterpart(`error_codes.${i18n_code}`)
        }

        if (isNotBlank(cid) && !auth_failed && !blocked_account && !account_not_confirmed) {
            error_msg = `${error_msg}, CID: ${cid}`
            auto_close_time = 5000
        }
    } else if (error.message) {
        error_msg = error.message
    }

    toast.error(error_msg, {
        autoClose: auto_close_time,
        onClose: () => {
            if (redirect_home) {
                localStorageService.clearToken()
                window.location.href = "/"
            }
        }
    })

    return error_msg
}

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
        handleApiError(error)
        return Promise.reject(error)
    }
);

export default axiosInstance;
