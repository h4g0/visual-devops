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

import { model1_cols, stringify_variables, generate_model_variables } from '../linearprogramming/linear_programming';

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

LPGenerator['new_matrix_variable'] = function (block: any) {
    var name: string = block.getFieldValue('VARNAME')
    ///var cols =  LPGenerator.valueToCode(block, 'VALUE', LPGenerator.PRECEDENCE) || 'null'
    var col1: string = block.getFieldValue('COL1')
    var col2: string = block.getFieldValue('COL2')

    return stringify_variables(generate_model_variables(model1_cols,[ name + " = " + col1 + " x "  + col2])) ;

};

LPGenerator['col_address'] = function (block: any) { 
    var col = block.getFieldValue('COL')
    return [col, LPGenerator.PRECEDENCE];
};

LPGenerator['col_junction'] = function (block: any) {
    var col1 = LPGenerator.valueToCode(block, 'COL1', LPGenerator.PRECEDENCE) || 'null'
    var col2 = LPGenerator.valueToCode(block, 'COL2', LPGenerator.PRECEDENCE) || 'null'
    var operation = block.getFieldValue('OP')

    return [col1 + " " + operation + " " + col2, LPGenerator.PRECEDENCE]
};