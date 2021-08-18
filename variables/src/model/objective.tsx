import React from 'react'
import './model.css'
import parse from 'html-react-parser'

class Objective extends React.Component {
    
    objective: string = "310*(x<sub>C1,Front</sub> + x<sub>C1,Centre</sub> + x<sub>C1,Rear</sub>) + 380 * (x<sub>C2,Front</sub> + x<sub>C2,Centre</sub> + x<sub>C2,Rear</sub>) + 350 * (x<sub>C3,Front</sub> + x<sub>C3,Centre</sub> + x<sub>C3,Rear</sub>) + 285 * (x<sub>C4,Front</sub> + x<sub>C4,Centre</sub> + x<sub>C4,Rear</sub>)"
    
    constructor(props: any){
        super(props)
    }

    render() {

        return <div className="objective">
            <p> <b>Objective:</b> <b>Maximize</b> {parse(this.objective)} </p>
        </div>
    }
}

export default Objective