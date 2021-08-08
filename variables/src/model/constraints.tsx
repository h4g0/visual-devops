import React from 'react'
import './model.css'

class Constraints extends React.Component {
    
    constraints: string[] = ["trucks_loads[truck1][load1] > gaspriceshour[load1]","trucks_loads[truck2][load2] > gaspriceshour[load2]"]
    
    constructor(props: any){
        super(props)
    }

    render() {

        return <div className="constraints">
            {
                this.constraints.map((constraint, index) => {
                    return <p className="modeltext"> {constraint} </p>
                })
            }
        </div>
    }
}

export default Constraints