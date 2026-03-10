(function () {
    angular
        .module('app')
        .controller('EmailController', EmailController);

    EmailController.$inject = [
        '$scope',
        'EmailService',
        'EmailService',
        'AlertService',
        'ErrorService'
    ];

    function EmailController(self, EmailService, EmailService, AlertService, ErrorService) {

        async function _Init() {
            _InitValues();
            _RegisterFunctions();
            await _GetEmailAsync();
        }

        function _InitValues() {
            self.model = new EmailDtoPost();

            self.emailSelected = "";
            self.emailsToSelect = [];
            self.emailsSelected = [];

            self.validations = EmailService.validations;
        }

        function _RegisterFunctions() {
            self.Save = _Save;
            self.Clear = _ClearForm;

            self.AddEmail = _AddEmail;
            self.RemoveEmail = _RemoveEmail;
            self.RemoveAllEmails = _RemoveAllEmails;
        }

        //async function _GetWarehouseAsync() {
        //    try {
        //        self.warehouses = [];

        //        let params = { 'page': 0, 'itemsPerPage': 0 }

        //        let response = await WarehouseListService.Get(params);
        //        const { Status: status, Message: message, Data: data, Counter: counter } = response.data;
        //        console.log(response);

        //        if (status !== 200) {
        //            console.error(message);
        //            AlertService.Error("Opps", message);
        //            return;
        //        }

        //        self.warehouses = data;
        //        self.$apply();
        //    } catch (ex) {
        //        let error = ErrorService.GetError(ex);
        //        console.error('Oops...', error);
        //        AlertService.ErrorHtml('Oops...', error);
        //    }
        //}

        function _ValidateForm() {
            let stringErrors = "";
            for (const property in self.model) {
                let value = self.model[property];
                //let Validar = self.validations.get(property);
                //if (Validar) {
                //    stringErrors += Validar(value);
                //}
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
                let response = await EmailService.Save(self.model);
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
                await _GetEmailAsync();
            } catch (ex) {
                let error = ErrorService.GetError(ex);
                console.error('Oops...', error);
                AlertService.ErrorHtml('Oops...', error);
                return false
            }
        }

        function _ClearForm() {
            self.model = new EmailDtoPost();
            self.$apply();
        }

        async function _GetEmailAsync() {
            try {
                let params = { 'Page': 0, 'ItemsPerPage': 0 }
                let response = await EmailService.GetEmail(params);
                const { Status: status, Message: message, Data: data, Counter: counter } = response.data;
                console.log(response);
                if (status !== 200) {

                    throw message;
                }
                console.log("correos asignados: ", data);
                self.emailsSelected = data.map(x => x);
                self.model.Emails = data.map(x => x);
                self.$apply();
            } catch (ex) {
                throw ex;
            }
        }

        async function _AddEmail() {
            let emailId = parseInt(self.emailSelected);
            console.log("lista: ", self.emailsSelected, " responsable nuevo: ", emailId);

            if (isNaN(emailId) || emailId <= 0) {
                AlertService.ErrorHtml('Oops...', "Seleccionar Responsable");
                return;
            }

            let exists = self.emailsSelected.some(x => x.StaffId === emailId);

            console.log("existe: ", exists);


            if (exists) {
                AlertService.ErrorHtml('Oops...', "Responsable Agregado.");
                return;
            }

            let emailData = self.emailsToSelect.find(x => x.StaffId === emailId);
            self.emailsSelected.push(emailData);
            self.model.Emails.push(emailData);
            console.log("responsables seleccionados: ", self.emailsSelected);
        }

        async function _RemoveEmail(id) {
            let index = self.emailsSelected.findIndex(x => x.StaffId === id);
            self.emailsSelected.splice(index, 1);
            self.model.Emails.splice(index, 1);
            let response = await EmailService.Delete(id);

            const { Status: status, Message: message, Data: data, Counter: counter } = response.data;
            console.log(response);
            if (status !== 200) {

                throw message;
            }
            self.$apply();
        }

        async function _RemoveAllEmails() {
            self.emailsSelected = [];
            self.model.Emails = [];
        }

        _Init();

    }
})();
