(function () {
    angular
        .module('app')
        .controller('LineEditController', LineEditController);

    LineEditController.$inject = [
        '$scope',
        '$stateParams',
        'LineEditService',
        'LineTypeService',
        'LineTypeListService',
        'AlertService',
        'ErrorService',
        'ConstService'
    ];

    function LineEditController(self, $stateParams, LineEditService, LineTypeService, LineTypeListService, AlertService, ErrorService, ConstService) {

        async function _Init() {
            _InitValues();
            _RegisterFunctions();
            await _GetLineTypeAsync();
            await _GetLineById();
        }

        function _InitValues() {
            self.model = new LineDtoPut();

            self.validations = LineTypeService.validations;

            self.editMode = false;
            self.IdLine = $stateParams.id;
            self.linestypes = [];
            self.IdLineType = null;
        }
        function _RegisterFunctions() {
            self.Update = _Update;
            self.ChangueMode = _ChangueMode;
            self.Clear = _ClearForm;
        }
        function _ChangueMode() {
            self.editMode = !self.editMode;
            if (!self.editMode) {
                _GetLineById();
            }
        }

        async function _GetLineTypeAsync() {
            try {
                self.linestypes = [];
                let params = { 'page': 0, 'itemsPerPage': 0 }
                let response = await LineTypeListService.Get(params);
                const { Status: status, Message: message, Data: data, Counter: counter } = response.data;
                console.log(response);
                if (status !== 200) {
                    console.error(message);
                    AlertService.Error("Opps", message);
                    return;
                }
                self.linestypes = data;
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
            if (!self.IdLineType) {
                AlertService.ErrorHtml("Opps", "Selecciona un línea");
                return;
            }
            await _UpdateAsync();
        }

        async function _UpdateAsync() {
            try {
                self.model.IdLineType = parseInt(self.IdLineType);
                let response = await LineEditService.Update(self.model);
                const { Status: status, Message: message, Data: data, Counter: counter } = response.data;
                console.log("Update LineType | Request: ", response.data);
                if (status !== 200) {
                    console.error(message);
                    AlertService.Error("Opps", message);
                    return;
                }
                AlertService.Success("Listo!", message);
                self.editMode = false;
                await _GetLineById();
            } catch (ex) {
                let error = ErrorService.GetError(ex);
                console.error('Oops...', error);
                AlertService.ErrorHtml('Oops...', error);
                return false
            }
        }

        async function _GetLineById() {
            try {
                let response = await LineEditService.Get(self.IdLine);
                const { Status: status, Message: message, Data: data, Counter: counter } = response.data;
                console.log("_GetLineById: ", response);
                if (status !== 200) {
                    console.error(message);
                    AlertService.Error("Opps", message);
                    return;
                }
                data.IdLineType = data.IdLineType.toString();
                self.model = data;
                self.$apply();
            } catch (ex) {
                let error = ErrorService.GetError(ex);
                console.error('Oops...', error);
                AlertService.ErrorHtml('Oops...', error);
            }
        }

        function _ClearForm() {
            self.model = new LineDtoPut();
        }

        _Init();



    }
})();
