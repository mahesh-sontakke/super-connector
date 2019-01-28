
const schedule = require('node-schedule');
let ActiveSrv = require('../../routes/active-campaign/active.srv');

const activeToDbSyncSchedule = function(){
    let syncJob = schedule.scheduleJob('*/1 * * * *', function(ActiveSrv){
        ActiveSrv.getContacts(function(result){
            console.log(result);
        });
        console.log('Execulted')
      }.bind(null,ActiveSrv));
}
module.exports = {
    startSchedules : function(){
        ActiveSrv.init()
        // activeToDbSyncSchedule();
    }

}