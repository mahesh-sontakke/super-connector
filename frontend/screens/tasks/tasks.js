var Tasks= {};
((()=>{
    Tasks.init = ()=>{
        console.log("===>");
        _render.content()
    }
    var _render={
        content:()=>{
            renderMainFrame('./tasks/tasks.html', '#/tasks', function() {
                console.log("===>");
                _render.datatable();
            })
        },
        datatable:()=>{
            $(function () {
                'use strict';
                $('#datatable1').DataTable({
                  "bLengthChange": false,
                  "bDeferRender": true,
                  searching: true,
                  serverSide: true,
          
                  ajax: function (data, callback, settings) {
                  
                    $.ajax({
                      url: "http://localhost:3000/datatable/deals",
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
                    $('.dataTables_length select').select2({ minimumResultsForSearch: Infinity });
                  },
                  columns: [{
                    data: 'name',
                    render:function(data){
                      var newStr=data.length>20?data.slice(0,20)+'...':data;
                      return '<span>'+newStr+'</span>';
                    }
                  },
                  {
                    data:'createTime',
                    render:function(data){
                      return moment(data).format('lll')
                    }
                  },
                  {
                    data:'syncWithAc',
                    // render:function(data){
                    //   var newData=data? moment(data).format('lll'):data;
                    //   return newData;
                    // }
                  },{
                    data:'taskId'
                  }   
                  ,{
                    data:'statusName'
                  },{
                    data:'assigneeName'
                  },{
                    data:'listName'
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