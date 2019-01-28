

let constants = {
    API_URLS : {
        ACTIVE_CAMPAIGN :  (key) => {
            const BASE_URL = 'https://charlesmcduffee.api-us1.com/api/3';
            let URLS = {
                'contacts' : '/contacts'
            }
            return (URLS[key])?BASE_URL + URLS[key]:''; 
        }
    },
  }
module.exports = constants;