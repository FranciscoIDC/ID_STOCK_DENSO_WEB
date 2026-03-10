(function () {
    angular
        .module('app')
        .controller('RoleAddController', RoleAddController);

    RoleAddController.$inject = [
        '$scope',
        'RoleAddService',
        'AlertService',
        'RoleService',
        'ErrorService'
    ];

    function RoleAddController(self, RoleAddService, AlertService, RoleService, ErrorService) {

        async function _Init() {
            _InitValues();
            _RegisterFunctions();
        }

        function _InitValues() {
            //self.model = { 'Name': '', 'Description': '', 'Status': true, 'Id': 0 };
            _ClearForm();

            self.categories = [];
            self.locations = [];

            self.validations = RoleService.validations;
        }

        function _RegisterFunctions() {
            self.Save = _Save;
            self.Clear = _ClearForm;
        }

        function _ValidateForm() {
            let stringErrors = "";
            for (const property in self.model) {
                let value = self.model[property];

                let Validar = self.validations.get(property);
                if (Validar) {
                    stringErrors += Validar(value);
                }
            }
            return stringErrors;
        }

        async function _Save() {
            let stringErrors = _ValidateForm();
            if (stringErrors !== "") {
                AlertService.ErrorHtml("Opps", stringErrors);
                return;
            }
            await _SaveAsync();
        }

        async function _SaveAsync() {
            try {
                AlertService.Load();

                let response = await RoleAddService.Save(self.model);
                swal.close();
                const { Status: status, Message: message, Data: data, Counter: counter } = response.data;
                console.log("Save Asset | Request: ", response.data);
                if (status !== 200) {
                    console.error(message);
                    AlertService.Error("Opps", message);
                    return;
                }
                AlertService.Success("Listo!", message);
                _ClearForm();
            } catch (ex) {
                let error = ErrorService.GetError(ex);
                console.error('Oops...', error);
                AlertService.ErrorHtml('Oops...', error);
                return false
            }
        }

        function _ClearForm() {
            self.model = { 'Name': '', 'Description': '', 'Status': true, 'Id': 0 };
        }

        _Init();


    }
})();
