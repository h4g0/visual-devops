import * as Blockly from 'blockly/core';
import { collumn, collumns, generate_col_variable_index } from '../linearprogramming/linear_programming';

import dataStore from './../update_state/Store'
import { clearVariables, updateBlockIndex, updateVariables } from '../update_state/Actions';
import { LPGenerator } from '../generator/generator';


Blockly.Extensions.register('on_change_col_val', function() {
    // Example validation upon block change:
      //@ts-ignore
    this.setOnChange(function(changeEvent) {
      //@ts-ignore
      const col: string = this.getFieldValue('COL') || ""
        //@ts-ignore
      const id: string = this.id
  
      if( col != "") dataStore.dispatch( updateBlockIndex({block: id, index: col}) )
        
    
    
      //@ts-ignore
      console.log(`id 1${this.id}`)
      console.log(col)
    });
  });

  Blockly.Extensions.register('on_change_vals', function() {
    // Example validation upon block change:
      //@ts-ignore
    this.setOnChange(function(changeEvent) {
      dataStore.dispatch( clearVariables( {} ) )
      //@ts-ignore
      const variables = LPGenerator.statementToCode(this, 'VARIABLES', LPGenerator.PRECEDENCE) || 'null'   
    });
  });
 
  
Blockly.Extensions.register('on_change_col_new_var', function() {
  // Example validation upon block change:
    //@ts-ignore
  this.setOnChange(function(changeEvent) {
      
    //@ts-ignore
    const name_var: string = this.getFieldValue('VARNAME') || ""
    //@ts-ignore
    const col_var: string = this.getFieldValue('COL') || ""

    if(name_var != "" && name_var == "Mixture" && col_var != "") {
      const generated_variables = generate_col_variable_index(name_var, col_var)

      const var_name = generated_variables[0]
      const var_col = generated_variables[1]
  
      dataStore.dispatch( updateVariables( {name : var_name, cols: var_col}))
    }

  });
});