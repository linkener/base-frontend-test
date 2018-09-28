/**
 * @type    controller
 * @name    WifeframeControlador
 * @desc    Es el controlador para Administrar Areas de Procesos del Sistema
 * @autor   Mauro Xavier Rivera Rasury (fatalfurydeveloper)
 * @email   fatalfurydeveloper@gmail.com
 * @since   01-09-2018
 * @version 1.0
 */
(function(angular) {

 	'use strict';

    /* Definición del controlador en un modulo especifico */
 	angular.module('sri').controller('WifeframeControlador',WifeframeControlador);

    /* Parametros a inyectar en la Funcion Principal*/
 	WifeframeControlador.$inject = ['$rootScope', '$scope', '$uibModal', '$state', '$translate', '$timeout',
        'I18nFactory', '$http', '$q', '$compile', 'DTOptionsBuilder', 'DTColumnBuilder', 'SistemaConstanteValue',
        'ComunServicio'];

    /* Funcion Principal. */
 	function WifeframeControlador($rootScope, $scope, $uibModal, $state, $translate, $timeout,
        i18nFactory, $http,  $q, $compile, DTOptionsBuilder, DTColumnBuilder, SistemaConstanteValue,
        ComunServicio) {
 		/***********************************************************************************
         ******************************** DECLARACION DE VARIABLES *************************
         ***********************************************************************************/
 		var vm = this;
        /* Variables de Etiquetas a Traducir */
        vm.lbl              = SistemaConstanteValue;

        /* Variables para instanciar los campos de la tabla */
        vm.camposTablas = [
            /*{campo:vm.lbl.bd.tes.id, etiqueta:vm.lbl.tbl.id, clase:"text-center", width:10, render:""},*/
            {campo:vm.lbl.bd.tes.value1, etiqueta:vm.lbl.tbl.value1, clase:"text-center", width:30, render:""},
            {campo:vm.lbl.bd.tes.value2, etiqueta:vm.lbl.tbl.value2, clase:"text-center", width:50, render:""},
            {campo:vm.lbl.bd.tes.timestamp, etiqueta:vm.lbl.tbl.timestamp, clase:"text-center", width:10, render:""}
        ];

        vm.alerts           = [];

        /* Variables para instanciar las tablas de la aplicacion */
        vm.dtAdministrar    = [];
        vm.datosTabla       = [];

        /* Variables para llamar a funciones */
        vm.rutas            = ComunServicio.getRutas();
        vm.rutaServicio     = vm.rutas.path;
        vm.init             = inicializar;
        vm.promesaAdministrar = promesaAdministrar;
        vm.crearFilas       = crearFilas;
        vm.agregarAlerta    = agregarAlerta;
        vm.devolverLlamada  = devolverLlamada;
        vm.consultar        = consultar;

 		/***********************************************************************************
         *********************************** FUNCIONES *************************************
         ***********************************************************************************/
 		/* Funcion que detecta un cambio de idioma o traduccion */
        $rootScope.$on('$translateChangeSuccess', inicializar);

        /**
         * @description Funcion para inicializar funcionalidad en nuestra aplicación
         * @return void
         */
        function inicializar(){
            vm.idioma       = i18nFactory.idioma();
            $timeout(consultar,100);
            tablaAdministracion();
        }

        /**
         * @description Funcion para consultar registros
         * @returns void
         */
        function consultar (){
           consultarRegistros(vm.rutas.method.get, vm.rutas.path);
        }

        /**
         * @description Funcion para inicializar Tabla (Opciones y Columnas)
         * @return void
         */
        function tablaAdministracion(){
            vm.dtAdministrarOptions = contruirOpcionesTabla(vm.idioma);
            vm.dtAdministrarColumns = contruirColumnasTabla(vm.camposTablas);
        }

        /**
         * @description Funcion para inicializar tabla
         * @return void
         */
        function contruirColumnasTabla (lista){
            var columnas = [];
            var ultimo = lista.length;
            for(var x= 0;x < ultimo;x++ ){
                columnas.push(
                    DTColumnBuilder.newColumn(lista[x].campo)
                    .withTitle($translate(lista[x].etiqueta))
                    .withClass(lista[x].clase)
                    .withOption('width', lista[x].width)
                    .renderWith(lista[x].render)
                );
            }
            return columnas;
        }

        /**
         * @description Funcion para inicializar tabla
         * @return void
         */
        function contruirOpcionesTabla(idioma){
            var opciones = DTOptionsBuilder.fromFnPromise(promesaAdministrar)
                .withPaginationType('simple_numbers')
                .withOption('info', true)
                .withOption('bFilter', true)
                .withOption('fnDrawCallback', devolverLlamada)
                .withOption('sDom', '<"top"lif>rt<"bottom"p><"clear">')
                .withOption('createdRow', crearFilas)
                .withOption('order', [0, 'asc'])
                .withLanguageSource('recursos/lenguajes/'+idioma+'.json');
            return opciones;
        }

        /**
         * @description Funcion para armar elementos de la tabla
         * @return void
         */
        function devolverLlamada() {
            $compile(angular.element("#tblAdministrarArea" + "_length").contents())($scope);
        }

        /**
         * @description Funcion para crear filas de tabla
         * @returns void
         * @params row columnas de la tabla
         */
        function crearFilas(row) {
            $compile(angular.element(row).contents())($scope);
        }

        /**
         * @description Promesa para la tabla de informacion sujeto;
         * @returns deferred.promise Promesa
         */
        function promesaAdministrar() {
            var deferred = $q.defer();
                deferred.resolve(vm.datosTabla);
            return deferred.promise;
        }

        /**
         * @description Funcion para consultar registros de tabla Area
         * @returns void
         */
        function consultarRegistros(metodo,rutaServicio){
            var datos = armarTramaConsultar(metodo,rutaServicio);
            //console.log(JSON.stringify(datos));
            ComunServicio.invocarPeticion(datos).then(function (respuesta) {
                var timestamp = [];
                var value1    = [];
                var value2 = [];
                var id = [];
                var datos = [];
                angular.forEach(respuesta.data, function(valor){
                    id.push(valor.id);
                    timestamp.push(valor.timestamp);
                    value1.push(valor.value1.toFixed(2));
                    value2.push(valor.value2.toFixed(2));
                    datos.push({ id: valor.id, timestamp: valor.timestamp, value1: valor.value1.toFixed(2),  value2:valor.value2.toFixed(2)});
                });
                /*var timestamp = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
                var value1    = [1, 2, 3, 4, 5, 6, 7];
                var value2 = [1, 2, 3, 4, 5, 6, 7];*/
                generarGrafico(timestamp,value1,value2);
                vm.datosTabla = datos;
                vm.dtAdministrar.reloadData();
            },function() {
                agregarAlerta(vm.lbl.msj.tip.danger,vm.lbl.msj.con.error);
            });
        }

        /**
         * @description Funcion para generar graficos
         * @param {array} [timestamp] [Hora y Fecha]
         * @param {array} [value1] [Valor 1]
         * @param {array} [value2] [Valor2]
         * @returns void
         */
        function generarGrafico(timestamp,value1,value2){
            var config = {
                type: 'line',
                data: {
                    labels: timestamp,
                    datasets: [{
                        label: 'Value1',
                        fill: false,
                        backgroundColor: window.chartColors.red,
                        borderColor: window.chartColors.red,
                        data: value1,
                    }, {
                        label: 'Value2',
                        fill: false,
                        backgroundColor: window.chartColors.blue,
                        borderColor: window.chartColors.blue,
                        data: value2
                    }]
                },
                options: {
                    responsive: true,
                    title: {
                        display: true,
                        text: 'Values/Time'
                    },
                    tooltips: {
                        mode: 'index',
                        intersect: false,
                    },
                    hover: {
                        mode: 'nearest',
                        intersect: true
                    },
                    scales: {
                        xAxes: [{
                            display: true,
                            scaleLabel: {
                                display: true,
                                labelString: 'Timestamp'
                            }
                        }],
                        yAxes: [{
                            display: true,
                            scaleLabel: {
                                display: true,
                                labelString: 'Value'
                            }
                        }]
                    }
                }
            };
            var ctx = document.getElementById('canvas').getContext('2d');
            window.myLine = new Chart(ctx, config);
        }

        /**
         * @description Funcion para agregar alertas a mostrar
         * @param {string} [tipoMensaje] [Definicion del tipo de alerta]
         * @param {string} [mensaje] [Definicion del cuerpo de la alerta]
         * @returns void
         */
        function agregarAlerta(tipoMensaje, mensaje) {
            vm.alerts.push({ type: tipoMensaje, msg: mensaje });
        }

        /**
         * @description Funcion para cerrar alerta mostrada
         * @param {int} [index] [Index de la posicion del elemento en el array]
         * @returns void
         */
        vm.cerrarAlerta = function (index) {
            vm.alerts.splice(index, 1);
        };

        /**
         * @description Funcion para armar la trama GET a consumir del Backend
         * @param {string} [metodo] [Definicion del metodo de la peticion]
         * @param {string} [url] [Definicion de la url de la peticion]
         * @returns {array} [datos] [Define una estructura de trama a enviar por peticion]
         */
        function armarTramaConsultar(metodo, url){
            var datos= {
                metodo: metodo,
                url:    url,
                data:  {
                    //start  : data.id,       /*Indica el Inicio de Fecha */
                    //end    : data.value1,   /*Indica el Fin de Fecha*/
                    //offset : data.value2,   /*Indica los elementos a saltar */
                    limit  : 10 //data.timestamp /* Indica el Limite de elementos a Consultar */
                }
            };
            return datos;
        }

        /**
         * @description Funcion para armar la trama PUT a consumir del Backend
         * @param {string} [metodo] [Definicion del metodo de la peticion]
         * @param {string} [url] [Definicion de la url de la peticion]
         * @returns {array} [datos] [Define una estructura de trama a enviar por peticion]
         */
        function armarTramaActualizar(metodo, url,data){
            var datos= {
                metodo: metodo,
                url:    url,
                data:  {
                    start  : data.id,       /*Indica el Inicio de Fecha */
                    end    : data.value1,   /*Indica el Fin de Fecha*/
                    offset : data.value2,   /*Indica los elementos a saltar */
                    limit  : data.timestamp /* Indica el Limite de elementos a Consultar */
                }
            };
            return datos;
        }
	}
}(window.angular));