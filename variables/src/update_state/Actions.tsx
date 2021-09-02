// Declaração das actions 

// types of action
export const Types = {
    CONSTRAINTS: "CONSTRAINTS",
    VARIABLES: "VARIABLES",
    INDEXES: "INDEXES",
    COLUMNS: "COLUMNS",
    INDEX_COLS: "INDEX_COLS",
    BLOCK_COL: "BLOCK_COL",
    OBJECTIVE: "OBJECTIVE",
    GOAL: "GOAL",
    CLEAR: "CLEAR",
};

// Actions para mudar o valor das variáveis globais

export const updateConstraints = (value: {constraints: string[]})  => ({
    type: Types.CONSTRAINTS,
    payload: value
});

export const updateVariables = (value: {name : string,cols: string[]})  => ({
    type: Types.VARIABLES,
    payload: value
});

export const updateIndexes = (value: {indexes: Map<string,string>})  => ({
    type: Types.INDEXES,
    payload: value
});

export const updateColumns = (value: {columns: Map<string,string[]>})  => ({
    type: Types.COLUMNS,
    payload: value
});

export const updateGoal = (value: {goal: string})  => ({
    type: Types.GOAL,
    payload: value
});

export const updateObjective = (value: {objective: string})  => ({
    type: Types.OBJECTIVE,
    payload: value
});


export const updateIndexCols= (value: {index_cols: string[]})  => ({
    type: Types.INDEX_COLS,
    payload: value
});

export const updateBlockIndex = (value: {block: string, index: string}) => ({
    type: Types.BLOCK_COL,
    payload: value
});
 
export const clearModel = (value: {}) => ({
    type: Types.CLEAR,
    payload: value
});