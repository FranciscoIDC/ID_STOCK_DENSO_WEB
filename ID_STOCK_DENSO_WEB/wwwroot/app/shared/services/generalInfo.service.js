(function () {
    'use strict';

    angular
        .module("app")
        .factory("GeneralInfo", GeneralInfo);
    GeneralInfo.$inject = ['$http'];

    function GeneralInfo($http) {
        /*.factory("GeneralInfo", function () {*/
        let info = {};

        let secretAES = 's9XN9qhuY2g7TykC4G_vwR#ax9W^JwTXeYsWmjB9CZ$R+c6Xsq5YhN-RtK8Pq8Lp=HWUyxTXVEvAzqjd*&VW42^3As!ghH$Hk@mz676d#cpk3VWm@57PAT$w?L$qC2PVTF^eamFu!SMzE@+&EZ$SUF=9yFPa%Q@FJxN#ea@mzqG_Tmm2C3WtG7vL3arjkZB5KNU+K6M2#nLuyd7?z*##b@x8haG83bF$@@E?wt%ZRg#ECbLS6KF%AWe6v9Lk7WH=';
        info.KEY_USER_LS = "session";
        info.KEY_USER_P_LS = "permissions";

        info.setUserInLS = _SetDataInLs;
        info.setAuthorizationsInLS = _SetDataUserPermissionsInLs;
        info.getAuthorizationsInLS = _GetDataUserPermissionsInLs;

        info.removeDataInLs = _RemoveDataInLs;
        info.encryptUser = _EncryptUser;
        info.decryptUser = _DecryptUser;
        info.getUserIDCurrent = _GetUserIDCurrent;
        info.getUserInLS = _GetDataInLs;

        info.formatDate = _formatDate;

        info.encryptUserPermissions = _EncryptUserPermissions;
        info.decryptUserPermissions = _DecryptUserPermissions;

        function _SetDataInLs(user) {
            console.log("usuario a guardar en localstorage: ", user)
            //ls.config.secret = secretLS;
            localStorage.setItem(info.KEY_USER_LS, _EncryptUser(user));
            return true;

        }

        function _SetDataUserPermissionsInLs(permissions) {
            console.log("permisos de usuario a guardar en localstorage: ", permissions)
            //ls.config.secret = secretLS;
            localStorage.setItem(info.KEY_USER_P_LS, _EncryptUserPermissions(permissions));
            return true;

        }

        function _GetDataUserPermissionsInLs() {
            //let permissions = JSON.parse(localStorage.getItem(ConstService.permissionsList));
            try {
                let res = _DecryptUserPermissions(localStorage.getItem(info.KEY_USER_P_LS));
                return res;
            } catch (e) {
                let error = e;
            }
        }

        function _RemoveDataInLs() {
            localStorage.removeItem(info.KEY_USER_LS);
            localStorage.removeItem(info.KEY_USER_P_LS);
            localStorage.clear();
        }

        function _EncryptUser(userObject) {
            return CryptoJS.AES.encrypt(JSON.stringify(userObject), secretAES).toString();
        }

        function _DecryptUser(userString) {
            if (!userString) return false;
            let bytes = CryptoJS.AES.decrypt(userString, secretAES);
            let decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            return decryptedData;
        }

        function _GetUserIDCurrent() {
            let userInfo = _GetDataInLs();
            //let userInfo = info.decryptUser(localStorage.getItem(info.KEY_USER_LS));
            if (!userInfo || !userInfo?.id)
                return 0;
            return userInfo?.id;
        }

        function _GetDataInLs() {
            let res = _DecryptUser(localStorage.getItem(info.KEY_USER_LS));
            return res;
        }

        //GUARDADO DE PERMISOS DEL USUARIO

        function _EncryptUserPermissions(permissionsObject) {
            return CryptoJS.AES.encrypt(JSON.stringify(permissionsObject), secretAES).toString();
        }
        function _DecryptUserPermissions(permissionsObject) {
            if (!permissionsObject) return false;
            let bytes = CryptoJS.AES.decrypt(permissionsObject, secretAES);
            let decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            return decryptedData;
        }

        function padTo2Digits(num) {
            return num.toString().padStart(2, '0');
        }

        function _formatDate(date) {
            var res = (
                [
                    date.getFullYear(),
                    padTo2Digits(date.getMonth() + 1),
                    padTo2Digits(date.getDate()),
                ].join('-')
                //+ ' ' +
                //[
                //    padTo2Digits(date.getHours()),
                //    padTo2Digits(date.getMinutes()),
                //    padTo2Digits(date.getSeconds()),
                //].join(':')
            );

            return res;
        }

        return info;
    }
})();