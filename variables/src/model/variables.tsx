import React from 'react'
import { useSelector } from 'react-redux'
import "./model.css"

function Variables(props: any) {   

    const vars: any = ( useSelector((state: any) => state.variables) as Map<string,string[]> )

    const vars_array: [string,string[]][] = Array.from(vars.entries())
    const variables = vars_array.map( (x: [string,string[]]) => `${x[0]} = ${x[1].join("x")}` )
    
    
    return  ( <div className="variables">
        <h4>Variables</h4>
        {    
            variables.map((curr: string, index: number) => <li>{curr}</li>)
        }
        </div> )
}

export default Variables