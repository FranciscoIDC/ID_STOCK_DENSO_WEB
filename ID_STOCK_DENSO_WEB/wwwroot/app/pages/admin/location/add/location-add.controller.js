(function () {
    angular
        .module('app')
        .controller('LocationAddController', LocationAddController);

    LocationAddController.$inject = [
        '$scope',
        'LocationAddService',
        'LocationService',
        'WarehouseListService',
        'ZoneListService',
        'AlertService',
        'ErrorService'
    ];

    function LocationAddController(self, LocationAddService, LocationService, WarehouseListService, ZoneListService, AlertService, ErrorService) {

        async function _Init() {
            _InitValues();
            _RegisterFunctions();
            await _GetWarehouseAsync();
            //await _GetZoneAsync();
        }

        function _InitValues() {
            self.model = new LocationDtoPost();

            self.validations = LocationService.validations;
        }

        function _RegisterFunctions() {
            self.Save = _Save;
            self.Clear = _ClearForm;
            self.WarehouseChange = _WarehouseChange;
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

        async function _GetZoneAsync() {
            try {
                let params = { 'Page': 0, 'ItemsPerPage': 0, 'IdWarehouse': self.IdWarehouse, 'Search': '' }
                let response = await ZoneListService.Get(params);
                const { Status: status, Message: message, Data: data, Counter: counter } = response.data;
                console.log("_GetZoneById: ", response);

                if (status !== 200) {
                    console.error(message);
                    AlertService.Error("Opps", message);
                    return;
                }

                self.zones = data;
                //self.IdZone = data.IdWarehouse.toString();

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

            if (!self.IdWarehouse) {
                stringErrors += "Debe elegir una empresa";
                //AlertService.Error("Opps", 'Debe elegir una empresa');
                //return;
            }

            return stringErrors;
        }

        async function _Save() {
            let stringErrors = _ValidateForm();
            if (stringErrors !== "") {
                AlertService.ErrorHtml("Opps", stringErrors);
                return;
            }
            if (!self.IdWarehouse) {
                AlertService.ErrorHtml("Opps", "Selecciona una empresa");
                return;
            }

            if (!self.IdZone) {
                AlertService.ErrorHtml("Opps", "Selecciona una ubicación de empresa");
                return;
            }
            await _SaveAsync();
        }

        async function _SaveAsync() {
            try {
                AlertService.Load();

                self.model.IdWarehouse = parseInt(self.IdWarehouse);
                self.model.IdZone = parseInt(self.IdZone);
                let response = await LocationAddService.Save(self.model);
                swal.close();
                const { Status: status, Message: message, Data: data, Counter: counter } = response.data;
                console.log("Save Warehouse | Request: ", response.data);
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

        //EVENTOS
        async function _WarehouseChange(id) {
            self.IdWarehouse = id;
            if (!self.IdWarehouse) return;

            await _GetZoneAsync();
        }

        function _ClearForm() {
            self.model = new LocationDtoPost();
            self.$apply();
        }

        _Init();

    }
})();
