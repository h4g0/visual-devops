import React from 'react'
import { useSelector } from 'react-redux'
import { find_errors_variables } from '../errors/errors'
import { generate_col_variable, generate_col_variable_prety, generate_matrix_variable, generate_matrix_variable_prety } from '../linearprogramming/linear_programming'
import "./model.css"

export function Variables(props: any) {   

    let vars: any = ( useSelector((state: any) => state.variables) )
    let cols: any = ( useSelector((state: any) => state.columns) )

    const variables: [string,string[]][] = Array.from(vars.entries())
    
    const prety_variable = (variable: [string,string[]]) => {
        return variable[1].length > 0 ? `${variable[0]} = ${variable[1].join( " X ")}` : variable[0] 
    }
    
    const expand_variable = (variable: [string,string[]]) => {
        if(variable[1].length == 0) return variable[0]

        if(variable[1].length == 1) return generate_col_variable_prety(cols,variable[0],variable[1][0])

        if(variable[1].length == 2) return generate_matrix_variable_prety(cols,variable[0],variable[1][0],variable[1][1])

        return ""
    }

    return  ( <div className="variables">
        <h4>Variables</h4>
        {    
            variables.map((curr: [string,string[]], index: number) => {
                const errors = find_errors_variables(curr[0],cols)

                const text = errors != "" ? errors : expand_variable(curr)
               
                const color = errors != "" ? "red" : "black"

                return <li><span  style={{color: color}} title={text}>{prety_variable(curr)}</span></li>
            })

        }
        </div> )
}

export default Variables