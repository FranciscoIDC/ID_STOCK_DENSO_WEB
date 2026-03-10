(function () {
    angular
        .module('app')
        .controller('ProductEditController', ProductEditController);

    ProductEditController.$inject = [
        '$scope',
        '$stateParams',
        'ProductEditService',
        'AlertService',
        'ErrorService',
        'ConstService'
    ];

    function ProductEditController(self, $stateParams, ProductEditService, AlertService, ErrorService, ConstService) {

        async function _Init() {
            _InitValues();
            _RegisterFunctions();
            await _GetProductById();
        }

        function _InitValues() {
            self.editMode = false;
            self.IdProduct = $stateParams.id;
        }
        function _RegisterFunctions() {
            self.ChangueMode = _ChangueMode;
            self.Clear = _ClearForm;
        }
        function _ChangueMode() {
            self.editMode = !self.editMode;
            if (!self.editMode) {
                _GetProductById();
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

        async function _GetProductById() {
            try {
                let response = await ProductEditService.Get(self.IdProduct);
                const { Status: status, Message: message, Data: data, Counter: counter } = response.data;
                console.log("_GetProductById: ", response);
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
            self.model = new ProductDtoPut();
        }

        _Init();
    }
})();
