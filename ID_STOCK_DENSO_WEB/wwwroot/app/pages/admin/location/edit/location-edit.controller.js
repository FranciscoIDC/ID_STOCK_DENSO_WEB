(function () {
    angular
        .module('app')
        .controller('LocationEditController', LocationEditController);

    LocationEditController.$inject = [
        '$scope',
        '$stateParams',
        'LocationEditService',
        'LocationService',
        'ZoneListService',
        'WarehouseListService',
        'AlertService',
        'ErrorService',
        'ConstService'
    ];

    function LocationEditController(self, $stateParams, LocationEditService, LocationService, ZoneListService, WarehouseListService, AlertService, ErrorService, ConstService) {

        async function _Init() {
            _InitValues();
            _RegisterFunctions();
            await _GetWarehouseAsync();
            await _GetZoneAsync();
            await _GetLocationById();
        }

        function _InitValues() {
            self.model = new LocationDtoPut();

            self.validations = LocationService.validations;

            self.editMode = false;
            self.IdLocation = $stateParams.id;
            self.IdZone = null;
            self.warehouses = [];
            self.IdWarehouse = null;
            self.zones = [];
        }
        function _RegisterFunctions() {
            self.Update = _Update;
            self.ChangueMode = _ChangueMode;
            self.Clear = _ClearForm;
            self.WarehouseChange = _WarehouseChange;
        }
        function _ChangueMode() {
            self.editMode = !self.editMode;
            if (!self.editMode) {
                _GetLocationById();
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
                AlertService.ErrorHtml("Opps", "Selecciona un almacen");
                return;
            }

            if (!self.IdZone) {
                AlertService.ErrorHtml("Opps", "Selecciona una zona");
                return;
            }
            await _UpdateAsync();
        }

        async function _UpdateAsync() {
            try {
                self.model.IdWarehouse = parseInt(self.IdWarehouse);
                self.model.IdZone = parseInt(self.IdZone);
                let response = await LocationEditService.Update(self.model);
                const { Status: status, Message: message, Data: data, Counter: counter } = response.data;
                console.log("Update location | Request: ", response.data);
                if (status !== 200) {
                    console.error(message);
                    AlertService.Error("Opps", message);
                    return;
                }
                AlertService.Success("Listo!", message);
                self.editMode = false;
                await _GetLocationById();
            } catch (ex) {
                let error = ErrorService.GetError(ex);
                console.error('Oops...', error);
                AlertService.ErrorHtml('Oops...', error);
                return false
            }
        }

        async function _GetLocationById() {
            try {
                let response = await LocationEditService.Get(self.IdLocation);
                const { Status: status, Message: message, Data: data, Counter: counter } = response.data;
                console.log("_GetLocationById: ", response);

                if (status !== 200) {
                    console.error(message);
                    AlertService.Error("Opps", message);
                    return;
                }

                self.model = data;
                self.IdWarehouse = data.IdWarehouse.toString();
                self.IdZone = data.IdZone.toString();

                self.$apply();
            } catch (ex) {
                let error = ErrorService.GetError(ex);
                console.error('Oops...', error);
                AlertService.ErrorHtml('Oops...', error);
            }
        }

        async function _GetZoneAsync() {
            try {
                let params = { 'Page': 0, 'ItemsPerPage': 0, 'IdWarehouse': self.IdWarehouse }
                let response = await ZoneListService.Get(params);
                const { Status: status, Message: message, Data: data, Counter: counter } = response.data;
                console.log("_GetZoneById: ", response);
                if (status !== 200) {
                    console.error(message);
                    AlertService.Error("Opps", message);
                    return;
                }
                self.zones = data;
                self.$apply();
            } catch (ex) {
                let error = ErrorService.GetError(ex);
                console.error('Oops...', error);
                AlertService.ErrorHtml('Oops...', error);
            }
        }

        //EVENTOS
        async function _WarehouseChange(id) {
            self.IdWarehouse = id;
            if (!self.IdWarehouse) return;

            await _GetZoneAsync();
        }

        function _ClearForm() {
            self.model = new LocationDtoPut();
        }

        _Init();



    }
})();
