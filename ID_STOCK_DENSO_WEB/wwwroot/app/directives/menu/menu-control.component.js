function MenuControl_Controller($scope, GeneralInfo, authService) {
    let ctrl = this;
    ctrl.InitializeContent = _initializeContent;
    ctrl.logout = _Logout;
    ctrl.headerName = '';
    ctrl.menu_items = [];

    async function _initializeContent() {
        await GetAdminName();
        await BuildMenu();
    }

    function _Logout() {
        authService.LogOut();
    }

    async function GetAdminName() {
        let session = GeneralInfo.getUserInLS();
        ctrl.headerName = session.name;
    }

    async function BuildMenu() {
        try {
            let permissions = GeneralInfo.getAuthorizationsInLS();
            if (!permissions) {
                permissions = await authService.GetPermissions();
                if (!permissions || permissions.length === 0) return;
            }

            let permisosGroup = d3.group(permissions, d => d.CategoryId);

            permisosGroup.forEach((permisos) => {
                let permisosOrdenados = permisos.filter(item => item.IsEnabled);

                if (permisosOrdenados.length > 0 &&
                    permisosOrdenados[0].Application.toLowerCase() === 'web') {

                    let categoryName = permisosOrdenados[0].Category;
                    let icon = GetIconForCategory(categoryName);
                    let list = buildMenuList(categoryName, permisosOrdenados);

                    let menuData = {
                        Show: true,
                        Name: categoryName,
                        Icon: `lni lni-${icon}`,
                        HasSubcategories: list.some(i => i.Subcategories && i.Subcategories.length > 0),
                        List: list
                    };

                    ctrl.menu_items.push(menuData);
                    $scope.$apply();
                }
            });

            console.log('✅ Menú construido:', ctrl.menu_items);

        } catch (e) {
            console.error('❌ Error en BuildMenu:', e);
        }
    }

    // Construye la lista: con subcategorías si es Catálogos, normal si no
    function buildMenuList(categoryName, permissions) {
        let name = categoryName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        if (name === 'catalogos') {
            return buildCatalogosWithSubcategories(permissions);
        }
        return permissions.map(p => ({
            Permission: p.Permission,
            UrlAccess: p.UrlAccess
        }));
    }

    // Agrupa los permisos de Catálogos en subcategorías
    function buildCatalogosWithSubcategories(permissions) {
        const subcategoryMap = {
            'Almacén': ['almacenes', 'zonas', 'ubicaciones', 'localizaciones'],
            'Producto': ['producto', 'productos', 'refacciones'],
            'Usuarios': ['usuarios', 'roles', 'personal']
        };

        let subcategories = [];
        let matchedPermissions = new Set();

        Object.keys(subcategoryMap).forEach(subcategoryName => {
            let items = permissions.filter(p => {
                let permName = p.Permission.toLowerCase()
                    .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                return subcategoryMap[subcategoryName].some(keyword => permName.includes(keyword));
            });

            if (items.length > 0) {
                items.forEach(p => matchedPermissions.add(p.Permission));
                subcategories.push({
                    Permission: subcategoryName,
                    Icon: getSubcategoryIcon(subcategoryName),
                    Subcategories: items.map(p => ({
                        Permission: p.Permission,
                        UrlAccess: p.UrlAccess
                    }))
                });
            }
        });

        // Items que no matchearon → se agregan como links directos
        permissions
            .filter(p => !matchedPermissions.has(p.Permission))
            .forEach(p => {
                subcategories.push({
                    Permission: p.Permission,
                    UrlAccess: p.UrlAccess
                });
            });

        return subcategories;
    }

    function getSubcategoryIcon(subcategoryName) {
        const iconMap = {
            'Almacén': 'apartment',
            'Producto': 'package',
            'Logística': 'delivery',
            'Usuarios': 'users'
        };
        return iconMap[subcategoryName] || 'menu';
    }

    function GetIconForCategory(category) {
        let name = category.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        switch (name) {
            case 'catalogos': return 'list';
            case 'operaciones': return 'cog';
            case 'reportes': return 'bar-chart';
            case 'parametros': return 'control-panel';
            default: return 'menu';
        }
    }

    ctrl.InitializeContent();
}

MenuControl_Controller.$inject = ['$scope', 'GeneralInfo', 'authService'];

angular.module('app')
    .component('menuControl', {
        templateUrl: 'app/directives/menu/menu-control.component.html',
        controller: MenuControl_Controller,
        bindings: {}
    });