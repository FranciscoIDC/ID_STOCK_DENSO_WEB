(function () {
    angular
        .module('app')
        .controller('WarehouseEditController', WarehouseEditController);

    WarehouseEditController.$inject = [
        '$scope',
        '$stateParams',
        'WarehouseEditService',
        'WarehouseService',
        'AlertService',
        'ErrorService',
        'ConstService'
    ];

    function WarehouseEditController(self, $stateParams, WarehouseEditService, WarehouseService, AlertService, ErrorService, ConstService) {


        async function _Init() {
            _InitValues();
            _RegisterFunctions();
            await _GetWarehouseById();
        }

        function _InitValues() {
            self.model = new WarehouseDtoPut();


            self.validations = WarehouseService.validations;

            self.editMode = false;
            self.assetId = $stateParams.id;
        }
        function _RegisterFunctions() {
            self.Update = _Update;
            self.ChangueMode = _ChangueMode;
            self.Clear = _ClearForm;
        }
        function _ChangueMode() {
            self.editMode = !self.editMode;
            if (!self.editMode) {
                _GetWarehouseById();
            }
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
                let response = await WarehouseEditService.Update(self.model);
                const { Status: status, Message: message, Data: data, Counter: counter } = response.data;
                console.log("Update Warehouse | Request: ", response.data);
                if (status !== 200) {
                    console.error(message);
                    AlertService.Error("Opps", message);
                    return;
                }
                AlertService.Success("Listo!", message);
                self.editMode = false;
                await _GetWarehouseById();
            } catch (ex) {
                let error = ErrorService.GetError(ex);
                console.error('Oops...', error);
                AlertService.ErrorHtml('Oops...', error);
                return false
            }
        }

        async function _GetWarehouseById() {
            try {
                let response = await WarehouseEditService.Get(self.assetId);
                const { Status: status, Message: message, Data: data, Counter: counter } = response.data;
                console.log("_GetWarehouseById: ", response);

                if (status !== 200) {
                    console.error(message);
                    AlertService.Error("Opps", message);
                    return;
                }

                self.model = data;

                self.$apply();
            } catch (ex) {
                let error = ErrorService.GetError(ex);
                console.error('Oops...', error);
                AlertService.ErrorHtml('Oops...', error);
            }
        }


        function _ClearForm() {
            self.model = new WarehouseDtoPut();
        }

        _Init();



    }
})();
