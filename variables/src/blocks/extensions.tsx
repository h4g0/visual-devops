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
    this.getInput('INPUT').appendField("index")

    //@ts-ignore
    this.getInput('INPUT')
    .appendField(new Blockly.FieldDropdown(
    
      function() {
        const state = dataStore.getState()
        const cols: collumns = ( state.columns as collumns )
        //const col_keys = Array.from(cols.entries()).map( (x: [string,collumn]) => x[0] )
        const block_col = ( state.block_col as Map<string,string> )
        const col = block_col.get(id) || ""
        const entries = cols.get(col) || []  

        const options = entries.map( (entry: string) => [""  + entry , "" + entry])
        
        return options.length > 0 ? options : [["",""]];
      }), 'INDEX');
  });

  Blockly.Extensions.register('dynamic_menu_extension_col',

  function() {

    //@ts-ignore
    this.getInput('COL')
      .appendField(new Blockly.FieldDropdown(
      
        function() {
          const state = dataStore.getState()

          const cols: collumns = ( state.columns as collumns )
          const indexes: string[] = ( state.index_cols as string[] )

          const col_keys =  Array.from(cols.entries()).map( (x: [string,collumn]) => x[0] ).filter( (entry: string) => !indexes.includes(entry) )

          const options = col_keys.map( (x: string) => [x,x] )
       
          return options.length > 0 ? options : [["",""]];
        }), 'COL');

  });

  Blockly.Extensions.register('dynamic_menu_extension_matrix_var_val',

  
   
  function() {   
 
    //@ts-ignore   
    const id = this.id

      //@ts-ignore
      this.getInput('INPUT')
      .appendField(new Blockly.FieldDropdown(
  
      
        function() {

          const state = dataStore.getState()
          
          const variables = ( state.variables as Map<string,string[]> )

          const vars = Array.from(variables.entries()).map( (x: [string,string[]]) => x[0] )
          const options = vars.map( (x: string) => [x,x] )

          return options.length > 0 ? options : [["",""]];
        }), 'COL');

    //@ts-ignore
    this.getInput('INPUT').appendField("index")

      //@ts-ignore
    this.getInput('INPUT')
    .appendField(new Blockly.FieldDropdown(

    
      function() {

        const state = dataStore.getState()

        const cols = ( state.columns as collumns )
    
        const variables  = ( state.variables as Map<string,string[]> )

        const block_col = ( state.block_col as Map<string,string> )

        const col = block_col.get(id) || ""

        console.log(variables.get(col) )

        const vars_col = cols.get( (variables.get(col) || [""])[0]) || []

        const options = vars_col.map( (x: string) => [x,x])
        
        return options.length > 0 ? options : [["",""]];
      }), 'COL1');

      
      //@ts-ignore
    this.getInput('INPUT')
    .appendField(new Blockly.FieldDropdown(

    
      function() {

        const state = dataStore.getState()

        const cols = ( state.columns as collumns )
    
        const variables  = ( state.variables as Map<string,string[]> )

        const block_col = ( state.block_col as Map<string,string> )

        const col = block_col.get(id) || ""

        const vars_col = cols.get( (variables.get(col) || [""])[0]) || []

        const options = vars_col.map( (x: string) => [x,x])
        
        return options.length > 0 ? options : [["",""]];
      }), 'COL2');


    
});

Blockly.Extensions.register('dynamic_menu_extension_col_var_val',

  
   
  function() {   
 
    //@ts-ignore   
    const id = this.id

    
      //@ts-ignore
      this.getInput('INPUT')
      .appendField(new Blockly.FieldDropdown(
  
      
        function() {

          const state = dataStore.getState()
          
          const variables = ( state.variables as Map<string,string[]> )

          const vars = Array.from(variables.entries()).map( (x: [string,string[]]) => x[0] )
          const options = vars.map( (x: string) => [x,x] )

          return options.length > 0 ? options : [["",""]];
        }), 'COL');

    //@ts-ignore
    this.getInput('INPUT').appendField("index")

    //@ts-ignore
    this.getInput('INPUT')
    .appendField(new Blockly.FieldDropdown(

    
      function() {

        const state = dataStore.getState()

        const cols = ( state.columns as collumns )
    
        const variables  = ( state.variables as Map<string,string[]> )

        const block_col = ( state.block_col as Map<string,string> )

        const col = block_col.get(id) || ""

        console.log(variables.get(col) )
        
        const vars_col = cols.get( (variables.get(col) || [""])[0]) || []

        const options = vars_col.map( (x: string) => [x,x])
        
        return options.length > 0 ? options : [["",""]];
      }), 'COL1');

    
});



Blockly.Extensions.register('dynamic_menu_extension_single_var_val',
 
  function() {   
 
    //@ts-ignore   
    const id = this.id

      //@ts-ignore
      this.getInput('INPUT')
      .appendField(new Blockly.FieldDropdown(
  
      
        function() {

          const state = dataStore.getState()
          
          const variables = ( state.variables as Map<string,string[]> )

          const vars = Array.from(variables.entries()).map( (x: [string,string[]]) => x[0] )
          const options = vars.map( (x: string) => [x,x] )

          return options.length > 0 ? options : [["",""]];
        }), 'COL');

    
});

Blockly.Extensions.register('dynamic_menu_extension_two_cols',

  function() {   

      //@ts-ignore
    this.getInput('COL1').setAlign(Blockly.ALIGN_LEFT)
    .appendField(new Blockly.FieldDropdown(

    
      function() {
        const indexes  = ( dataStore.getState().index_cols as string[] )
      
        const options = indexes.map( (x: string) => [x,x] )
        
        return options.length > 0 ? options : [["",""]];
      }), 'COL1');

       //@ts-ignore
    this.getInput('COL1').setAlign(Blockly.ALIGN_LEFT)
    .appendField(new Blockly.FieldDropdown(

    
      function() {
        const indexes  = ( dataStore.getState().index_cols as string[] )
      
        const options = indexes.map( (x: string) => [x,x] )
        
        return options.length > 0 ? options : [["",""]];
      }), 'COL2');


    
});







  


  

