(function () {
    angular
        .module('app')
        .controller('ProductUploadImageController', ProductUploadImageController);

    ProductUploadImageController.$inject = [
        '$scope',
        '$stateParams',
        'ProductUploadImageService',
        'AlertService',
        'ErrorService',
        'ConstService'
    ];

    function ProductUploadImageController(self, $stateParams, ProductUploadImageService, AlertService, ErrorService, ConstService) {


        async function _Init() {
            _InitValues();
            _RegisterFunctions();
            await _GetImageProductAsync();
        }

        function _InitValues() {
            self.model = {};

            self.productId = $stateParams.id;
            console.log("id product: ", self.productId);
            self.imageRouteCurrent = "/images/imageNotFound.png";
            self.imageRouteToUpload = "/images/imageNotFound.png";
            self.imageFile = null;

        }

        function _RegisterFunctions() {
            self.UploadImage = _UploadImage;
            self.GoBack = _GoBack;
        }

        async function _GetImageProductAsync() {
            try {
                AlertService.Load();
                let response = await ProductUploadImageService.Get(self.productId);
                swal.close();
                const { Status: status, Message: message, Data: data, Counter: counter } = response.data;
                console.log(response);
                if (status !== 200) {
                    console.error(message);
                    AlertService.Error("Opps", message);
                    return;
                }
                self.imageRouteCurrent = _GetImage(data);
                self.imageRouteToUpload = "/images/imageNotFound.png";
                self.$apply();
            } catch (ex) {
                let error = ErrorService.GetError(ex);
                console.error('Oops...', error);
                AlertService.ErrorHtml('Oops...', error);
            }
        }

        async function _UploadImage() {
            if (!self.imageFile || self.imageFile.length===0) {
                AlertService.Error("Opps.", "Seleccionar una imagen");
                return;
            }
            try {
                AlertService.Load();
                let response = await ProductUploadImageService.Upload(self.productId, self.imageFile[0]);
                swal.close();
                const { Status: status, Message: message, Data: data, Counter: counter } = response.data;
                console.log(response);

                if (status !== 200) {
                    console.error(message);
                    AlertService.Error("Opps", message);
                    return;
                }
                _Reset();
                await _GetImageProductAsync();
            } catch (ex) {
                let error = ErrorService.GetError(ex);
                console.error('Oops...', error);
                AlertService.ErrorHtml('Oops...', error);
            }
        }

        

        function _GetImage(imageRoute) {
            if (!imageRoute) return "/images/imageNotFound.png";
            let parts = imageRoute.split("/");
            let scheme = parts[0];

            let container = parts[3];
            let imageName = parts[4];


            return scheme + "//" + ConstService.webApiDomain+"/" + container + "/" + imageName;
        }

        self.SetFile = function (element) {
            self.currentFile = element.files[0];
            if (!self.currentFile) {
                self.imageRouteToUpload = "/images/imageNotFound.png";
                self.imageFile = null;
                return;
            }
            var reader = new FileReader();

            reader.onload = function (event) {
                self.imageRouteToUpload = event.target.result
                self.$apply()

            }
            // when the file is read it triggers the onload event above.
            reader.readAsDataURL(element.files[0]);
        }

        function _Reset() {
            self.imageRouteCurrent = "";
            self.imageRouteToUpload = "/images/imageNotFound.png";
            self.imageFile = null;
        }

        function _GoBack() {
            history.back();
        }

        _Init();

    }
})();
