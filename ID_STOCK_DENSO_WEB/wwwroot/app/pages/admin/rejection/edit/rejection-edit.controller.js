(function () {
    angular
        .module('app')
        .controller('RejectionEditController', RejectionEditController);

    RejectionEditController.$inject = [
        '$scope',
        '$stateParams',
        'RejectionEditService',
        'AlertService',
        'ErrorService',
        'ConstService',
        'GeneralInfo',
        'RoleListService'
    ];

    function RejectionEditController(self, $stateParams, RejectionEditService, AlertService, ErrorService, ConstService, GeneralInfo, RoleListService) {


        async function _Init() {
            _InitValues();
            _RegisterFunctions();
            await _GetRejectionById();
        }

        function _InitValues() {

            self.editMode = false;
            self.rejectionId = $stateParams.id;

            self.IdRole = null;
        }
        function _RegisterFunctions() {
            self.Update = _Update;
            self.ChangueMode = _ChangueMode;
            self.Clear = _ClearForm;
        }
        function _ChangueMode() {
            self.editMode = !self.editMode;
            if (!self.editMode) {
                _GetRejectionById();
            }
        }
        function _ValidateForm() {
            let stringErrors = "";
            for (const property in self.model) {
                let value = self.model[property];
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

                let response = await RejectionEditService.Update(self.model);
                const { Status: status, Message: message, Data: data, Counter: counter } = response.data;
                console.log("Update Asset | Request: ", response.data);
                if (status !== 200) {
                    console.error(message);
                    AlertService.Error("Opps", message);
                    return;
                }
                AlertService.Success("Listo!", message);
                self.editMode = false;
                await _GetRejectionById();
            } catch (ex) {
                let error = ErrorService.GetError(ex);
                console.error('Oops...', error);
                AlertService.ErrorHtml('Oops...', error);
                return false
            }
        }

        async function _GetRejectionById() {
            try {
                let response = await RejectionEditService.Get(self.rejectionId);
                const { Status: status, Message: message, Data: data, Counter: counter } = response.data;
                console.log("_GetRejectionById: ", response);

                if (status !== 200) {
                    console.error(message);
                    AlertService.Error("Opps", message);
                    return;
                }
                
                self.model = data;
                console.log("modelo despues de obtener: ", self.model)
                self.$apply();
            } catch (ex) {
                let error = ErrorService.GetError(ex);
                console.error('Oops...', error);
                AlertService.ErrorHtml('Oops...', error);
            }
        }
        function _ClearForm() {
            self.model.IdRole = null;
        }

        _Init();



    }
})();
