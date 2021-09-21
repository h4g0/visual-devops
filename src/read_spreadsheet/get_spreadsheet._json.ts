const axios = require('axios');

const dotenv = require('dotenv')

dotenv.config()

const read_spreadsheet_server: string =  (process.env.SPREADSHEET_SERVER as string)

export async function get_spreadsheet_json(file: any) {
    
   const formData = new FormData();
   formData.append('file', file)

    const config = {
    method: 'post',
    url: `${read_spreadsheet_server}/readspreadsheet`,
    headers: { 
        'Content-Type':  "multipart/form-data" 
    },
    data : formData
    };

    await axios(config)
    .then(function (response: any) {
    console.log(JSON.stringify(response.data));

    return response.data
    })
    .catch(function (error: any) {
    console.log(error);
    });

    return {}
}

