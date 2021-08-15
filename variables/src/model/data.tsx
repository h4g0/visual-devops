import React from 'react'
import DataCols from './data-col'
import './model.css'

class Data extends React.Component {
    
    data: string[][] = [["Front", "Center", "Rear"],["10","16","18"], ["6800","8700","5300"],["C1","C2","C3","C4"],["18","15","23","12"],["480","650","580","390"],["310","380","350","285"]]
    titles: string[] = ["Compartment","Weight_capacity","Space_capacity","Cargo","Weight","Volume","Profit"]

    constructor(props: any){
        super(props)
    }

    render() {

        return (
        <div className="data">
            <h4>Data</h4>
            <div className="data-content">
            {
            this.data.map((col, index) => {
                
                return <DataCols data={col} title={this.titles[index]} ></DataCols>
            })
            }
            </div>
            </div>
        )
        
    }
}

export default Data