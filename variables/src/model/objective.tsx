import React from 'react'
import './model.css'

class Objective extends React.Component {
    
    objective: string = "310*(x[C1][Front] + x[C1][Centre] + x[C1][Rear]) + 380 * (x[C2][Front] + x[C2][Centre] + x[C2][Rear]) + 350 * (x[C3][Front] + x[C3][Centre] + x[C3][Rear]) + 285 * (x[C4][Front] + x[C4][Centre] + x[C4][Rear])"
    
    constructor(props: any){
        super(props)
    }

    render() {

        return <div className="objective">
            <p> <b>Objective:</b> <b>Maximize</b> {this.objective} </p>
        </div>
    }
}

export default Objective