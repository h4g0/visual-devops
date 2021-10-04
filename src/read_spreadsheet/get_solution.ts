const axios = require('axios')

const location = "https://read-xlsx.herokuapp.com/"

export async function get_solution(model: string): Promise<any>{
    
    let solution = null

    const data = JSON.stringify( {
        model: model
    })

    try {

      const config = {
        method: 'post',
        url: location + "solver",
        headers: { 
            'Content-Type': 'application/json'
        },
        data: data
      };
                
      await axios(config)
        .then(function (response: any) {
          //console.log(response)
          console.log(response)
          solution = response.data
      })
   
     return solution
    }
    catch(e){
      console.log(e)
    }
  }