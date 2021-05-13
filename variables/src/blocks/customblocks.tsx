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
 * @fileoverview Define custom blocks.
 * @author samelh@google.com (Sam El-Husseini)
 */

// More on defining blocks:
// https://developers.google.com/blockly/guides/create-custom-blocks/define-blocks


import * as Blockly from 'blockly/core';
import { model1_cols } from '../linearprogramming/linear_programming';


// Since we're using json to initialize the field, we'll need to import it.
import '../fields/BlocklyReactField';
import '../fields/DateField';

var testReactField = {
  "type": "test_react_field",
  "message0": "custom field %1",
  "args0": [
    {
      "type": "field_react_component",
      "name": "FIELD",
      "text": "Click me"
    },
  ],
  "previousStatement": null,
  "nextStatement": null,
};

Blockly.Blocks['test_react_field'] = {
  init: function() {
    //@ts-ignore
    this.jsonInit(testReactField);
    //@ts-ignore
    this.setStyle('loop_blocks');
  }
};

var reactDateField = {
  "type": "test_react_date_field",
  "message0": "date field %1",
  "args0": [
    {
      "type": "field_react_date",
      "name": "DATE",
      "date": "01/01/2020"
    },
  ],
  "previousStatement": null,
  "nextStatement": null,
};

Blockly.Blocks['test_react_date_field'] = {
  init: function() {
    //@ts-ignore
    this.jsonInit(reactDateField);
    //@ts-ignore
    this.setStyle('loop_blocks');
  }
};

var ReactvariableField = {
    "message0": "set %1 to %2",
    "nextStatement": "ACTION",
    "previousStatement": "ACTION",
    "args0": [
      {
        "type": "field_input",
        "name": "VARNAME",
        "text": "varname",
        "spellcheck": false
      },
      {
        "type": "input_value",
        "name": "VALUE"
      } 
    ]
}

Blockly.Blocks['new_variable'] = {
  init: function() {
    //@ts-ignore
    this.jsonInit(ReactvariableField);
    //@ts-ignore
    this.setStyle('loop_blocks');
  }
};

let optreactcolfield: any = Array.from(model1_cols.keys()).map((val,index) => {
  return [val, val]
})

var ReactColField = {
  "message0": "collumn: %1",
  "output": "Action",
  "args0": [
    {
      "type": "field_dropdown",
      "name": "COL",
      "options": optreactcolfield
    }
  ]
}

Blockly.Blocks['col_address'] = {
  init: function() {
    //@ts-ignore
    this.jsonInit(ReactColField);
    //@ts-ignore
    this.setStyle('loop_blocks');
  }
};

var ReactColJunctionField = {
  "message0": "%1 %2 %3",
  "output": "Action",
  "args0": [
    {"type": "input_value", "name": "COL1"},
    {
      "type": "field_dropdown",
      "name": "OP",
      "options": [
        ["X", "x"],
        ["+", "+"]
      ]
    },
    {"type": "input_value", "name": "COL2"},
  ]
}

Blockly.Blocks['col_junction'] = {
  init: function() {
    //@ts-ignore
    this.jsonInit(ReactColJunctionField);
    //@ts-ignore
    this.setStyle('loop_blocks');
  }
};

var ReactForallField = {
  "message0": "FORALL %1",
  "args0": [
    {
      "type": "field_dropdown",
      "name": "VAR",
      "options": [
        ["col1", "COL1"],
        ["col2", "COL2"]
      ]
    } ],
    "message1": "EXPRESSION %1", 
    "args1": [
        {"type": "input_value", "name": "EXPR"},
    ],
    "input": "Action",
    "output": "Action",
    "nextStatement": "Action",

}

Blockly.Blocks['forall'] = {
  init: function() {
    //@ts-ignore
    this.jsonInit(ReactForallField);
    //@ts-ignore
    this.setStyle('loop_blocks');
  }
};


var ReactOperationField = {
  "message0": "Operation %1 %2",
  "args0": [
    {
      "type": "field_dropdown",
      "name": "OPERATION",
      "options": [
        ["<", "<"],
        ["<=", "<="],
        [">",">"],
        [">=",">="],
      ]
    },
    {
      "type": "input_value",
      "name": "NEXT_STATMENT",
    } ],
    "input": "Action",
    "output": "Action",
}

Blockly.Blocks['operation'] = {
  init: function() {
    //@ts-ignore
    this.jsonInit(ReactOperationField);
    //@ts-ignore
    this.setStyle('loop_blocks');
  }
};


var ReactConstraintField = {
  "message0": "Constraint %1",
  "args0": [
    {
      "type": "input_value",
      "name": "CONSTRAINT",
    } ],
    "input": "Action",
    "previousStatement": "ACTION",
    "nextStatement": "ACTION"
}

Blockly.Blocks['constraint'] = {
  init: function() {
    //@ts-ignore
    this.jsonInit(ReactConstraintField);
    //@ts-ignore
    this.setStyle('loop_blocks');
  }
};

var ReactNumberField = {
  "message0": "%1",
  "args0": [
    {
      "type": "input_value",
      "name": "VALUE",
    } ],
}

Blockly.Blocks['number'] = {
  init: function() {
    //@ts-ignore
    this.jsonInit(ReactNumberField);
    //@ts-ignore
    this.setStyle('loop_blocks');
  }
};