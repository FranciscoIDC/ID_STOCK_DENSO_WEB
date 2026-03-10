(function () {
    angular
        .module('app')
        .controller('CarrierEditController', CarrierEditController);

    CarrierEditController.$inject = [
        '$scope',
        '$stateParams',
        'CarrierEditService',
        'AlertService',
        'ErrorService',
        'ConstService',
        'GeneralInfo',
        'RoleListService'
    ];

    function CarrierEditController(self, $stateParams, CarrierEditService, AlertService, ErrorService, ConstService, GeneralInfo, RoleListService) {


        async function _Init() {
            _InitValues();
            _RegisterFunctions();
            await _GetCarrierById();
        }

        function _InitValues() {

            self.editMode = false;
            self.carrierId = $stateParams.id;

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
                _GetCarrierById();
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

                let response = await CarrierEditService.Update(self.model);
                const { Status: status, Message: message, Data: data, Counter: counter } = response.data;
                console.log("Update Asset | Request: ", response.data);
                if (status !== 200) {
                    console.error(message);
                    AlertService.Error("Opps", message);
                    return;
                }
                AlertService.Success("Listo!", message);
                self.editMode = false;
                await _GetCarrierById();
            } catch (ex) {
                let error = ErrorService.GetError(ex);
                console.error('Oops...', error);
                AlertService.ErrorHtml('Oops...', error);
                return false
            }
        }

        async function _GetCarrierById() {
            try {
                let response = await CarrierEditService.Get(self.carrierId);
                const { Status: status, Message: message, Data: data, Counter: counter } = response.data;
                console.log("_GetCarrierById: ", response);

                if (status !== 200) {
                    console.error(message);
                    AlertService.Error("Opps", message);
                    return;
                }
                
                self.model = data;
                console.log("modelo despues de obtener: ", self.model)
                self.$apply();
            } catch (ex) {
                let error = ErrorService.GetError(ex);
                console.error('Oops...', error);
                AlertService.ErrorHtml('Oops...', error);
            }
        }

        function _ClearForm() {
            self.model.IdRole = null;
        }

        _Init();



    }
})();
