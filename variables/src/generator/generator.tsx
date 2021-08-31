/**
 * @license
 * 
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Define generation methods for custom blocks.
 * @author samelh@google.com (Sam El-Husseini)
 */

// More on generating code:
// https://developers.google.com/blockly/guides/create-custom-blocks/generating-code

import * as Blockly from 'blockly/core';
import { useSelector } from 'react-redux';
import dataStore from './../update_state/Store'

import { model1_cols, generate_matrix_variable, indexes, gen_operation, stringify_variables, generate_col_variable, generate_single_variable, variable_indexs, fix_expression, generate_col_variable_index, generate_matrix_variable_index, generate_single_variable_index } from './../linearprogramming/linear_programming';
import { updateVariables } from '../update_state/Actions';

export const LPGenerator: any =  new Blockly.Generator('LP');

LPGenerator.PRECEDENCE = 0

LPGenerator.scrub_ = function(block: any, code: any, opt_thisOnly: any) {
    const nextBlock =
        block.nextConnection && block.nextConnection.targetBlock();
    let nextCode = '';
    if (nextBlock) {
        nextCode =
            opt_thisOnly ? '' : ',\n' + LPGenerator.blockToCode(nextBlock);
    }
    return code +  nextCode;
  };

LPGenerator["variables"] = function (block: any){
    const variables = LPGenerator.statementToCode(block, 'VARIABLES', LPGenerator.PRECEDENCE) || 'null'
    return `VARIABLES \n${variables}`
}

LPGenerator['new_matrix_variable'] = function (block: any) {
    const cols: any = dataStore.getState().columns

    //dataStore.dipatch( {})
    console.log(dataStore.getState())
    console.log(cols)
    console.log(`cols ${JSON.stringify(cols)}`)

    const name: string = block.getFieldValue('VARNAME')
    ///var cols =  LPGenerator.valueToCode(block, 'VALUE', LPGenerator.PRECEDENCE) || 'null'
    const col1: string = block.getFieldValue('COL1')
    const col2: string = block.getFieldValue('COL2')

    const generated_variables = generate_matrix_variable_index(name, col1,col2)

    const var_name = generated_variables[0]
    const var_col = generated_variables[1]

    dataStore.dispatch( updateVariables( {name : var_name, cols: var_col}))
    
    return JSON.stringify(generated_variables)

};

LPGenerator['new_col_variable'] = function (block: any) {

    const cols: any = dataStore.getState().columns

    const name: string = block.getFieldValue('VARNAME')
    const col: string = block.getFieldValue('COL')

    const generated_variables = generate_col_variable_index(name, col)

    const var_name = generated_variables[0]
    const var_col = generated_variables[1]

    dataStore.dispatch( updateVariables( {name : var_name, cols: var_col}))

    return JSON.stringify(generated_variables)

}

LPGenerator['new_single_variable'] = function(block: any){
    const name: string = block.getFieldValue('VARNAME')
    const col: string = block.getFieldValue('COL')

    const generated_variables = generate_single_variable_index(name)

    const var_name = generated_variables[0]
    const var_col = generated_variables[1]

    dataStore.dispatch( updateVariables( {name : var_name, cols: var_col}))

    return JSON.stringify(generated_variables)
}

LPGenerator['operation'] = function (block: any) { 
    const state: any = dataStore.getState()
    const cols: any = state.columns

    const prev_statement =  LPGenerator.valueToCode(block, 'PREV_STATEMENT', LPGenerator.PRECEDENCE) || 'null'
    const next_statement =  LPGenerator.valueToCode(block, 'NEXT_STATEMENT', LPGenerator.PRECEDENCE) || 'null'
    
    console.log(prev_statement)
    console.log(next_statement)
    
    const operation = block.getFieldValue('OPERATION')

    const constraints = gen_operation(operation, cols, prev_statement,next_statement)

    return [constraints, LPGenerator.PRECEDENCE];

};

LPGenerator['number'] = function (block: any){
    const number = block.getFieldValue('VALUE') || 0

    return [`${number}`, LPGenerator.PRECEDENCE];
}

LPGenerator['constraints'] = function (block: any){
    const constraints = LPGenerator.statementToCode(block, 'CONSTRAINTS', LPGenerator.PRECEDENCE) || 'null'
    return `CONSTRAINTS \n${constraints}`

}

LPGenerator['constraint'] = function (block: any) { 
    const constraint =  LPGenerator.valueToCode(block, 'CONSTRAINT', LPGenerator.PRECEDENCE) || 'null'
    const fixed_constraint = fix_expression(constraint, model1_cols)
    return fixed_constraint
};

LPGenerator['col_address'] = function (block: any) { 
    const col = block.getFieldValue('COL')
    const index = indexes.get(col)
    return [`${col}[index_${index}]`, LPGenerator.PRECEDENCE];
};

LPGenerator['col_junction'] = function (block: any) {
    var col1 = LPGenerator.valueToCode(block, 'COL1', LPGenerator.PRECEDENCE) || 'null'
    var col2 = LPGenerator.valueToCode(block, 'COL2', LPGenerator.PRECEDENCE) || 'null'
    var operation = block.getFieldValue('OP')

    return [col1 + " " + operation + " " + col2, LPGenerator.PRECEDENCE]
};

LPGenerator['matrix_variable'] = function (block: any){
   
    const col1: string = block.getFieldValue('COL1')
    const col2: string = block.getFieldValue('COL2')
    const variable: string = block.getFieldValue("COL")

    const variable_holder = `${variable}[index_${col1}][index_${col2}]`

    return [variable_holder, LPGenerator.PRECEDENCE]

}

LPGenerator['single_variable'] = function (block: any){
    const variable: string = block.getFieldValue("COL")
    const indexes = ( variable_indexs.get(variable) as string[] )

    const index_holder = indexes.map( (x: string) => `[index_${x}]`).join("")

    const variable_holder = `${variable}${index_holder}`
    
    return [variable_holder, LPGenerator.PRECEDENCE]

}

LPGenerator['col_variable'] = function (block: any){
    const variable: string = block.getFieldValue("COL")

    const index = block.getFieldValue("COL1")

    const variable_holder = `${variable}[index_${index}]`
    
    return [variable_holder, LPGenerator.PRECEDENCE]

}

LPGenerator['objective'] = function (block: any) { 
    const objective =  LPGenerator.valueToCode(block, 'OBJECTIVE', LPGenerator.PRECEDENCE) || 'null'
    const obj =  block.getFieldValue('OBJ')
    const fixed_objective = fix_expression(objective, model1_cols)
    return `${obj} ${fixed_objective}`
}