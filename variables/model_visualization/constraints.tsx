import React from 'react'

class Constraints extends React.Component {
    
    constraints: string[] = [" constraint1 = example constraint", "constraint2 = example constraint"]
    
    constructor(props){
        super(props)
    }

    render() {

        return <div>
            {
                this.constraints.map((constraint, index) => {
                    <p> constraint </p>
                })
            }
        </div>
    }
}