(function () {
    angular
        .module('app')
        .controller('FieldLogEditController', FieldLogEditController);

    FieldLogEditController.$inject = [
        '$scope',
        '$stateParams',
        'FieldLogEditService',
        'AlertService',
        'ErrorService',
        'ConstService',
        'GeneralInfo',
        'RoleListService'
    ];

    function FieldLogEditController(self, $stateParams, FieldLogEditService, AlertService, ErrorService, ConstService, GeneralInfo, RoleListService) {


        async function _Init() {
            _InitValues();
            _RegisterFunctions();
            await _GetFieldLogById();
            await _GetRoleAsync();
        }

        function _InitValues() {

            self.editMode = false;
            self.fieldLogId = $stateParams.id;

            self.IdRole = null;
        }
        function _RegisterFunctions() {
            self.Update = _Update;
            self.ChangueMode = _ChangueMode;
            self.Clear = _ClearForm;
        }
        function _ChangueMode() {
            self.editMode = !self.editMode;
            if (!self.editMode) {
                _GetFieldLogById();
            }
        }
        function _ValidateForm() {
            let stringErrors = "";
            for (const property in self.model) {
                let value = self.model[property];
                //let Validar = self.validations.get(property);
                //if (Validar) {
                //    stringErrors += Validar(value);
                //}
            }
            return stringErrors;
        }


        async function _Update() {
            let stringErrors = _ValidateForm();
            if (stringErrors !== "") {
                AlertService.ErrorHtml("Opps", stringErrors);
                return;
            }
            await _UpdateAsync();
        }

        async function _UpdateAsync() {
            try {

                var session = GeneralInfo.getUserInLS()

                self.model.UpdatedBy = session.id;

                self.model.IdRole = parseInt(self.IdRole);

                let response = await FieldLogEditService.Update(self.model);
                const { Status: status, Message: message, Data: data, Counter: counter } = response.data;
                console.log("Update Asset | Request: ", response.data);
                if (status !== 200) {
                    console.error(message);
                    AlertService.Error("Opps", message);
                    return;
                }
                AlertService.Success("Listo!", message);
                self.editMode = false;
                await _GetFieldLogById();
            } catch (ex) {
                let error = ErrorService.GetError(ex);
                console.error('Oops...', error);
                AlertService.ErrorHtml('Oops...', error);
                return false
            }
        }

        async function _GetFieldLogById() {
            try {
                let response = await FieldLogEditService.Get(self.fieldLogId);
                const { Status: status, Message: message, Data: data, Counter: counter } = response.data;
                console.log("_GetFieldLogById: ", response);

                if (status !== 200) {
                    console.error(message);
                    AlertService.Error("Opps", message);
                    return;
                }
                
                self.model = data;
                self.IdRole = data.IdRole.toString();
                console.log("modelo despues de obtener: ", self.model)
                self.$apply();
            } catch (ex) {
                let error = ErrorService.GetError(ex);
                console.error('Oops...', error);
                AlertService.ErrorHtml('Oops...', error);
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

        function _GetImage(imageRoute) {
            if (!imageRoute) return "/images/imageNotFound.png";
            let parts = imageRoute.split("/");
            let scheme = parts[0];

            let container = parts[3];
            let imageName = parts[4];


            return scheme + "//" + ConstService.webApiDomain + "/" + container + "/" + imageName;
        }

        function _ClearForm() {
            self.model.IdRole = null;
        }

        _Init();



    }
})();
