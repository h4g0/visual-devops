import React from 'react'
import DataCols from './data-col'
import './../model.css'
import IndexCol from './index-col'

export function ColGroup(props: any)  {
    
    const types = props.types
    const titles = props.titles
    const data = props.data
    

        return (
        <div className="ColGroup">
            {
            data.map((col: any, index: any) => {
                
                return types[index] == "Index" ? <IndexCol data={col} title={titles[index]} > </IndexCol> : <DataCols data={col} title={titles[index]} ></DataCols>
            })
            }
            </div>
        )
        
    
}

export default ColGroup