(function () {
    angular
        .module('app')
        .controller('LineTypeEditController', LineTypeEditController);

    LineTypeEditController.$inject = [
        '$scope',
        '$stateParams',
        'LineTypeEditService',
        'LineTypeService',
        'AlertService',
        'ErrorService',
        'ConstService'
    ];

    function LineTypeEditController(self, $stateParams, LineTypeEditService, LineTypeService, AlertService, ErrorService, ConstService) {


        async function _Init() {
            _InitValues();
            _RegisterFunctions();
            await _GetLineTypeById();
        }

        function _InitValues() {
            self.model = new LineTypeDtoPut();


            self.validations = LineTypeService.validations;

            self.editMode = false;
            self.lineTypeId = $stateParams.id;
        }
        function _RegisterFunctions() {
            self.Update = _Update;
            self.ChangueMode = _ChangueMode;
            self.Clear = _ClearForm;
        }
        function _ChangueMode() {
            self.editMode = !self.editMode;
            if (!self.editMode) {
                _GetLineTypeById();
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
                console.log("modelo de tipo de linea ", self.model)
                self.model.Id = parseInt(self.model.Id)
                let response = await LineTypeEditService.Update(self.model);
                const { Status: status, Message: message, Data: data, Counter: counter } = response.data;
                console.log("Update Line Type | Request: ", response.data);
                if (status !== 200) {
                    console.error(message);
                    AlertService.Error("Opps", message);
                    return;
                }
                AlertService.Success("Listo!", message);
                self.editMode = false;
                await _GetLineTypeById();
            } catch (ex) {
                let error = ErrorService.GetError(ex);
                console.error('Oops...', error);
                AlertService.ErrorHtml('Oops...', error);
                return false
            }
        }

        async function _GetLineTypeById() {
            try {
                let response = await LineTypeEditService.Get(self.lineTypeId);
                const { Status: status, Message: message, Data: data, Counter: counter } = response.data;
                console.log("_GetLineTypeById: ", response);

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
            self.model = new LineTypeDtoPut();
        }

        _Init();



    }
})();
