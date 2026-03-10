(function () {
    angular
        .module('app')
        .controller('RecoverPasswordController', RecoverPasswordController);

    RecoverPasswordController.$inject = ['$scope', '$state', 'RecoverPasswordService', 'AlertService'];

    function RecoverPasswordController(self, $state, RecoverPasswordService, AlertService) {

        function _Init() {
            _InitValues();
            _RegisterFunctions();
        }

        function _InitValues() {
            self.model = {};
            self.email_recovery = '';
        }

        function _RegisterFunctions() {
            self.GoBack = _GoBack;
            self.PassRecovery = _PassRecovery;
        }

        async function _PassRecovery() {
            try {

                if (!self.email_recovery) {
                    AlertService.Error('Oops...', 'Ingrese el email');
                    return;
                }
                AlertService.Load();

                let response = await RecoverPasswordService.RecoverPassword(self.email_recovery);
                const { Status, Message, Data } = response.data;

                //swal.close();

                if (Status != 200) {
                    AlertService.Error('Oops...', Message);
                    return;
                }

                AlertService.Success('Listo', 'Información enviada al email brindado.');
            } catch (ex) {
                console.error('Oops...', ex.data);
                AlertService.Error('Oops...', ex.data);
                return
            }
        }

        function _GoBack() {
            history.back();
        }

        _Init();


    }
})();
