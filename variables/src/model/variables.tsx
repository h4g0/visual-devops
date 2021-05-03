import React from 'react'
import "./model.css"

class Variables extends React.Component {
    
    variables = [" variable1 = example variable", "variable2 = example variable"]
    constructor(props: any){
        super(props)
    }

    render() {

        return <div className="variables">
            {
                this.variables.map((variable, index) => {
                    return <p>  {variable} </p>
                })
            }
        </div>
    }
}

export default Variables