(function () {
    angular
        .module('app')
        .controller('ColdBoxAddController', ColdBoxAddController);

    ColdBoxAddController.$inject = [
        '$scope',
        'ColdBoxAddService',
        'AlertService',
        'ColdBoxService',
        'ErrorService',
        'RoleListService',
        'GeneralInfo'
    ];

    function ColdBoxAddController(self, ColdBoxAddService, AlertService, ColdBoxService, ErrorService, RoleListService, GeneralInfo) {

        async function _Init() {
            _InitValues();
            _RegisterFunctions();
            await _GetRoleAsync();
        }

        function _InitValues() {
            self.categories = [];
            self.locations = [];

            self.validations = ColdBoxService.validations;
        }

        function _RegisterFunctions() {
            self.Save = _Save;
            self.Clear = _ClearForm;
        }

        function _ValidateForm() {
            let stringErrors = "";
            for (const property in self.model) {
                let value = self.model[property];

                //if (property === "IdTagRFID") continue;

                let Validar = self.validations.get(property);
                if (Validar) {
                    stringErrors += Validar(value);
                }
            }
            return stringErrors;
        }

        async function _Save() {
            //let stringErrors = _ValidateForm();
            //if (stringErrors !== "") {
            //    AlertService.ErrorHtml("Opps", stringErrors);
            //    return;
            //}
            await _SaveAsync();
        }

        async function _SaveAsync() {
            try {
                AlertService.Load();

                var session = GeneralInfo.getUserInLS()

                self.model.CreatedBy = session.id;
                self.model.DepartmentId = +self.model.DepartmentId;
                self.model.IdRole = +self.model.IdRole;
                self.model.CompanyId = +self.model.CompanyId;

                let response = await ColdBoxAddService.Save(self.model);
                swal.close();
                const { Status: status, Message: message, Data: data, Counter: counter } = response.data;
                console.log("Save Asset | Request: ", response.data);
                if (status !== 200) {
                    console.error(message);
                    AlertService.Error("Opps", message);
                    return;
                }
                AlertService.Success("Listo!", message);

            } catch (ex) {
                let error = ErrorService.GetError(ex);
                console.error('Oops...', error);
                AlertService.ErrorHtml('Oops...', error);
                return false
            }
        }

        async function _GetRoleAsync() {
            try {

                let params = { 'page': 0, 'itemsPerPage': 0, 'search': '' }

                let response = await RoleListService.Get(params);
                const { Status: status, Message: message, Data: data, Counter: counter } = response.data;
                console.log(response);

                if (status !== 200) {
                    console.error(message);
                    AlertService.Error("Opps", message);
                    return;
                }

                self.roles = data;
                self.$apply();
            } catch (ex) {
                let error = ErrorService.GetError(ex);
                console.error('Oops...', error);
                AlertService.ErrorHtml('Oops...', error);
            }
        }


        function _ClearForm() {
            self.model = new ColdBoxDtoPost();
        }

        _Init();


    }
})();
