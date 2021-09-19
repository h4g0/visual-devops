import React from 'react'
import * as Blockly from 'blockly/core';
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
        run_model(indexes ,index_cols ,columns ,"Maximize" ,"Iron[Beans] - ( Mixture[Beans] + Mixture[Corn] ) X 82.2 + 4 X ( Mixture[Beans] + Mixture[Corn] ) >= ( Mixture[Beans] + Mixture[Corn] ) X 0.4")
    }

    return (
        <button onClick={runModel} className="generator">Run solver</button>
    )
    
}

export default RunModel