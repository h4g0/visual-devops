import React from 'react'
import { useSelector } from 'react-redux'
import "./model.css"

export function Variables(props: any) {   

    let vars: any = ( useSelector((state: any) => state.variables) )

    const vars_array: [string,string[]][] = Array.from(vars.entries())
    const variables = vars_array.map( (x: [string,string[]]) => x[1].length > 0 ? `${x[0]} = ${x[1].join( " X ")}` : x[0] )

    console.log(vars_array)
    
    return  ( <div className="variables">
        <h4>Variables</h4>
        {    
            variables.map((curr: string, index: number) => <li>{curr}</li>)
        }
        </div> )
}

export default Variables