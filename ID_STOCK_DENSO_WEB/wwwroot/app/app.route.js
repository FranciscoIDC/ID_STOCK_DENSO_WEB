angular.module("app")
    .config(function ($stateProvider, $urlRouterProvider) {

    //$urlRouterProvider.when("/asset", "/profile/general");
    $urlRouterProvider.when("/admin/catalog/asset", "/admin/catalog/asset/list");


    $stateProvider
        .state("main", {
            url: '',
            redirectTo: 'login',
            data: {
                requiresAuth: false,
                typeUserAllowed: []
            }
        })
        .state('login', {
            url: '/auth/login',
            templateUrl: 'app/pages/auth/login/login.page.html',
            controller: 'LoginController',
            data: {
                requiresAuth: false,
                menuID: 0,
                typeUserAllowed: []
            }
        })
        .state('recover_password', {
            url: '/auth/recover_password',
            templateUrl: 'app/pages/auth/recover_password/recover_password.page.html',
            controller: 'RecoverPasswordController',
            data: {
                requiresAuth: false,
                menuID: 0,
                typeUserAllowed: []
            }
        })
        .state('home', {
            url: '/admin/dashboard/home',
            templateUrl: 'app/pages/admin/home/home.page.html',
            controller: 'HomeController',
            data: {
                requiresAuth: true,
                menuID: 0,
                typeUserAllowed: [1, 2]
            }
        })
        .state('warehouse', {
            abstract: true,
            url: '/admin/catalog/warehouse',
            templateUrl: 'app/pages/admin/warehouse/warehouse.page.html',
            //template:'<ui-view/>',
            controller: 'WarehouseController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        })
        .state('warehouse.list', {
            url: '/list',
            templateUrl: 'app/pages/admin/warehouse/list/warehouse-list.page.html',
            controller: 'WarehouseListController',
            data: {
                requiresAuth: true,
                menuID: 1,
                typeUserAllowed: [1, 2]
            }
        }).state('warehouse.add', {
            url: '/add',
            templateUrl: 'app/pages/admin/warehouse/add/warehouse-add.page.html',
            controller: 'WarehouseAddController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('warehouse.edit', {
            url: '/:id/edit',
            templateUrl: 'app/pages/admin/warehouse/edit/warehouse-edit.page.html',
            controller: 'WarehouseEditController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('zone', {
            abstract: true,
            url: '/admin/catalog/zone',
            templateUrl: 'app/pages/admin/zone/zone.page.html',
            //template:'<ui-view/>',
            controller: 'ZoneController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('zone.list', {
            url: '/list',
            templateUrl: 'app/pages/admin/zone/list/zone-list.page.html',
            controller: 'ZoneListController',
            data: {
                requiresAuth: true,
                menuID: 2,
                typeUserAllowed: [1, 2]
            }
        }).state('zone.add', {
            url: '/add',
            templateUrl: 'app/pages/admin/zone/add/zone-add.page.html',
            controller: 'ZoneAddController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('zone.edit', {
            url: '/:id/edit',
            templateUrl: 'app/pages/admin/zone/edit/zone-edit.page.html',
            controller: 'ZoneEditController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('location', {
            abstract: true,
            url: '/admin/catalog/location',
            templateUrl: 'app/pages/admin/location/location.page.html',
            //template:'<ui-view/>',
            controller: 'LocationController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('location.list', {
            url: '/list',
            templateUrl: 'app/pages/admin/location/list/location-list.page.html',
            controller: 'LocationListController',
            data: {
                requiresAuth: true,
                menuID: 3,
                typeUserAllowed: [1, 2]
            }
        }).state('location.add', {
            url: '/add',
            templateUrl: 'app/pages/admin/location/add/location-add.page.html',
            controller: 'LocationAddController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('location.edit', {
            url: '/:id/edit',
            templateUrl: 'app/pages/admin/location/edit/location-edit.page.html',
            controller: 'LocationEditController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('staff', {
            abstract: true,
            url: '/admin/catalog/staff',
            templateUrl: 'app/pages/admin/staff/staff.page.html',
            //template:'<ui-view/>',
            controller: 'StaffController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('staff.list', {
            url: '/list',
            templateUrl: 'app/pages/admin/staff/list/staff-list.page.html',
            controller: 'StaffListController',
            data: {
                requiresAuth: true,
                menuID: 7,
                typeUserAllowed: [1, 2]
            }
        }).state('staff.add', {
            url: '/add',
            templateUrl: 'app/pages/admin/staff/add/staff-add.page.html',
            controller: 'StaffAddController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('staff.edit', {
            url: '/:id/edit',
            templateUrl: 'app/pages/admin/staff/edit/staff-edit.page.html',
            controller: 'StaffEditController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('assetMovement', {
            abstract: true,
            url: '/admin/report/asset_movements',
            templateUrl: 'app/pages/admin/asset_movements/assetmovements.page.html',
            //template:'<ui-view/>',
            controller: 'AssetMovementController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('assetMovement.list', {
            url: '/list',
            templateUrl: 'app/pages/admin/asset_movements/list/assetmovements-list.page.html',
            controller: 'AssetMovementListController',
            data: {
                requiresAuth: true,
                menuID: 19,
                typeUserAllowed: [1, 2]
            }
        }).state('assetMovement.detail', {
            url: '/:id/detail',
            templateUrl: 'app/pages/admin/asset_movements/detail/assetmovements-detail.page.html',
            controller: 'AssetMovementDetailController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('role', {
            abstract: true,
            url: '/admin/catalog/role',
            templateUrl: 'app/pages/admin/role/role.page.html',
            //template:'<ui-view/>',
            controller: 'RoleController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        })
        .state('role.list', {
            url: '/list',
            templateUrl: 'app/pages/admin/role/list/role-list.page.html',
            controller: 'RoleListController',
            data: {
                requiresAuth: true,
                menuID: 8,
                typeUserAllowed: [1, 2]
            }
        }).state('role.add', {
            url: '/add',
            templateUrl: 'app/pages/admin/role/add/role-add.page.html',
            controller: 'RoleAddController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('role.edit', {
            url: '/:id/edit',
            templateUrl: 'app/pages/admin/role/edit/role-edit.page.html',
            controller: 'RoleEditController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('product', {
            abstract: true,
            url: '/admin/catalog/product',
            templateUrl: 'app/pages/admin/product/product.page.html',
            //template:'<ui-view/>',
            controller: 'ProductController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('product.list', {
            url: '/list',
            templateUrl: 'app/pages/admin/product/list/product-list.page.html',
            controller: 'ProductListController',
            data: {
                requiresAuth: true,
                menuID: 4,
                typeUserAllowed: [1, 2]
            }
        }).state('product.edit', {
            url: '/:id/edit',
            templateUrl: 'app/pages/admin/product/edit/product-edit.page.html',
            controller: 'ProductEditController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('product.uploadImage', {
            url: '/:id/upload-image',
            templateUrl: 'app/pages/admin/product/upload-image/upload-image.page.html',
            controller: 'ProductUploadImageController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('inventory', {
            abstract: true,
            url: '/admin/report/inventory',
            templateUrl: 'app/pages/admin/inventory/inventory.page.html',
            //template:'<ui-view/>',
            controller: 'InventoryController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('inventory.list', {
            url: '/list',
            templateUrl: 'app/pages/admin/inventory/list/inventory-list.page.html',
            controller: 'InventoryListController',
            data: {
                requiresAuth: true,
                menuID: 13,
                typeUserAllowed: [1, 2]
            }
        }).state('inventory.detail', {
            url: '/:id/detail',
            templateUrl: 'app/pages/admin/inventory/detail/inventory-detail.page.html',
            controller: 'InventoryDetailController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('inbound', {
            abstract: true,
            url: '/admin/catalog/inbound',
            templateUrl: 'app/pages/admin/inbound/inbound.page.html',
            controller: 'InboundController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('inbound.list', {
            url: '/list',
            templateUrl: 'app/pages/admin/inbound/list/inbound-list.page.html',
            controller: 'InboundListController',
            data: {
                requiresAuth: true,
                menuID: 19,
                typeUserAllowed: [1, 2]
            }
        }).state('inbound.report', {
            url: '/report',
            templateUrl: 'app/pages/admin/inbound/report/inbound-report.page.html',
            controller: 'InboundReportController',
            data: {
                requiresAuth: true,
                menuID: 11,
                typeUserAllowed: [1, 2]
            }
        }).state('stock', {
            abstract: true,
            url: '/admin/catalog/stock',
            templateUrl: 'app/pages/admin/stock/stock.page.html',
            controller: 'StockController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('stock.report', {
            url: '/report',
            templateUrl: 'app/pages/admin/stock/report/stock-report.page.html',
            controller: 'StockReportController',
            data: {
                requiresAuth: true,
                menuID: 14,
                typeUserAllowed: [1, 2]
            }
        }).state('outbound', {
            abstract: true,
            url: '/admin/catalog/outbound',
            templateUrl: 'app/pages/admin/outbound/outbound.page.html',
            controller: 'OutboundController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('outbound.list', {
            url: '/list',
            templateUrl: 'app/pages/admin/outbound/list/outbound-list.page.html',
            controller: 'OutboundListController',
            data: {
                requiresAuth: true,
                menuID: 25,
                typeUserAllowed: [1, 2]
            }
        }).state('outbound.report', {
            url: '/report',
            templateUrl: 'app/pages/admin/outbound/report/outbound-report.page.html',
            controller: 'OutboundReportController',
            data: {
                requiresAuth: true,
                menuID: 12,
                typeUserAllowed: [1, 2]
            }
        }).state('purchaseorder', {
            abstract: true,
            url: '/admin/catalog/purchaseorder',
            templateUrl: 'app/pages/admin/purchaseorder/purchaseorder.page.html',
            //template:'<ui-view/>',
            controller: 'PurchaseOrderController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('purchaseorder.list', {
            url: '/list',
            templateUrl: 'app/pages/admin/purchaseorder/list/purchaseorder-list.page.html',
            controller: 'PurchaseOrderListController',
            data: {
                requiresAuth: true,
                menuID: 9,
                typeUserAllowed: [1, 2]
            }
        }).state('requisitionorder', {
            abstract: true,
            url: '/admin/catalog/requisitionorder',
            templateUrl: 'app/pages/admin/requisitionorder/requisitionorder.page.html',
            //template:'<ui-view/>',
            controller: 'RequisitionOrderController',
            data: {
                requiresAuth: true,
                typeUserAllowed: [1, 2]
            }
        }).state('requisitionorder.list', {
            url: '/list',
            templateUrl: 'app/pages/admin/requisitionorder/list/requisitionorder-list.page.html',
            controller: 'RequisitionOrderListController',
            data: {
                requiresAuth: true,
                menuID: 10,
                typeUserAllowed: [1, 2]
            }
        });

}).run(async function ($rootScope, authService) {
    console.log("*** RUN | metodo run iniciando");

    $rootScope.$on('$stateChangeStart', function (ev, to, toParams, from, fromParams) {
        console.log("$stateChangeStart")
        //    AuthService.Check(to, from);
        //AuthService.IsLogged(to, from);
        authService.IsLogged(to);
    });

    $rootScope.$on('$stateNotFound',
        function (event, unfoundState, fromState, fromParams) {
            console.log("$stateNotFound");
            console.log(unfoundState.to);  // "lazy.state"
            console.log(unfoundState.toParams);  // {a: 1 , b: 2} 
            console.log(unfoundState.opciones); // {heredar: falso} + opciones predeterminadas 
        })

    $rootScope.$on('$stateChangeError', function (evento, toState, toParams, fromState, fromParams, error) {
        console.debug("$stateChangeError");
    });
});