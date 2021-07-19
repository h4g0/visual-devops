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

import { model1_cols, generate_matrix_variable, indexes, gen_operation, stringify_variables } from './../linearprogramming/linear_programming';

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
    var name: string = block.getFieldValue('VARNAME')
    ///var cols =  LPGenerator.valueToCode(block, 'VALUE', LPGenerator.PRECEDENCE) || 'null'
    var col1: string = block.getFieldValue('COL1')
    var col2: string = block.getFieldValue('COL2')


    const generated_variables = stringify_variables(generate_matrix_variable(model1_cols, name,col1,col2))

    return [ generated_variables, LPGenerator.PRECEDENCE]

};

LPGenerator['operation'] = function (block: any) { 
    const prev_statement =  LPGenerator.valueToCode(block, 'PREV_STATEMENT', LPGenerator.PRECEDENCE) || 'null'
    const next_statement =  LPGenerator.valueToCode(block, 'NEXT_STATEMENT', LPGenerator.PRECEDENCE) || 'null'

    const operation = block.getFieldValue('OPERATION')

    const constraints = gen_operation(operation, model1_cols, prev_statement,next_statement)

    
    return [constraints , LPGenerator.PRECEDENCE];

};

LPGenerator['single_variable'] = function (block: any) { 
    const value = block.getFieldValue('VALUE')

    return [value, LPGenerator.PRECEDENCE];
};

LPGenerator['constraints'] = function (block: any){
    const constraints = LPGenerator.statementToCode(block, 'CONSTRAINTS', LPGenerator.PRECEDENCE) || 'null'
    return `CONSTRAINTS \n${constraints}`

}

LPGenerator['constraint'] = function (block: any) { 
    var constraint =  LPGenerator.valueToCode(block, 'CONSTRAINT', LPGenerator.PRECEDENCE) || 'null'
    return constraint
};

LPGenerator['col_address'] = function (block: any) { 
    const col = block.getFieldValue('COL')
    const index = indexes.get(col)
    return [`${col}[${index}]`, LPGenerator.PRECEDENCE];
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
    const variable: string = block.getFieldValue("VARNAME")

    return [`${variable}[vaname${col1}][varname${col2}]`, LPGenerator.PRECEDENCE]

}