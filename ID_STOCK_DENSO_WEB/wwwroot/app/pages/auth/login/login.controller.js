(function () {
    angular
        .module('app')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$scope', '$state', 'LoginService', 'AlertService', 'GeneralInfo', 'ConstService'];

    function LoginController(self, $state, LoginService, AlertService, GeneralInfo, ConstService) {


        function _Init() {
            _InitValues();
            _RegisterFunctions();
        }

        function _InitValues() {
            self.model = {};
        }

        function _RegisterFunctions() {
            self.GoRecoverPassword = _GoRecoverPassword;
            self.GoHome = _GoHome;
            self.LogIn = _LogIn;
        }

        function _GoRecoverPassword() {
            $state.go("recover_password");
        }

        async function _LogIn() {
            if (!_Validation()) {
                AlertService.Error('Oops...', 'El usuario y contraseña son requeridos');
                return;
            }
            let response = await _LoginAsync();
            //let response = true;
            if (response) {
                _GoHome();
            }
        }

        function _Validation() {
            return self.model.user && self.model.password
        }

        async function _LoginAsync() {
            try {

                AlertService.Load();
                let response = await LoginService.LogIn(JSON.stringify(self.model));
                const { Status, Message, Data } = response.data;
                console.log("Login | Request: ", response.data);
                if (Status === 200) {
                    GeneralInfo.setUserInLS(JSON.stringify({ 'id': Data.ID, 'name': Data.UserName, 'userType': 1, 'sessionDate': Date.now(), 'departmentId' : Data.IdDepartament, 'companyId': Data.CompanyId, 'roleId': Data.RoleId }));
                    //localStorage.setItem("session", JSON.stringify({ 'id': Data.ID, 'name': Data.UserName, 'userType': 1, 'sessionDate': Date.now() }))
                    swal.close();
                    return true;
                }
                else {
                    AlertService.Error('Oops...', Message);
                    return false;
                }
            } catch (ex) {
                console.error('Oops...', ex.data);
                AlertService.Error('Oops...', ex.data);
                return false
            }
        }

        function _GoHome() {
            window.location.replace(ConstService.pathBase + '/Home/Index#!admin/dashboard/home');
        }

        _Init();


    }
})();
