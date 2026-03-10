(function () {
    angular
        .module('app')
        .controller('FarmerEditController', FarmerEditController);

    FarmerEditController.$inject = [
        '$scope',
        '$stateParams',
        'FarmerEditService',
        'AlertService',
        'ErrorService',
        'ConstService',
        'GeneralInfo',
        'RoleListService'
    ];

    function FarmerEditController(self, $stateParams, FarmerEditService, AlertService, ErrorService, ConstService, GeneralInfo, RoleListService) {


        async function _Init() {
            _InitValues();
            _RegisterFunctions();
            await _GetFarmerById();
        }

        function _InitValues() {

            self.editMode = false;
            self.farmerId = $stateParams.id;

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
                _GetFarmerById();
            }
        }
        function _ValidateForm() {
            let stringErrors = "";
            for (const property in self.model) {
                let value = self.model[property];
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
                let response = await FarmerEditService.Update(self.model);
                const { Status: status, Message: message, Data: data, Counter: counter } = response.data;
                console.log("Update Asset | Request: ", response.data);
                if (status !== 200) {
                    console.error(message);
                    AlertService.Error("Opps", message);
                    return;
                }
                AlertService.Success("Listo!", message);
                self.editMode = false;
                await _GetFarmerById();
            } catch (ex) {
                let error = ErrorService.GetError(ex);
                console.error('Oops...', error);
                AlertService.ErrorHtml('Oops...', error);
                return false
            }
        }

        async function _GetFarmerById() {
            try {
                let response = await FarmerEditService.Get(self.farmerId);
                const { Status: status, Message: message, Data: data, Counter: counter } = response.data;
                console.log("_GetFarmerById: ", response);

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
