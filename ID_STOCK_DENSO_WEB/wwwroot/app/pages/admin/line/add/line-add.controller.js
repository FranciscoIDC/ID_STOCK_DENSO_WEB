(function () {
    angular
        .module('app')
        .controller('LineAddController', LineAddController);

    LineAddController.$inject = [
        '$scope',
        'LineAddService',
        'LineTypeService',
        'LineTypeListService',
        'AlertService',
        'ErrorService'
    ];

    function LineAddController(self, LineAddService, LineTypeService, LineTypeListService, AlertService, ErrorService) {

        async function _Init() {
            _InitValues();
            _RegisterFunctions();
            await _GetLineTypeAsync();
        }

        function _InitValues() {
            self.model = new LineDtoPost();

            self.validations = LineTypeService.validations;
        }

        function _RegisterFunctions() {
            self.Save = _Save;
            self.Clear = _ClearForm;
        }

        async function _GetLineTypeAsync() {
            try {
                self.stores = [];

                let params = { 'page': 0, 'itemsPerPage': 0 }

                let response = await LineTypeListService.Get(params);
                const { Status: status, Message: message, Data: data, Counter: counter } = response.data;
                console.log(response);

                if (status !== 200) {
                    console.error(message);
                    AlertService.Error("Opps", message);
                    return;
                }

                self.stores = data;
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

            if (!self.IdLineType) {
                stringErrors += "Debe elegir una línea";
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

                self.model.IdLineType = parseInt(self.IdLineType);
                let response = await LineAddService.Save(self.model);
                swal.close();
                const { Status: status, Message: message, Data: data, Counter: counter } = response.data;
                console.log("Save LineType | Request: ", response.data);
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
            self.model = new LineDtoPost();
            self.$apply();
        }

        _Init();

    }
})();
