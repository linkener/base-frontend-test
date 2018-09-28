/**
 * @type    provider
 * @name    RutaProvider
 * @desc    Ruteo desde archivo json. Las rutas son configuradas en dicho archivo mediante carga bajo demanda de
 *          recursos
 * @autor   Mauro Xavier Rivera Rasury (fatalfurydeveloper)
 * @email   fatalfurydeveloper@gmail.com
 * @since   01-09-2018
 * @version 1.0
 */
(function (angular) {
    'use strict';

    /* Definición módulo principal */
    angular.module('sri.rutas', ['ui.router']);

    /* Función que se ejecuta al iniciar el programa.*/
    angular.module('sri.rutas').run(function (Ruta) {Ruta.setUpRoutes();});

    /* Proporciona una API para la configuración antes de que se inicie la aplicación.*/
    angular.module('sri.rutas').provider('Ruta', RutaProvider);

    /* Parametros a inyectar en la Funcion Principal*/
    RutaProvider.$inject = ['$stateProvider'];

    /* Funcion Principal del Providr. */
    function RutaProvider($stateProvider) {
        var urlCollection = 'recursos/datos/rutas.json';
        var estado;

        /*
        this.cargarRecursos = function ($ocLazyLoad, recurso) {
            return $ocLazyLoad.load({name: recurso.name, files: recurso.files});
        };*/
        /* Rutas del Sitio Web. */
        $stateProvider.state('sri-web',{
            url: '/sri-web',
            templateUrl: 'recursos/paginas/sitio-inicio.html',
            data: {
                displayName: 'Inicio'
            },
            resolve: {
                loadMyDirectives: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sri',
                        files: [
                            'recursos/js/directivas/MenuSitioDirectiva.js',
                            'recursos/js/directivas/MenuSistemaDirectiva.js'
                        ]
                    });
                }
            }
        })
        .state('sri-web.wireframe', {
            url: '/GestorArea',
            templateUrl: 'recursos/paginas/wireframe.html',
            data: {
                displayName: 'Wireframe'
            },
            resolve: {
                loadMyDirectives: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'cargaRecursos',
                        files: [
                            "recursos/js/controladores/WireframeControlador.js"
                        ]
                    });
                }
            }
        })
        .state('sri-web.pagina-no-encontrada', {
            templateUrl: 'recursos/paginas/404.html',
            url: '/no-encontrado',
            data: {
                displayName: 'No Encontrado'
            }
        });

        this.$get = function ($http) {
            return {
                setUpRoutes: function () {
                     $http.get(urlCollection).then(function (collection) {
                        angular.forEach(collection.data, function(value){
                            estado = {
                                name: value.name,
                                url: value.url,
                                templateUrl: value.templateUrl,
                                data: {
                                    displayName: value.displayName
                                },
                                resolve: {
                                    loadMyDirectives: function ($ocLazyLoad) {
                                        return $ocLazyLoad.load({
                                            name: value.resolve.displayName,
                                            files: value.resolve.files
                                        });
                                    }
                                }
                            };
                            //console.log("estado: "+ JSON.stringify( estado));
                            $stateProvider.state(value.name,estado);
                        });
                    });
                }
            };
        };

        this.getCollectionUrl = function () {
            return urlCollection;
        };

        this.setCollectionUrl = function (url) {
            urlCollection = url;
        };
    }
}(window.angular));