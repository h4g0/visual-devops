import React from 'react'
import './model.css'

class Constraints extends React.Component {
    
    constraints: string[] = ["x[C1][Front] + x[C1][Centre] + x[C1][Rear] <= 18","x[C2][Front] + x[C2][Centre] + x[C2][Rear] <= 15",
    "x[C3][Front] + x[C3][Centre] + x[C3][Rear] <= 23","x[C4][Front] + x[C4][Centre] + x[C4][Rear] <= 12"]
    
    constructor(props: any){
        super(props)
    }

    render() {

        return <div className="constraints">
            <h4>Constraints</h4>
            <ul>
            {
                this.constraints.map((curr: string,index: number) => <li>{curr}</li>)
            }
            </ul>
        </div>
    }
}

export default Constraints