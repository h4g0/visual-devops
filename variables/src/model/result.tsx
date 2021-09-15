import React from 'react'
import './model.css'
import parse from 'html-react-parser'
import { useSelector } from 'react-redux'

export function Result(props: any){
    
    //objective: string = "310*(x<sub>C1,Front</sub> + x<sub>C1,Centre</sub> + x<sub>C1,Rear</sub>) + 380 * (x<sub>C2,Front</sub> + x<sub>C2,Centre</sub> + x<sub>C2,Rear</sub>) + 350 * (x<sub>C3,Front</sub> + x<sub>C3,Centre</sub> + x<sub>C3,Rear</sub>) + 285 * (x<sub>C4,Front</sub> + x<sub>C4,Centre</sub> + x<sub>C4,Rear</sub>)"
    const result =  ["result1","result2"]    

    return (

        <div className="result">
            <h4>Result</h4>
            {
            result.map(((curr: string,index: number) => <li>{curr}</li>))
            }
            
        </div>
    )
}

export default Result