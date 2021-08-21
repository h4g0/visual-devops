import React from 'react'
import DataCols from './data-col'
import './../model.css'
import IndexCol from './index-col'
import ColGroup from './col-group'
import { useSelector } from 'react-redux'
import { get_data, get_titles, get_types } from '../../data/get_data'

export function Data(props: any)  {
    
    //const types: string[][] = [["Index","Data","Data"],["Index","Data","Data","Data"]]
    //const data: string[][][] = [[["Front", "Center", "Rear"],["10","16","18"], ["6800","8700","5300"]],[["C1","C2","C3","C4"],["18","15","23","12"],["480","650","580","390"],["310","380","350","285"]]]
    //const titles: string[][] = [["Compartment","Weight_capacity","Space_capacity"],["Cargo","Weight","Volume","Profit"]]
   
    const cols: any = useSelector((state: any) => state.columns)
    const index_cols: any = useSelector((state: any) => state.index_cols)
    const indexes: any = useSelector((state: any) => state.indexes)

    const types = get_types(cols,index_cols)
    const data = get_data(cols,index_cols)
    const titles = get_titles(cols,index_cols)

    console.log(cols)
    console.log(indexes)
    console.log(types)
    console.log(data)
    console.log(titles)

    //let username : any = useSelector((state: any) => state.user)
    //let password : any = useSelector((state: any) => state.password)
    

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