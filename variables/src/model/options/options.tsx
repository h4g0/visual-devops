import React from 'react'
import Generator from './generator'
import './../model.css'

export function Options(props: any) {
    
    //data: string[][] = [["data1","data2"],["data3","data4"]]
    const generator = props.generator
  

  
    return (
       <Generator generator={generator}/>
    )
    
}

export default Options