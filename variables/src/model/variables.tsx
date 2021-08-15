import React from 'react'
import "./model.css"

class Variables extends React.Component {
    
    variable_title = "trucks_loads"
    variables = ["x = Compartment x Cargo"]
    constructor(props: any){
        super(props)
    }

    render() {

        return <div className="variables">
            <h4>Variables</h4>
            {
                this.variables.map((curr: string, index: number) => <li>{curr}</li>)
            }
        </div>
    }
}

export default Variables