(function () {
    'use strict';

    angular
        .module('app')
        .factory('MenuAllowedActionService', MenuAllowedActionService);

    MenuAllowedActionService.$inject = ['$http', 'GeneralInfo'];

    function MenuAllowedActionService($http, generalInfo) {
        let service = {
            get: _Get,
            update: _Update,
            name: 'MenuAllowedActionService'

        };

        return service;

        function _Get(userID, userTypeID, allowToGetWithoutPermission) {
            let idUserSessionActive = generalInfo.getUserIDCurrent();
            _LogDataRequest(service.name, 'GET', null,
                { 'idUserSessionActive': idUserSessionActive, 'userID': userID, 'userTypeID': userTypeID, 'allowToGetWithoutPermission': allowToGetWithoutPermission }, null)

            return $http({
                method: "GET", url: `${generalInfo.urlGetAllMenuAllowedAction}${idUserSessionActive}/${userID}/${userTypeID}/${allowToGetWithoutPermission}`, async: true
            });
        }

        function _Update(permissionList) {
            let idUserSessionActive = generalInfo.getUserIDCurrent();
            _LogDataRequest(service.name, 'PUT', null, { 'idUserSessionActive': idUserSessionActive }, permissionList)

            return $http({
                method: "PUT",
                url: generalInfo.urlUpdateMenuAllowedAction + `${idUserSessionActive}`,
                data: permissionList,
                async: true
            });
        }

        function _LogDataRequest(service, method, query, route, body) {
            log.log("");
            log.log(`*************** ${service} ***************`);
            log.log(`*** ${method} ***************************`);
            log.log(`ParamsQuery: `, query);
            log.log(`ParamsRoute: `, route)
            log.log(`Body: `, body);
            log.log("");
        }
    }
})();