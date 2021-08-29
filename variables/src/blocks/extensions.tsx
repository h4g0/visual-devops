import * as Blockly from 'blockly/core';
import { collumn, collumns, model1_cols } from '../linearprogramming/linear_programming';

import dataStore from './../update_state/Store'

Blockly.Extensions.register('dynamic_menu_extension_col_var',

function() {
  
  //@ts-ignore
  this.getInput('COL')
    .appendField(new Blockly.FieldDropdown(
    
      function() {
        const state = dataStore.getState()

        const indexes: string[] = ( state.index_cols as string[] )

        const options = indexes.map( (x: string) => [x,x])

        return options.length > 0 ? options : [["",""]];
      }), 'COL');
});

Blockly.Extensions.register('dynamic_menu_extension_col_val',

  function() {
    
    
    //@ts-ignore   
    const id = this.id


    //@ts-ignore
    this.getInput('INPUT')
      .appendField(new Blockly.FieldDropdown(
      
        function() {
          const state = dataStore.getState()

          const cols: collumns = ( state.columns as collumns )
          const indexes: string[] = ( state.index_cols as string[] )

          const col_keys =  Array.from(cols.entries()).map( (x: [string,collumn]) => x[0] ).filter( (entry: string) => !indexes.includes(entry) )

          const options = col_keys.map( (x: string) => [x,x] )
       
          return options.length > 0 ? options : [["",""]];
        }), 'COL');
   
    //@ts-ignore
    this.getInput('INPUT')
    .appendField(new Blockly.FieldDropdown(
    
      function() {
        const state = dataStore.getState()
        console.log("2222")
        //@ts-ignore
        console.log(`id 2${id}`)
        const cols: collumns = ( state.columns as collumns )
        //const col_keys = Array.from(cols.entries()).map( (x: [string,collumn]) => x[0] )
        const block_col = ( state.block_col as Map<string,string> )
        const col = block_col.get(id) || ""
        const entries = cols.get(col) || []  

        const options = entries.map( (entry: string) => [""  + entry , "" + entry])
        
        return options.length > 0 ? options : [["",""]];
      }), 'INDEX');
  });

