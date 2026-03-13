(function () {
    'use strict';

    angular
        .module('app')
        .factory('ConstService', ConstService);

    ConstService.$inject = [];

    function ConstService() {
        let appConfig = window.__APP_CONFIG__ || {};
        let webApiIp = appConfig.webApiUrl || 'http://localhost:59020/api/';

        // Derive pathBase from <base href> tag (set server-side by Razor) as primary source.
        // This is more reliable than window.__APP_CONFIG__ since it's always rendered by the server.
        let pathBase = '';
        var baseEl = document.querySelector('base');
        if (baseEl) {
            var basePath = new URL(baseEl.getAttribute('href'), window.location.origin).pathname;
            pathBase = basePath.replace(/\/+$/, '');
        }
        if (!pathBase) {
            pathBase = appConfig.pathBase || '';
        }

        // Derive webApiDomain (host+path without protocol and trailing /api/) for image URL construction
        let webApiDomain = webApiIp.replace(/^https?:\/\//, '').replace(/\/api\/?$/, '');

        const service = {
            webApiIp: webApiIp,
            webApiDomain: webApiDomain,
            pathBase: pathBase,
            token: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwcm9qZWN0IjoiSURTdG9ja0RlbnNvIiwiaXNzdWVyIjoiSURDb25zdWx0b3JlcyIsImVudiI6InByb2R1Y3Rpb24ifQ.Xk7mN2pQwRtL9vA3cFhJdYeB6sKmUoP8nZqE1iTgWx4`,
            itemsPerPage: 5,
            pagingSize: 10,
            assetListFilters: "assetListFilters",
            localizationListFilters: "localizationListFilters",
            ZoneListFilters: "zoneListFilters",
            areaListFilters: "areaListFilters",
            departmentListFilters: "departmentListFilters",
            inventoryListFilters: "inventoryListFilters",
            staffListFilters: "staffListFilters",
            requestListFilters: "requestListFilters",
            approveListFilters: "approveListFilters",
            requestReasonListFilters: "requestReasonListFilters",
            assetsByCategoryListFilters: "assetsByCategoryListFilters",
            assetsNoReturnedListFilters: "assetsNoReturnedListFilters",
            assetReturnListFilters: "assetReturnListFilters",
            AssetDerecognitionRegisterListFilters: "AssetDerecognitionRegisterListFilters",
            AssetByCompanyRegisterListFilters: "AssetByCompanyRegisterListFilters",
            AssetByLocationRegisterListFilters: "AssetByLocationRegisterListFilters",
            AssetRegisterListFilters: "AssetRegisterListFilters",
        };
        return service;

    }
})();