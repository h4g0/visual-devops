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
    const goal =  ( useSelector((state: any) => state.columns) as string)
    const objective = ( useSelector((state: any) => state.columns) as string)

    const update_values = (result: Map<string,string>) => {
    
        dispatch(  updateResult( {result: result} ) )
    
    }
    
    const runModel = () => {
        console.log("running model")
        run_model(indexes ,index_cols ,["Mixture[Beans] + Mixture[Corn] >= 0"],columns ,"Maximize" ,"Iron[Beans] + ( Mixture[Beans] + Mixture[Corn] ) X 82 + 4 X ( Mixture[Beans] + Mixture[Corn] ) >= ( Mixture[Beans] + Mixture[Corn] ) X 10")
    }

    return (
        <button onClick={runModel} className="generator">Run solver</button>
    )
    
}

export default RunModel