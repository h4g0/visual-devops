import React from 'react'
import './model.css'

class Data extends React.Component {
    
    data: string[][] = [["data1","data2"],["data3","data4"]]
    
    constructor(props: any){
        super(props)
    }

    render() {

        return <div className="data">
            {
            this.data.map((col, index) => {
                return col.map((cel, cel_index) => {
                    return <p> {cel} </p>
                })
            })
            }
            </div>
    }
}

export default Data