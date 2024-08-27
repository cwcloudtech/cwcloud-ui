import React, { useState, useEffect } from "react";
import GlobalContext from "./GlobalContext";
import axios from "../utils/axios";
import LocalStorageService from "../utils/localStorageService";
import LoadingComponent from "../Components/LoadingComponent/LoadingComponent"
import { englishLanguage, frenchLanguage } from "./Language";
import counterpart from "counterpart";
import AllowCookiesFooter from "../Components/AllowCookiesFooter/AllowCookiesFooter";
const AppContext = (props) => {
    const [currentUser, setCurrentUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [providers, setProviders] = useState(null)
    const [dnsProviders, setDnsProviders] = useState(null)
    const [region, setRegion] = useState(null)
    const [selectedProvider, setSelectedProvider] = useState(null)
    const [selectedDnsProvider, setSelectedDnsProvider] = useState(null)
    const [isGlobal, setIsGlobal] = useState(false)
    const [UserAuthMethods, setUserAuthMethods] = useState([])
    const [showAllowCookiesBanner, setShowAllowCookiesBanner] = useState(false)

    useEffect(() => {
        if (providers) {
            if (LocalStorageService.getProvider()) {
                const localProvider = LocalStorageService.getProvider()
                const providerIndex = providers.findIndex(p => p.name === localProvider)
                if (providerIndex >= 0)
                    return setSelectedProvider({ ...providers[providerIndex] })
            }
            setSelectedProvider(providers[0])
            LocalStorageService.setProvider(providers[0].name)
        }
        if (dnsProviders) {
            if (LocalStorageService.getDnsProvider()) {
                const localProvider = LocalStorageService.getDnsProvider()
                const providerIndex = dnsProviders.findIndex(p => p === localProvider)
                if (providerIndex >= 0)
                    return setSelectedDnsProvider(dnsProviders[providerIndex])
            }
            setSelectedDnsProvider(dnsProviders[0])
            LocalStorageService.setDnsProvider(dnsProviders[0])
        }
    }, [providers, dnsProviders])

    useEffect(() => {
        if (selectedProvider && currentUser) {
            if (LocalStorageService.getRegion()) {
                const localRegion = LocalStorageService.getRegion()
                const regionIndex = selectedProvider.regions.findIndex(r => r.name === localRegion)
                if (regionIndex >= 0) {
                    setRegion({ ...selectedProvider.regions[regionIndex] })
                    return setLoading(false)
                }
                setRegionHandler(selectedProvider.regions[0])
                return setLoading(false)
            }
            setRegionHandler(selectedProvider.regions[0])
            return setLoading(false)
        }
    }, [currentUser, selectedProvider])

    useEffect(() => {
        if (!loading) {
            if (!LocalStorageService.getAllowedCookies()) {
                setShowAllowCookiesBanner(true)
            }
        }
    }, [loading])

    useEffect(() => {
        counterpart.registerTranslations('en', englishLanguage)
        counterpart.registerTranslations('fr', frenchLanguage)
        counterpart.setLocale(getLanguage())
        const fetchProviders = async () => {
            const reponseProviders = await axios.get('/provider')
            setProviders(reponseProviders.data.providers)
        }
        const fetchDnsProviders = async () => {
            const reponseDnsProviders = await axios.get('/provider/dns')
            setDnsProviders(reponseDnsProviders.data.providers)
        }
        fetchProviders()
        fetchDnsProviders()
        if (LocalStorageService.getAccessToken()) {
            axios.get("/user")
                .then(response => {
                    setCurrentUser(response.data)
                    axios.get(`/mfa`)
                        .then(res => {
                            setUserAuthMethods(res.data.methods)
                        })
                })
        } else {
            setLoading(false)
        }
    }, [])

    const getLanguage = () => {
        const _language = LocalStorageService.getLanguage()
        if (_language && (_language === 'en' || _language === 'fr')) {
            return _language
        } else {
            const userLanguage = navigator.language || navigator.userLanguage;
            const language = userLanguage.includes('en') ? 'en' : 'fr'
            LocalStorageService.setLanguage(language)
            return language
        }
    }

    const setLanguageHandler = (language) => {
        LocalStorageService.setLanguage(language)
        window.location.reload()
    }
    const setSelectedProviderHandler = (provider) => {
        LocalStorageService.setProvider(provider.name)
        setSelectedProvider(provider)

    }
    const setSelectedDnsProviderHandler = (provider) => {
        LocalStorageService.setDnsProvider(provider)
        setSelectedDnsProvider(provider)
    }
    const setRegionHandler = (region) => {
        LocalStorageService.setRegion(region.name)
        setRegion(region)

    }
    const allowCookiesHandler = () => {
        LocalStorageService.setAllowedCookies("1")
        setShowAllowCookiesBanner(false)
    }
    const setModeHandler = (mode) => {
        LocalStorageService.setMode(mode)
        window.location.reload()
    }
    const checkMode = window.matchMedia("(prefers-color-scheme: light)");
    const system_mode = checkMode.matches ? 'light' : 'dark'
    const local_storage_mode = LocalStorageService.getMode()
    return (
        <GlobalContext.Provider value={
            {
                user: currentUser,
                UserAuthMethods: UserAuthMethods,
                setUser: setCurrentUser,
                setUserAuthMethods: setUserAuthMethods,
                region: region,
                setRegion: setRegionHandler,
                allowCookies: allowCookiesHandler,
                providers: providers,
                dnsProviders: dnsProviders,
                selectedProvider: selectedProvider,
                selectedDnsProvider: selectedDnsProvider,
                setSelectedProvider: setSelectedProviderHandler,
                setSelectedDnsProvider: setSelectedDnsProviderHandler,
                counterpart: counterpart,
                language: LocalStorageService.getLanguage(),
                mode: local_storage_mode == null ? system_mode : local_storage_mode,
                setLanguage: setLanguageHandler,
                setMode: setModeHandler,
                isGlobal: isGlobal,
                setIsGlobal: setIsGlobal,
            }
        } >
            {loading ? <LoadingComponent loading /> :
                <React.Fragment>
                    {props.children}
                    {showAllowCookiesBanner && <AllowCookiesFooter />}
                </React.Fragment>}
        </GlobalContext.Provider>)
}
export default AppContext;
