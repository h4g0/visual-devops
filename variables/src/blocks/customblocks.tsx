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

let var_creation_color: string = '#ff8080'
let value_color: number = 360
let constr_obj_color: number = 180
let operation_color: number = 90

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
 let index_cols: any = [["Compartment","Compartment"],["Cargo","Cargo"]]

var ReactNewColVariableField = (index_cols: any) => ({
    "message0": "new collumn variable %1 index %2",
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
        "type": "field_dropdown",
        "name": "COL",
        "options": index_cols
      }
    ]
})

Blockly.Blocks['new_col_variable'] = {
  init: function() {
    //@ts-ignore
    this.jsonInit(ReactNewColVariableField(index_cols));
    //@ts-ignore
    this.setStyle('loop_blocks');
    //@ts-ignore
    this.setColour(var_creation_color)
  }
};


var ReactNewSingleVariableField = {
  "message0": "new single variable %1",
  "nextStatement": "ACTION",
  "previousStatement": "ACTION",
  "args0": [
    {
      "type": "field_input",
      "name": "VARNAME",
      "text": "varname",
      "spellcheck": false
    }
  ]
}

Blockly.Blocks['new_single_variable'] = {
init: function() {
  //@ts-ignore
  this.jsonInit(ReactNewSingleVariableField);
  //@ts-ignore
  this.setStyle('loop_blocks');
  //@ts-ignore
  this.setColour(var_creation_color)
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
     //@ts-ignore
     this.setColour(value_color)
  }
};

var ReactNewMatrixVariableField = (index_cols: any) => ({
  "message0": "new matrix variable |  name: %1 ",
 
    "nextStatement": "ACTION",
    "previousStatement": "ACTION",
    "args0": [
      {
        "type": "field_input",
        "name": "VARNAME",
        "text": "varname",
      }
    ],
  "message1": "collumn 1: %1 collumn 2: %2",
  "args1": [
    {
      "type": "field_dropdown",
      "name": "COL1",
      "options": index_cols
    },
    {
      "type": "field_dropdown",
      "name": "COL2",
      "options": index_cols
    }
  ]

})

Blockly.Blocks['new_matrix_variable'] = {
  init: function() {
    //@ts-ignore
    this.jsonInit(ReactNewMatrixVariableField(index_cols));
    //@ts-ignore
    this.setStyle('loop_blocks');
    //@ts-ignore
    this.setColour(var_creation_color)
  }
};



let variables = [["CargoCompartment","CargoCompartment"],["var1","var1"],["var2","var2"]]


var ReactMatrixVariableField = (variables: any,index1: any, index2: any) => ({
  "message0": "variable %1 index %2 %3",
  "output": "Action",
  "args0": [
    {
      "type": "field_dropdown",
      "name": "VAR",
      "options": variables
    },
    {
      "type": "field_dropdown",
      "name": "COL1",
      "options": index1
    },
    {
      "type": "field_dropdown",
      "name": "COL2",
      "options": index2
    }
  ]
})

let index1: any = [["Front","Front"],["Centre","Centre"],["Rear","Rear"]]
let index2: any = [["C1","C1"],["C2","C2"],["C3","C3"],["C4","C4"]]

Blockly.Blocks['matrix_variable'] = {
init: function() {
  //@ts-ignore
  this.jsonInit(ReactMatrixVariableField(variables,index1,index2));
  //@ts-ignore
  this.setStyle('loop_blocks');
    //@ts-ignore
    this.setColour(value_color)
}
};


var ReactColVariableField = (variables: any,index_cols: any) => ({
  "message0": "variable %1 index %2",
  "output": "Action",
  "args0": [
    {
      "type": "field_dropdown",
      "name": "COL",
      "options": variables
    },
    {
      "type": "field_dropdown",
      "name": "COL",
      "options": index_cols
    }
  ]
})

Blockly.Blocks['col_variable'] = {
init: function() {
  //@ts-ignore
  this.jsonInit(ReactColVariableField(variables,index_cols));
  //@ts-ignore
  this.setStyle('loop_blocks');
  //@ts-ignore
  this.setColour(value_color)
}
};


var ReactSingleVariableField = (variables: any) => ({
  "message0": "variable %1",
   "output": "Action",
  "args0": [
    {
      "type": "field_dropdown",
      "name": "COL",
      "options": variables
    }
  ]
})

Blockly.Blocks['single_variable'] = {
init: function() {
  //@ts-ignore
  this.jsonInit(ReactSingleVariableField(variables));
  //@ts-ignore
  this.setStyle('loop_blocks');
  //@ts-ignore
  this.setColour(value_color)
}
};


var ReactForallField = (opt: any) => ({
  "message0": "FORALL %1",
  "args0": [
    {
      "type": "field_dropdown",
      "name": "VAR",
      "options": opt
    } ],
    "message1": "EXPRESSION %1", 
    "args1": [
        {"type": "input_value", "name": "EXPR"},
    ],
    "output": "Action",

})

Blockly.Blocks['forall'] = {
  init: function() {
    //@ts-ignore
    this.jsonInit(ReactForallField(optreactcolfield));
    //@ts-ignore
    this.setStyle('loop_blocks');
  }
};

var ReactSumField = {
  "message0": "SUM %1",
  "args0": [
    {
      "type": "field_dropdown",
      "name": "VAR",
      "options": optreactcolfield
    } ],
    "message1": "EXPRESSION %1", 
    "args1": [
        {"type": "input_value", "name": "EXPR"},
    ],
    "output": "Action",

}

Blockly.Blocks['sum'] = {
  init: function() {
    //@ts-ignore
    this.jsonInit(ReactSumField);
    //@ts-ignore
    this.setStyle('loop_blocks');
  }
};


var ReactEqualsField = (opt: any) => ({
  "message0": "EQUALS %1",
  "args0": [
    {
      "type": "field_dropdown",
      "name": "VAR",
      "options": opt
    } ],
    "message1": "EXPRESSION %1", 
    "args1": [
        {"type": "input_value", "name": "EXPR"},
    ],
    "output": "Action",

})

Blockly.Blocks['equals'] = {
  init: function() {
    //@ts-ignore
    this.jsonInit(ReactEqualsField(optreactcolfield));
    //@ts-ignore
    this.setStyle('loop_blocks');
  }
};

var ReactOperationField = {
  "message0": "%1 %2 %3 .",
  "args0": [
    {
      "type": "input_value",
      "name": "PREV_STATMENT",
    },
    {
      "type": "field_dropdown",
      "name": "OPERATION",
      "options": [
        ["<", "<"],
        ["<=", "<="],
        [">",">"],
        [">=",">="],
        ["=","="],
        ["*","*"],
        ["-","-"],
        ["+","+"]
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
    //@ts-ignore
    this.setColour(operation_color);
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
    //@ts-ignore
    this.setColour(constr_obj_color)
  }
};

var ReactNumberField = {
  "message0": "%1",
  "output": "Action",
  "args0": [
    {
      "type": "field_number",
      "name": "VALUE",
      "min": 0,
      "max": 100,
      "precision": 1,
    }
   ],
}

Blockly.Blocks['number'] = {
  init: function() {
    //@ts-ignore
    this.jsonInit(ReactNumberField);
    //@ts-ignore
    this.setStyle('loop_blocks');
    //@ts-ignore
    this.setColour(value_color)
  }
};

var ReactObjectiveField = {
  "message0": "Objective %1 %2",
  "args0": [
    {
      "type": "field_dropdown",
      "name": "OBJ",
      "options": [
        ["maximize", "MAXIMIZE"],
        ["minimize", "MINIMIZE"],
      ]    
    },
      {
        "type": "input_value",
        "name": "OBJECTIVE",
      }
     ],
    "input": "Action",
    "previousStatement": "ACTION",
    "nextStatement": "ACTION",
    "colour": 100,
}

Blockly.Blocks['objective'] = {
  init: function() {
    //@ts-ignore
    this.jsonInit(ReactObjectiveField);
    //@ts-ignore
    this.setStyle('loop_blocks');
    //@ts-ignore
    this.setColour(constr_obj_color)
  }
};
