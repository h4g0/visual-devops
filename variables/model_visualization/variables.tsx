import React from 'react'

class Variables extends React.Component {
    
    variables = [" variable1 = example variable", "variable2 = example variable"]
    constructor(props){
        super(props)
    }

    render() {

        return <div>
            {
                this.variables.map((variable, index) => {
                    <p> variable </p>
                })
            }
        </div>
    }
}