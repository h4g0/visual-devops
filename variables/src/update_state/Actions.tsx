// Declaração das actions 

// types of action
export const Types = {
    CONSTRAINTS: "CONSTRAINTS",
    VARIABLES: "VARIABLES",
    INDEXES: "INDEXES",
    COLUMNS: "COLUMNS",
    INDEX_COLS: "INDEX_COLS"
};

// Actions para mudar o valor das variáveis globais

export const updateConstraints = (value: {constraints: string[]})  => ({
    type: Types.CONSTRAINTS,
    payload: value
});

export const updateVariables = (value: {variables: string[]})  => ({
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

export const updateIndexCols= (value: {index_cols: string[]})  => ({
    type: Types.INDEX_COLS,
    payload: value
});