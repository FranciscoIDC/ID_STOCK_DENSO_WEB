(function () {
    'use strict';

    angular
        .module('app')
        .factory('authService', authService);

    authService.$inject = ['$http', 'GeneralInfo', 'RoleEditService', 'AlertService'];

    function authService($http, GeneralInfo, RoleEditService, AlertService) {
        let service = {
            IsLogged: _IsLogged,
            LogOut: _LogOut,
            GetPermissions: _GetPermissions
        };

        async function _IsLogged(routeTo) {
            //let session = JSON.parse(localStorage.getItem(GeneralInfo.KEY_USER_LS));
            let session = GeneralInfo.getUserInLS();

            if (!session) {
                if (routeTo?.templateUrl.toLowerCase().includes("admin")) {
                    window.location.replace("/");
                    return;
                }
            } else {

                let id = session.id;
                let name = session.name;
                let userType = session.userType;
                let sessionDate = new Date(+session.sessionDate);
                let currentDate = new Date();

                sessionDate.setHours(0, 0, 0, 0);
                currentDate.setHours(0, 0, 0, 0);

                let urlRequiresAuth = routeTo?.data?.requiresAuth;
                let allowedTypes = routeTo?.data?.typeUserAllowed;
                let menuId = routeTo?.data?.menuID;

                //let userInfo = GeneralInfo.decryptUser(localStorage.getItem(GeneralInfo.KEY_USER_LS));

                if (userType === 2 && sessionDate.getTime() !== currentDate.getTime()) {
                    //localStorage.removeItem("session");
                    _LogOut();
                    return;
                }

                if (urlRequiresAuth) {
                   
                    let permissions = await _GetPermissions();
                    
                    //menuId = menuId || -1;
                    let hasPermission = permissions?.find(item => item.PermissionId == menuId && item.IsEnabled == true);
                    console.log("tiene permiso: ", hasPermission)
                    let accessible = allowedTypes.includes(userType);

                    if (!accessible || (!hasPermission && menuId > 0)) {
                        //window.location.replace('/#!/auth/login');
                        //LogOut();
                        window.location.replace('/Home/Index#!admin/dashboard/home');
                        AlertService.ErrorHtml("Opps", 'Al parecer no estas autorizado para acceder a esta opción');
                        return;
                    }

                    return;
                }

                window.location.replace('/Home/Index#!admin/dashboard/home');
                return;
            }
        }

        async function _GetPermissions() {
            try {
                let session = GeneralInfo.getUserInLS();
                if (session.id) {

                    let response = await RoleEditService.GetPermissions(session.roleId);
                    const { Status: status, Message: message, Data: data, Counter: counter } = response.data;
                    console.log("*** AuthService | _Permissions | permisos del usuario que tiene la session iniciada: ", data);
                    if (status !== 200) {
                        console.error(message);
                        AlertService.Error("Opps", message);
                        return null;
                    }
                    GeneralInfo.setAuthorizationsInLS(data);
                    return data;
                }
            } catch (e) {

                return null;
            }
            return null;
        }

        function _LogOut() {
            GeneralInfo.removeDataInLs();
            //localStorage.removeItem("session");
            window.location.replace('/');
        }

        return service;
    }
})();