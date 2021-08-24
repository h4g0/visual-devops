import React from 'react'
import * as Blockly from 'blockly/core';
import { useDispatch } from 'react-redux'
import { collumns } from '../../linearprogramming/linear_programming'
import { read_data } from '../../read_spreadsheet/read_spreadsheet'
import { updateColumns, updateIndexCols, updateIndexes } from '../../update_state/Actions'
import './../model.css'

function ReloadData(props: any) {
    let dispatch = useDispatch()

    const update_values = (cols: collumns,indexes: Map<string,string>,index_cols: string[]) => {
    
    
        console.log(cols)
        console.log(indexes)
        console.log(index_cols)
        
        dispatch( updateColumns( { columns: cols } ) )
    
        dispatch( updateIndexCols( { index_cols: index_cols} ) )
    
        dispatch( updateIndexes( {indexes: indexes} ) )
    
    }
    
    const reloadData = () => {
        const data = read_data("test.xlsx")

        const cols = ( data[0] as collumns)
        const indexes = ( data[1] as Map<string,string> )
        const index_cols = ( data[2] as string[] )
    
        update_values(cols,indexes,index_cols)

        //@ts-ignore
        Blockly.Workspace.prototype.refresh()
    }
 
    return (
        <button onClick={reloadData} className="generator">Reload data</button>
    )
    
}

export default ReloadData