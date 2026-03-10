(function () {
    angular
        .module('app')
        .controller('ZoneEditController', ZoneEditController);

    ZoneEditController.$inject = [
        '$scope',
        '$stateParams',
        'ZoneEditService',
        'WarehouseService',
        'WarehouseListService',
        'AlertService',
        'ErrorService',
        'ConstService'
    ];

    function ZoneEditController(self, $stateParams, ZoneEditService, WarehouseService, WarehouseListService, AlertService, ErrorService, ConstService) {

        async function _Init() {
            _InitValues();
            _RegisterFunctions();
            await _GetWarehouseAsync();
            await _GetZoneById();
        }

        function _InitValues() {
            self.model = new ZoneDtoPut();

            self.validations = WarehouseService.validations;

            self.editMode = false;
            self.IdZone = $stateParams.id;
            self.warehouses = [];
            self.IdWarehouse = null;
        }
        function _RegisterFunctions() {
            self.Update = _Update;
            self.ChangueMode = _ChangueMode;
            self.Clear = _ClearForm;
        }
        function _ChangueMode() {
            self.editMode = !self.editMode;
            if (!self.editMode) {
                _GetZoneById();
            }
        }

        async function _GetWarehouseAsync() {
            try {
                self.warehouses = [];
                let params = { 'page': 0, 'itemsPerPage': 0 }
                let response = await WarehouseListService.Get(params);
                const { Status: status, Message: message, Data: data, Counter: counter } = response.data;
                console.log(response);
                if (status !== 200) {
                    console.error(message);
                    AlertService.Error("Opps", message);
                    return;
                }
                self.warehouses = data;
                self.$apply();
            } catch (ex) {
                let error = ErrorService.GetError(ex);
                console.error('Oops...', error);
                AlertService.ErrorHtml('Oops...', error);
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
            if (!self.IdWarehouse) {
                AlertService.ErrorHtml("Opps", "Selecciona un almacén");
                return;
            }
            await _UpdateAsync();
        }

        async function _UpdateAsync() {
            try {
                self.model.IdWarehouse = parseInt(self.IdWarehouse);
                let response = await ZoneEditService.Update(self.model);
                const { Status: status, Message: message, Data: data, Counter: counter } = response.data;
                console.log("Update Warehouse | Request: ", response.data);
                if (status !== 200) {
                    console.error(message);
                    AlertService.Error("Opps", message);
                    return;
                }
                AlertService.Success("Listo!", message);
                self.editMode = false;
                await _GetZoneById();
            } catch (ex) {
                let error = ErrorService.GetError(ex);
                console.error('Oops...', error);
                AlertService.ErrorHtml('Oops...', error);
                return false
            }
        }

        async function _GetZoneById() {
            try {
                let response = await ZoneEditService.Get(self.IdZone);
                const { Status: status, Message: message, Data: data, Counter: counter } = response.data;
                console.log("_GetZoneById: ", response);
                if (status !== 200) {
                    console.error(message);
                    AlertService.Error("Opps", message);
                    return;
                }
                self.model = data;
                self.IdWarehouse = data.IdWarehouse.toString();
                self.$apply();
            } catch (ex) {
                let error = ErrorService.GetError(ex);
                console.error('Oops...', error);
                AlertService.ErrorHtml('Oops...', error);
            }
        }

        function _ClearForm() {
            self.model = new ZoneDtoPut();
        }

        _Init();



    }
})();
