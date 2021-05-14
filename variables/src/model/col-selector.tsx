import React from 'react'
import './model.css'

class ColSelector extends React.Component {
    
    col: string = ""
    fun: any
    
    constructor(props: any){
        super(props)
        this.col = props.col
        this.fun = props.fun
    }

    render() {

        return <button onClick={this.fun}> {this.col} </button>
    }
}

export default ColSelector