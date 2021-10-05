import React from 'react'
import './model.css'
import parse from 'html-react-parser'
import { useSelector } from 'react-redux'
import { find_errors_constraints } from '../errors/errors'

export function Constraints(props: any){
    
    //constraints: string[] = ["x<sub>C1,Front</sub> + x<sub>C1,Centr</sub> + x<sub>C1,Rear</sub> <= 18","x<sub>C2,Front</sub> + x<sub>C2,Centre</sub> + x<sub>C2,Rear</sub> <= 15",
    //"x<sub>C3,Front</sub> + x<sub>C3,Centre</sub> + x<sub>C3,Rear</sub> <= 23","x<sub>C4,Front</sub> + x<sub>C4,Centre</sub> + x<sub>C4,Rear</sub> <= 12"]
    const constraints: string[] = ( useSelector((state: any) => state.constraints) as string[])
       
    const variables = ( useSelector((state: any) => state.variables) as Map<string,string[]> )

    const prety_constraint = (x: string) => {
        return x.replace(/\[/g,"<sub>").replace(/\]/g,"</sub>")
        .replace(/\<sub\>\<\/sub\>/g,"<sub>,</sub>")
    }

    console.log(constraints)
    return (
         <div className="constraints">
            <h4>Constraints</h4>
            
        
                {constraints.map((curr: string,index: number) => {
                    const errors = find_errors_constraints(curr,variables)

                    const color = errors != "" ? "red" : "black"

                    return <li> <span  style={{color: color}} title={errors} > {parse(prety_constraint(curr))} </span> </li>
                }
                    )}
            
        </div>
    )
}

export default Constraints