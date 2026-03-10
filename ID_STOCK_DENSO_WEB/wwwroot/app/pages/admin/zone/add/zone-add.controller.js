(function () {
    angular
        .module('app')
        .controller('ZoneAddController', ZoneAddController);

    ZoneAddController.$inject = [
        '$scope',
        'ZoneAddService',
        'WarehouseService',
        'WarehouseListService',
        'AlertService',
        'ErrorService'
    ];

    function ZoneAddController(self, ZoneAddService, WarehouseService, WarehouseListService, AlertService, ErrorService) {

        async function _Init() {
            _InitValues();
            _RegisterFunctions();
            await _GetWarehouseAsync();
        }

        function _InitValues() {
            self.model = new ZoneDtoPost();

            self.validations = WarehouseService.validations;
        }

        function _RegisterFunctions() {
            self.Save = _Save;
            self.Clear = _ClearForm;
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

            if (!self.IdWarehouse) {
                stringErrors += "Debe elegir un almacén";
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
            await _SaveAsync();
        }

        async function _SaveAsync() {
            try {
                AlertService.Load();

                self.model.IdWarehouse = parseInt(self.IdWarehouse);
                let response = await ZoneAddService.Save(self.model);
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

        function _ClearForm() {
            self.model = new ZoneDtoPost();
            self.$apply();
        }

        _Init();

    }
})();
