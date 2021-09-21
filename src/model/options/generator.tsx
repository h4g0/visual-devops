import React from 'react'
import './../model.css'

function Generator(props: any) {
    
    //data: string[][] = [["data1","data2"],["data3","data4"]]
    const generator = props.generator   

 
    return (
        <button onClick={generator} className="generator">Convert</button>
    )
    
}

export default Generator