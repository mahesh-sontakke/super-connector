var Contacts= {};
((()=>{
    Contacts.init = ()=>{
        console.log("===>");
        _render.content()
    }
    var _render={
        content:()=>{
            renderMainFrame('/contacts/contacts.html', '#/contacts', function() {
                console.log("===>");
                _render.datatable();
            })
        },
        datatable:()=>{
            $(function(){
                'use strict';
        
                $('#datatable1').DataTable({
                "bLengthChange": false,
                "bDeferRender": true,
                searching: true,
                serverSide: true,
        
                ajax: function (data, callback, settings) {
                
                  $.ajax({
                    url: "http://localhost:3000/datatable/contacts",
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
        
                },
                columns: [{
                  data: 'name',
                },
                {
                  data:'email',
                  // render:function(data){
                  //   return moment(data).format('lll')
                  // }
                },
                {
                  data:'id',
                 
                },   
                {
                    data:'syncWithAc',
                   
                  },   
                  {
                    data:'acId',
                    render:function(aData){
                        return aData? aData:'';
                    }
                  },        
                
                ],
                scrollCollapse: true,
                scroller: true,
                deferRender: true,
                bAutoWidth: false
        
              });
        
              
               
                $('.dataTables_length select').select2({ minimumResultsForSearch: Infinity });
        
              });        
        }
    }
}).bind(Contacts))()