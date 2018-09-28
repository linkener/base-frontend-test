/**
 * @type    constant
 * @name    SistemaConstanteValue
 * @desc    Define las constantes para los servicios y controladores genéricos para toda la aplicación
 * @autor   Mauro Xavier Rivera Rasury (fatalfurydeveloper)
 * @email   fatalfurydeveloper@gmail.com
 * @since   01-09-2018
 * @version 1.0
 */
(function (angular) {

    'use strict';

    angular.module('sri').value("SistemaConstanteValue", {
        bd:{
            tes:{
                id                  : "id",
                value1              : "value1",
                value2              : "value2",
                timestamp           : "timestamp"
            }
        },
        btn:{
            guardar                 : "BTN.GUARDAR",
            cancelar                : "BTN.CANCELAR",
            limpiar                 : "BTN.LIMPIAR"
        },
        fun:{
            consultar               : "consultar"
        },
        lbl:{
            id                      : "FRM.ID",
            value1                  : "FRM.VALUE1",
            value2                  : "FRM.VALUE2",
            timestamp               : "FRM.TIMESTAMP"
        },
        pag: {
            tes: {
                titulo              : "PAG.TES.TITULO",
                subtitulo           : "PAG.TES.SUBTITULO"
            }
        },
        tbl:{
            id                      : "TBL.ID",
            acciones                : "TBL.ACCIONES",
            value1                  : "TBL.VALUE1",
            value2                  : "TBL.VALUE2",
            timestamp               : "TBL.TIMESTAMP"
        },
        tip:{
            post                    : "POST",
            get                     : "GET"
        }
    });
}(window.angular));