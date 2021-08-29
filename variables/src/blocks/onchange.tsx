import * as Blockly from 'blockly/core';
import { collumn, collumns } from '../linearprogramming/linear_programming';

import dataStore from './../update_state/Store'
import { updateBlockIndex } from '../update_state/Actions';


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