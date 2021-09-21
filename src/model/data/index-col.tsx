import React from 'react'
import './../model.css'

export function IndexCol(props: any) {
    
    //data: string[][] = [["data1","data2"],["data3","data4"]]
    const title: string = props.title
    const data: string[] = props.data

    console.log(`title ${title}`)
    console.log(data)
    return (
        <div className="IndexCol">
            <h4>{title}</h4>
            {
            data.map((col, index) => {
              return <p>{col}</p>
            })
            }
            </div>
    )
    
}

export default IndexCol