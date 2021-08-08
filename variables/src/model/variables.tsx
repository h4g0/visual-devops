import React from 'react'
import "./model.css"

class Variables extends React.Component {
    
    variable_title = "trucks_loads"
    variables = ["truck1 x load1", "truck2 x load1", "truck1 x load2", "truck2 x load2"]
    constructor(props: any){
        super(props)
    }

    render() {

        return <div className="variables">
            <h4>{this.variable_title}</h4>
            {
                this.variables.map((variable, index) => {
                    return <p> {variable} </p>
                })
            }
        </div>
    }
}

export default Variables