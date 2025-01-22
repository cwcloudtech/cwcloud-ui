const LocalStorageService = (
    function () {
        const _setToken = (accessToken) => {
            localStorage.setItem("access_token", accessToken);
        }
        const _setAllowedCookies = (value) => {
            localStorage.setItem("allow_cookies", value);
        }
        const _getAllowedCookies = (value) => {
            return localStorage.getItem("allow_cookies");
        }
        const _getAccessToken = () => {
            return localStorage.getItem("access_token");
        }
        const _clearToken = () => {
            localStorage.removeItem("access_token");
        }
        const _setAccessToken = (accessToken) => {
            localStorage.setItem("access_token", accessToken);
        }
        const _setRegion = (region) => {
            localStorage.setItem("region", region)
        }
        const _getRegion = () => {
            return localStorage.getItem("region")
        }
        const _setZone = (zone) => {
            localStorage.setItem("zone", zone)
        }
        const _getZone = () => {
            return localStorage.getItem("zone")
        }
        const _setProvider = (provider) => {
            localStorage.setItem("provider", provider)
        }
        const _getProvider = () => {
            return localStorage.getItem("provider")
        }
        const _setDnsProvider = (provider) => {
            localStorage.setItem("dnsProvider", provider)
        }
        const _getDnsProvider = () => {
            return localStorage.getItem("dnsProvider")
        }
        const _clearRegion = () => {
            localStorage.removeItem("region")
        }
        const _setLanguage = (language) => {
            localStorage.setItem('language', language)
        }
        const _getLanguage = () => {
            return localStorage.getItem('language')
        }
        const _setMode = (mode) => {
            localStorage.setItem('modeCWCloud', mode)
        }
        const _getMode = () => {
            return localStorage.getItem('modeCWCloud')
        }
        return {
            setToken: _setToken,
            setAccessToken: _setAccessToken,
            getAccessToken: _getAccessToken,
            clearToken: _clearToken,
            setRegion: _setRegion,
            getRegion: _getRegion,
            setZone: _setZone,
            getZone: _getZone,
            setProvider: _setProvider,
            getProvider: _getProvider,
            setDnsProvider: _setDnsProvider,
            getDnsProvider: _getDnsProvider,
            clearRegion: _clearRegion,
            setLanguage: _setLanguage,
            getLanguage: _getLanguage,
            setMode: _setMode,
            getMode: _getMode,
            getAllowedCookies: _getAllowedCookies,
            setAllowedCookies: _setAllowedCookies

        };
    })();
export default LocalStorageService;