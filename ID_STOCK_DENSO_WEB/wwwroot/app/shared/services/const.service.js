(function () {
    'use strict';

    angular
        .module('app')
        .factory('ConstService', ConstService);

    ConstService.$inject = [];

    function ConstService() {
        //let webApiDomain = "192.168.3.214:5001";
        //let webApiDomain = "192.168.0.123:5001";
        let webApiDomain = "localhost:59020";[]

        const service = {
            webApiDomain: webApiDomain,
            webApiIp: `http://${webApiDomain}/api/`,
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