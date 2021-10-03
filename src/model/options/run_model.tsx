import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { collumns } from '../../linearprogramming/linear_programming'
import { read_data } from '../../read_spreadsheet/read_spreadsheet'
import { updateColumns, updateIndexCols, updateIndexes, updateResult } from '../../update_state/Actions'
import './../model.css'
import { run_model } from '../../read_spreadsheet/run_model';



function RunModel(props: any) {
    let dispatch = useDispatch()

    const indexes  = ( useSelector((state: any) => state.indexes) as Map<string,string> )
    const index_cols = ( useSelector((state: any) => state.index_cols) as string[] )
    const columns = ( useSelector((state: any) => state.columns) as Map<string,string[]> )
    const variables = ( useSelector((state: any) => state.variables) as Map<string,string[]>)
    const constraints =  ( useSelector((state: any) => state.constraints) as string[])
    const goal =  ( useSelector((state: any) => state.goal) as string)
    const objective = ( useSelector((state: any) => state.objective) as string)

    const update_values = (result: Map<string,number>) => {
    
        dispatch(  updateResult( {result: result} ) )
    
    }
    
    const runModel = async() => {
        console.log("running model")
        const solution = await run_model(indexes , variables, index_cols , constraints,columns ,goal ,objective)
        update_values(solution)
    }

    return (
        <button onClick={runModel} className="generator">Run solver</button>
    )
    
}

export default RunModel