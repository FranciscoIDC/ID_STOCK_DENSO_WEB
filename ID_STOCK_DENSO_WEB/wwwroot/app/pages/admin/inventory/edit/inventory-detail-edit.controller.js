(function () {
    angular
        .module('app')
        .controller('InventoryDetailEditController', InventoryDetailEditController);

    InventoryDetailEditController.$inject = [
        '$scope',
        '$stateParams',
        'InventoryDetailEditService',
        'CategoryService',
        'AlertService',
        'ErrorService',
        'ConstService'
    ];

    function InventoryDetailEditController(self, $stateParams, InventoryDetailEditService, CategoryService, AlertService, ErrorService, ConstService) {

        async function _Init() {
            _InitValues();
            _RegisterFunctions();
            await _GetInventoryDetailById();
        }

        function _InitValues() {
            //self.model = new CompanyDtoPut();


            self.validations = CategoryService.validations;

            self.editMode = false;
            self.inventoryDetailId = $stateParams.id;
        }
        function _RegisterFunctions() {
            self.Update = _Update;
            self.ChangueMode = _ChangueMode;
            self.Clear = _ClearForm;
        }
        function _ChangueMode() {
            self.editMode = !self.editMode;
            if (!self.editMode) {
                _GetInventoryDetailById();
            }

            //$("#comment").focus();
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
                let response = await InventoryDetailEditService.Update(self.model);
                const { Status: status, Message: message, Data: data, Counter: counter } = response.data;
                console.log("Update Company | Request: ", response.data);
                if (status !== 200) {
                    console.error(message);
                    AlertService.Error("Opps", message);
                    return;
                }
                AlertService.Success("Listo!", message);
                self.editMode = false;
                await _GetInventoryDetailById();
            } catch (ex) {
                let error = ErrorService.GetError(ex);
                console.error('Oops...', error);
                AlertService.ErrorHtml('Oops...', error);
                return false
            }
        }

        async function _GetInventoryDetailById() {
            try {
                let response = await InventoryDetailEditService.Get(self.inventoryDetailId);
                const { Status: status, Message: message, Data: data, Counter: counter } = response.data;
                console.log("_GetInventoryDetailById: ", response);

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
            self.model = new CompanyDtoPut();
        }

        _Init();

    }
})();
