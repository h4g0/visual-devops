import React from 'react'
import './model.css'

class Constraints extends React.Component {
    
    constraints: string[] = [" constraint1 = example constraint", "constraint2 = example constraint"]
    
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