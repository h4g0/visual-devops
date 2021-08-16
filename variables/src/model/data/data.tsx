import React from 'react'
import DataCols from './data-col'
import './../model.css'
import IndexCol from './index-col'
import ColGroup from './col-group'

export function Data(props: any)  {
    
    const types: string[][] = [["Index","Data","Data"],["Index","Data","Data","Data"]]
    const data: string[][][] = [[["Front", "Center", "Rear"],["10","16","18"], ["6800","8700","5300"]],[["C1","C2","C3","C4"],["18","15","23","12"],["480","650","580","390"],["310","380","350","285"]]]
    const titles: string[][] = [["Compartment","Weight_capacity","Space_capacity"],["Cargo","Weight","Volume","Profit"]]

    

        return (
        <div className="data">
            <h4>Data</h4>
            <div className="data-content">
            {
            data.map((col, index) => {
                
                return <ColGroup types={types[index]} data={data[index]} titles={titles[index]}></ColGroup>
            })
            }
            </div>
            </div>
        )
        
    
}

export default Data