var Crons = {};
((() => {
    Crons.init = () => {
        console.log("===>");
        _render.content()
    }
    var _render = {
        content: () => {
            renderMainFrame('/crons/crons.html', '#/crons', function () {
                console.log("===>");
                _render.datatable();
            })
        },
        datatable: () => {
            $(function () {
                'use strict';

                $('#datatable1').DataTable({
                    "bLengthChange": false,
                    "bDeferRender": true,
                    searching: false,
                    serverSide: true,

                    ajax: function (data, callback, settings) {

                        $.ajax({
                            url: "http://localhost:3000/datatable/crons",
                            type: "get",
                            data: data,
                            success: function (successData) {
                                callback(successData)
                            },
                            error: function (errData) {
                                alert(errData);
                            }
                        });
                    },
                    "drawCallback": function () {
                        $('.dataTables_length select').select2({
                            minimumResultsForSearch: Infinity
                        });
                    },
                    columns: [{
                            data: 'task',
                        },
                        {
                            data: 'startAt',
                            render:function(data){
                              return moment(data).format('lll')
                            }
                        },
                        {
                            data: 'status',
                            // render:function(data){
                            //   var newData=data? moment(data).format('lll'):data;
                            //   return newData;
                            // }
                        },
                        {
                            data:'startBy',
                        },
                        {
                            data:'finishAt',
                            render:function(data){
                                if(!data){return ''}
                                return moment(data).format('lll')
                              }
                        }

                    ],
                    scrollCollapse: true,
                    scroller: true,
                    deferRender: true,
                    bAutoWidth: false

                });



            });
        }
    }
}).bind())()