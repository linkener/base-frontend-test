/**
 * @type    Servicio
 * @name    ComunServicio
 * @desc    Es el servicio generico que realiza las peticiones http
 * @autor   Mauro Xavier Rivera Rasury (fatalfurydeveloper)
 * @email   fatalfurydeveloper@gmail.com
 * @since   01-09-2018
 * @version 1.0
 */
(function(angular){
    'use strict';

    angular.module('sri').service('ComunServicio', ComunServicio);

    ComunServicio.$inject = ['$http', '$q', 'SistemaConstanteValue'];

    function ComunServicio($http, $q, SistemaConstanteValue) {
        var vm  = this ;
        vm.lbl  = SistemaConstanteValue;
        vm.path = {};
        obtenerRutas();

        /**
         * @description Funcion para realizar peticiones HTTP
         * @param {datos} [Objeto] [Datos a consultar]
         * @return {[promesa.promise]} [Devuelve la promesa del servicio]
         */
        vm.invocarPeticion = function (datos) {
            var promesa = $q.defer();
            //console.log("datos:"+JSON.stringify(datos));
            $http({
                method: datos.metodo,
                url: datos.url,
                data: datos.data
            }).then(function (respuesta) {
                promesa.resolve(respuesta);
                }, function (error) {
                promesa.reject(error);
            });
            return promesa.promise;
        };


        /**
         * @description Funcion para obtener las url del properties
         * @return {[promesa.promise]} [Devuelve la promesa del servicio]
         */
        vm.obtenerPropiedades = function () {
            var promesa = $q.defer();
            $http.get('conexion.properties').then(function(resp){
                vm.setRutas(resp.data);
                promesa.resolve(resp);
            });
            return promesa.promise;
        };

        /**
         * @description Funcion para obtener las url del properties
         * @return {[promesa.promise]} [Devuelve la promesa del servicio]
         */
        function obtenerRutas () {
            $http.get('conexion.properties').then(function(resp){
                vm.setRutas(resp.data);
            });
        }

        /**
         * @description Funcion para obtener las url del properties
         * @return {vm.path} [Devuelve las rutas]
         */
        vm.getRutas = function () {
            return vm.path;
        };

        /**
         * @description Funcion para setear las url del properties
         * @void
         */
        vm.setRutas = function (rutas) {
            vm.path= rutas;
        };
    }
}(window.angular));