import React from 'react'
import './model.css'

class Objective extends React.Component {
    
    objective: string = "truck_loads[truck1][load1] + truck_loasd[truck2][load1] + truck_loads[truck1][load2] + truck_loads[truck2][load2]"
    
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