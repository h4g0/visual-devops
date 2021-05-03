import React from 'react'
import './model.css'

class Objective extends React.Component {
    
    objective: string = "example objective"
    
    constructor(props: any){
        super(props)
    }

    render() {

        return <div className="objective">
            <p> {this.objective} </p>
        </div>
    }
}

export default Objective