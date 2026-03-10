(function () {
    angular
        .module('app')
        .controller('dashboardController', dashboardController);

    dashboardController.$inject = ['$scope', 'GeneralInfo', 'authService'];

    function dashboardController($scope, GeneralInfo, authService) {
        let self = $scope;
        self.logout = _Logout;

        GeneralInfo.PAGE = 1;
        let userInfo = GeneralInfo.decryptUser(localStorage.getItem(GeneralInfo.KEY_USER_LS));
        let userName = userInfo._name;

        self.userName = userName;

        function _Logout() {
            authService.LogOut();
        }


    }
})();