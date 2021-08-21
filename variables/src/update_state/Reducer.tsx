import { Types } from './Actions'


// Declaração das variáveis globais e dos respetivos set's 

const default_state: any = {
    variables: [],
    constraints: [],
    indexes: new Map<string,string>(),
    index_cols: [],
    columns: new Map<string,string[]>()
}

export const dataReducer = function (state = default_state , action: any) {
    var new_state: any = { ...state }

    switch ( action.type ) {
        case Types.COLUMNS: 
            //console.log(action)
            new_state.columns = action.payload.columns
            return new_state;
        case Types.CONSTRAINTS: 
            new_state.constraints = action.payload.constraints
            return new_state
        case Types.VARIABLES:
            new_state.variables = action.payload.variables
            return new_state
        case Types.INDEXES:
            new_state.indexes = action.payload.indexes
            return new_state
        case Types.INDEX_COLS:
            new_state.index_cols = action.payload.index_cols
            return new_state
        default: 
            return state;
    } 

}