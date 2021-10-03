import React from 'react'
import './model.css'
import parse from 'html-react-parser'
import { useSelector } from 'react-redux'

export function Result(props: any){
    
    //objective: string = "310*(x<sub>C1,Front</sub> + x<sub>C1,Centre</sub> + x<sub>C1,Rear</sub>) + 380 * (x<sub>C2,Front</sub> + x<sub>C2,Centre</sub> + x<sub>C2,Rear</sub>) + 350 * (x<sub>C3,Front</sub> + x<sub>C3,Centre</sub> + x<sub>C3,Rear</sub>) + 285 * (x<sub>C4,Front</sub> + x<sub>C4,Centre</sub> + x<sub>C4,Rear</sub>)"
    
    const result_map: Map<string,number> = ( useSelector((state: any) => state.result) as Map<string,number>)
    const result = Array.from(result_map.entries()).map( (x: any) =>{
         const variable = x[0] == "Objective" ? "<b>Objective</b> = " + x[1] :
         x[0].replace(/\[/g,"<sub>").replace(/\]/g,"</sub>")  + " = " + x[1]
         return variable
    })
       
    return (

        <div className="result">
            <h4>Result</h4>
            {
            result.map(((curr: string,index: number) => <li>{parse(curr)}</li>))
            }
            
        </div>
    )
}

export default Result