import React from 'react'
import './model.css'
import parse from 'html-react-parser'

class Constraints extends React.Component {
    
    constraints: string[] = ["x<sub>C1,Front</sub> + x<sub>C1,Centr</sub> + x<sub>C1,Rear</sub> <= 18","x<sub>C2,Front</sub> + x<sub>C2,Centre</sub> + x<sub>C2,Rear</sub> <= 15",
    "x<sub>C3,Front</sub> + x<sub>C3,Centre</sub> + x<sub>C3,Rear</sub> <= 23","x<sub>C4,Front</sub> + x<sub>C4,Centre</sub> + x<sub>C4,Rear</sub> <= 12"]
    
    constructor(props: any){
        super(props)
    }

    render() {

        return <div className="constraints">
            <h4>Constraints</h4>
            
        
                {this.constraints.map((curr: string,index: number) => <li> {parse(curr)} </li>)}
            
        </div>
    }
}

export default Constraints