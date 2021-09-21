import React from 'react'
import Generator from './generator'
import './../model.css'
import ReloadData from './reload_data'
import RunModel from './run_model'

export function Options(props: any) {
    
    //data: string[][] = [["data1","data2"],["data3","data4"]]
    const generator = props.generator
  

  
    return (
        <div>
       <Generator generator={generator} > </Generator>
       <RunModel> </RunModel>
       <ReloadData generator={generator}> </ReloadData>
       </div>
    )
    
}

export default Options