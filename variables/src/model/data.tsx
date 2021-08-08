import React from 'react'
import DataCols from './data-col'
import './model.css'

class Data extends React.Component {
    
    data: string[][] = [["truck1","truck2"],["1","2"],["load1","load2"],["2","2"]]
    titles: string[] = ["trucks","gaspriceshour","loads","profit"]

    constructor(props: any){
        super(props)
    }

    render() {

        return <div className="data">
            {
            this.data.map((col, index) => {
                
                return <DataCols data={col} title={this.titles[index]} ></DataCols>
            })
            }
            </div>
    }
}

export default Data