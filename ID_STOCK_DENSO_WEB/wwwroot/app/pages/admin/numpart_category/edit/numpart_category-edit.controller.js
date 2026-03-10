(function () {
    angular
        .module('app')
        .controller('NumpartCategoryEditController', NumpartCategoryEditController);

    NumpartCategoryEditController.$inject = [
        '$scope',
        '$stateParams',
        'NumpartCategoryEditService',
        'NumpartCategoryService',
        'AlertService',
        'ErrorService',
        'ConstService'
    ];

    function NumpartCategoryEditController(self, $stateParams, NumpartCategoryEditService, NumpartCategoryService, AlertService, ErrorService, ConstService) {


        async function _Init() {
            _InitValues();
            _RegisterFunctions();
            await _GetNumpartCategoryById();
        }

        function _InitValues() {
            self.model = new NumpartCategoryDtoPut();


            self.validations = NumpartCategoryService.validations;

            self.editMode = false;
            self.categoryId = $stateParams.id;
        }
        function _RegisterFunctions() {
            self.Update = _Update;
            self.ChangueMode = _ChangueMode;
            self.Clear = _ClearForm;
        }
        function _ChangueMode() {
            self.editMode = !self.editMode;
            if (!self.editMode) {
                _GetNumpartCategoryById();
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
                console.log("modelo de categoría ", self.model)
                self.model.Id = parseInt(self.model.Id)
                let response = await NumpartCategoryEditService.Update(self.model);
                const { Status: status, Message: message, Data: data, Counter: counter } = response.data;
                console.log("Update Asser Type | Request: ", response.data);
                if (status !== 200) {
                    console.error(message);
                    AlertService.Error("Opps", message);
                    return;
                }
                AlertService.Success("Listo!", message);
                self.editMode = false;
                await _GetNumpartCategoryById();
            } catch (ex) {
                let error = ErrorService.GetError(ex);
                console.error('Oops...', error);
                AlertService.ErrorHtml('Oops...', error);
                return false
            }
        }

        async function _GetNumpartCategoryById() {
            try {
                let response = await NumpartCategoryEditService.Get(self.categoryId);
                const { Status: status, Message: message, Data: data, Counter: counter } = response.data;
                console.log("_GetNumpartCategoryById: ", response);

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
            self.model = new NumpartCategoryDtoPut();
        }

        _Init();



    }
})();
