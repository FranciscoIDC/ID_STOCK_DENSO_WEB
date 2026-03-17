(function () {
    'use strict';

    angular
        .module('app')
        .factory('UrlService', UrlService);

    UrlService.$inject = ['$http', 'ConstService'];

    function UrlService($http, ConstService) {
        let base = ConstService.webApiIp;
        let baseToken = ConstService.token;
        let baseStaff = base + 'Staff';
        let baseRole = base + 'Role';

        let baseProduct = base + 'Product';
        let baseInventory = base + 'Inventory';

        let baseLogin = base + 'Login/';
        let baseWarehouse = base + 'Warehouse';
        let baseLocation = base + 'Location';
        let baseImage = base + 'Image';
        //let baseLocalization = base + 'Localization';
        let baseZone = base + 'Zone';
        let baseAssetLog = base + 'AssetLog';
        let baseInbound = base + 'Inbound';
        let baseInboundProduct = base + 'InboundProduct';
        let baseOutbound = base + 'Outbound';
        let baseStock = base + 'Stock';
        let baseMovementLog = base + 'MovementLog';

        let basePurchaseOrder = base + 'PurchaseOrder';
        let baseRequisitionOrder = base + 'Requisition';



        let service = {
            token: baseToken,

            postRequestLogin: baseLogin + 'Authentication',

            getLogLastMoves: baseMovementLog + '/Last-Moves',

            getWarehouse: baseWarehouse + '',
            getWarehouseById: baseWarehouse + '/{id}',
            postWarehouse: baseWarehouse + '/',
            putWarehouse: baseWarehouse + '/',
            deleteWarehouse: baseWarehouse + '/{id}',

            getZone: baseZone + '',
            postZone: baseZone + '/Save',
            putZone: baseZone + '/Update',
            getZoneById: baseZone + '/{id}',
            deleteZone: baseZone + '/{id}',

            getLocation: baseLocation + '',
            postLocation: baseLocation + '/Save',
            putLocation: baseLocation + '/Update',
            getLocationById: baseLocation + '/{id}',
            deleteLocation: baseLocation + '/{id}',

            //sync 
            getLocationSync: baseLocation + '/Sync',

            getProductFull: baseProduct + '',
            getProductLast: baseProduct + '/Last',
            getProductById: baseProduct + '/{id}',
            getProductByBarcode: baseProduct + '/{barcode}',
            getProductImage: baseProduct + '/{id}/ImageRoute',
            uploadProductImage_FormData: baseProduct + '/UploadImage-Form_Data/{id}',

            getStaff: baseStaff + '',
            postStaff: baseStaff + '/Save',
            putStaff: baseStaff + '/Update',
            getStaffById: baseStaff + '/{id}',
            printTagStaff: baseStaff + "/PrintTag",
            postPasswordRecovery: baseStaff + '/PasswordRecovery',

            getRole: baseRole + "",
            postUpsert: baseRole + "/Upsert",
            postUpsertPermissions: baseRole + "/UpsertPermissions/{roleId}",
            getRoleById: baseRole + "/GetById/{id}",
            getRolePermissions: baseRole + "/GetPermissions/{roleId}",

            getAssetLogLastMoves: baseAssetLog + '/Last-Moves-Group-By-Name',

            getInventory: baseInventory + '',
            getImagesInventory: baseInventory + '/GetImagesById/{id}',
            getInventoryDetail: baseInventory + '/Detail',

            getInbound: baseInbound + '',

            getInboundReport: baseInboundProduct + '/Report',

            getOutboundReport: baseRequisitionOrder + '/OutboundReport',

            getOutbound: baseOutbound + '',

            getStock: baseStock + '',
            getStockReport: baseStock + '',
            getStockTags: baseStock + '/Tags/',  

            getInventoryList: baseInventory + '/List',
            getInventoryDetailWeb: baseInventory + '/DetailWeb',
            getInventoryTagsByPart: baseInventory + '/TagsByPart',

            //Denso

            getPurchaseOrder: basePurchaseOrder + '',
            postPurchaseOrders: basePurchaseOrder + '',
            putPurchaseOrders: basePurchaseOrder + '',
            getPurchaseOrdersById: basePurchaseOrder + '/{id}',

            getRequisitionOrder: baseRequisitionOrder + '',
            postRequisitionOrder: baseRequisitionOrder + '',
            getRequisitionOrder: baseRequisitionOrder + '',
            getRequisitionOrderById: baseRequisitionOrder + '/{id}',

        };

        return service;

    }
})();