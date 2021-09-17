import { my_variable } from '../linearprogramming/linear_programming'
import { Types } from './Actions'


// Declaração das variáveis globais e dos respetivos set's 

const default_state: any = {
    variables: new Map<string, string[]>(),
    constraints: [],
    goal: "",
    objective: "",
    indexes: new Map<string,string>(),
    index_cols: [],
    columns: new Map<string,string[]>(),
    block_col: new Map<string,string>(),
    result: new Map<string,string>(),
}

export const dataReducer = function (state = default_state , action: any) {
    var new_state: any = { ...state }

    switch ( action.type ) {
        case Types.COLUMNS: 
            //console.log(action)
            new_state.columns = action.payload.columns
            return new_state;
        case Types.CONSTRAINTS: 
            new_state.constraints = [] 
            new_state.constraints.push(...state.constraints)
            new_state.constraints.push(...action.payload.constraints)
            return new_state
        case Types.VARIABLES:
            new_state.variables = new Map(state.variables)
            const name = action.payload.name
            const cols = action.payload.cols
            new_state.variables.set(name,cols)
            return new_state
        case Types.INDEXES:
            new_state.indexes = action.payload.indexes
            return new_state
        case Types.INDEX_COLS:
            new_state.index_cols = action.payload.index_cols
            return new_state
        case Types.BLOCK_COL:
            new_state.block_col = state.block_col
            new_state.block_col.set(action.payload.block,action.payload.index)
            return new_state
        case Types.OBJECTIVE:
            new_state.objective = action.payload.objective
            return new_state
        case Types.GOAL:
            new_state.goal = action.payload.goal
            return new_state
        case Types.RESULT:
            new_state.result = action.payload.result
            return new_state
        case Types.CLEAR:
            new_state.variables =  new Map<string, string[]>()
            new_state.constraints =  []
            new_state.objective =  ""
            new_state.goal = ""
            return new_state
        default: 
            return state;
    } 

}