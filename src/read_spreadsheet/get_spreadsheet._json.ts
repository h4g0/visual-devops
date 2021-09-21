const axios = require('axios');

const dotenv = require('dotenv')

dotenv.config()

const read_spreadsheet_server: string =  "https://read-xlsx.herokuapp.com"
//const read_spreadsheet_server: string =  "http://localhost:3000"

console.log(read_spreadsheet_server)

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

    let data = {}
    await axios(config)
    .then(function (response: any) {
    console.log(JSON.stringify(response.data));

    data = response.data
    })
    .catch(function (error: any) {
    console.log(error);
    });


    return data

}

