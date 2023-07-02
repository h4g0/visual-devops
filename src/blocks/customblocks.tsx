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
import { collumn, collumns, model1_cols } from '../linearprogramming/linear_programming';

import dataStore from './../update_state/Store'

// Since we're using json to initialize the field, we'll need to import it.

import '../fields/BlocklyReactField';
import '../fields/DateField';
import { updateBlockIndex } from '../update_state/Actions';

let var_creation_color: string = "#f5b261"
let value_color: string = "#7EA8BE"
let constr_obj_color: string = "#326886"
let operation_color: string = "#BBB193"
let model_block_variables_color: string = "#dd3f34"
let model_blocks_color_constraints: string  = "#022c5c"
let model_blocks_color_step: string  = "#218dbb"

let model_blocks_color_objective: string = "#ad4017"


let index_cols: any = [["Compartment", "Compartment"],["Cargo","Cargo"],["Supplier","Supplier"],["Plant","Plant"],
["Product", "Product"],["Shifts","Shifts"],["Product","Product"],["Components","Components"],["Vegetable","Vegetable"]]

let variables_single = ["CompartmentCargo","SupplierPlant","Mon","Tues","Wed","Thur","Fri","Sat","Sun",
"Machine_x","Machine_y","Terminal_A","Terminal_B","T1","T2","Mixture"]

let variables: [string,string][] = []

for( let el of variables_single ) 
  variables.push([el,el])

let optreactcolfield_single = ["To_PlantA","To_PlantB","Supply","Price","Capacity","Labour_cost","Sale_price","Mon","Tues","Wed","Thur","Fri","Sat","Sun","Profit","Floor_space","Machine_x","Machine_y"
,"Components","Resources_A","Resources_B","Resources_Available","Vegetable","Iron","Phosphorus","Calcium","Cost_per_pound"]

let optreactcolfield: [string,string][] = []

for( let el of optreactcolfield_single ) 
  optreactcolfield.push([el,el])


let index1: any = [["Front","Front"],["Centre","Centre"],["Rear","Rear"]]

let index2: any = [["C1","C1"],["C2","C2"],["C3","C3"],["C4","C4"],["Plant_A","Plant_A"],["Plant_B","Plant_B"],
["1","1"],["2","2"],["3","3"],["4","4"],["Materials","Materials"],["Labor","Labor"],
["Beans","Beans"],["Corn","Corn"],["Broccoli","Broccoli"],["Cabbage","Cabbage"],["Potatoes","Potatoes"]
]

//@ts-ignore
Blockly.Workspace.prototype.refresh = function() {
  var xml = Blockly.Xml.workspaceToDom(this);
  this.clear();
  Blockly.Xml.domToWorkspace(xml, this);
  //@ts-ignore
  this.refreshToolboxSelection();
};

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


var ReactOnField = () => ({
  "message0": "On: %1",
  "nextStatement": "ACTION",
  "previousStatement": "ACTION",
  "args0": [
    {
      "type": "field_dropdown",
      "name": "VAR",
      "options": [["repository_dispatch","repository_dispatch"]]
    }
  ],
  "message1": "Environment: %1",
  "args1": [
    {
      "type": "input_statement",
      "name": "VARIABLES"
    }
  ],
})

Blockly.Blocks['on'] = {
  init: function() {
    //@ts-ignore
    this.jsonInit(ReactOnField());
    //@ts-ignore
    this.setStyle('loop_blocks');
    //@ts-ignore
    this.setColour(var_creation_color)
  }
};


var ReactNewColVariableField = () => ({
    "message0": "new col variable: %1",
    "nextStatement": "ACTION",
    "previousStatement": "ACTION",
    "args0": [
      {
        "type": "input_dummy",
        "name": "COL",
        "options": [["r","repository_dispatch"]]
      }
    ],
})


Blockly.Blocks['new_col_variable'] = {
  init: function() {
    //@ts-ignore
    this.jsonInit(ReactNewColVariableField());
    //@ts-ignore
    this.setStyle('loop_blocks');
    //@ts-ignore
    this.setColour(var_creation_color)
  }
};

var ReactNewSingleVariableField = {
  "message0": "Tool/Framework: %1",
  "output": "ACTION",
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


var ReactEnvironmentField = {
  "previousStatement": "ACTION",
  "nextStatement": "ACTION",
  "message0": "Key: %1 Value: %2",
  "args0": [
    {
      "type": "field_input",
      "name": "VARNAME",
      "text": "varname",
      "spellcheck": false
    },
    {
      "type": "field_input",
      "name": "VARNAME",
      "text": "varname",
      "spellcheck": false
    }
  ]
}

Blockly.Blocks['envrionment'] = {
init: function() {
  //@ts-ignore
  this.jsonInit(ReactEnvironmentField);
  //@ts-ignore
  this.setStyle('loop_blocks');
  //@ts-ignore
  this.setColour(var_creation_color)
}
};

/*let optreactcolfield: any = Array.from(model1_cols.keys()).map((val,index) => {
  return [val, val]
})*/

var ReactColField = {
  "message0": "column: %1",
  "output": "ACTION",
  "args0": [
    {
      "type": "input_dummy",
      "name": "COL",
      "options": []
    }
  ],
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

var ReactColValField = {
  "message0": "column: %1",
  "output": "ACTION",
  "args0": [
    {
      "type": "input_dummy",
      "name": "INPUT",
      "options": []
    }
  ],

}

Blockly.Blocks['col_val_address'] = {
  init: function() {
    //@ts-ignore
    this.jsonInit(ReactColValField);
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
        "type": "input_dummy",
        "name": "COL1",
        "options": [["",""]],
      }
    ],

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

var ReactMatrixVariableField = (variables: any,index1: any, index2: any) => ({
  "message0": "variable %1 ",
  "output": "ACTION",
  "args0": [
    {
      "type": "input_dummy",
      "name": "INPUT",
      "options": []
    }
  ],
})

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



var ReactVariablesField = {
  "type": "variables",
  "message0": "Pipeline %1",
  "args0": [
    {
      "type": "input_statement",
      "name": "VARIABLES"
    }
  ],

  "message1": "Name: %1",
  "args1": [
    {
      "type": "field_input",
      "name": "VARNAME",
      "text": "varname",
      "spellcheck": false
    }
  ]

 // nextStatement: "variables",
}



Blockly.Blocks['variables'] = {
init: function() {
  //@ts-ignore
  this.jsonInit(ReactVariablesField);
  //@ts-ignore
  this.setStyle('loop_blocks');
  //@ts-ignore
  this.setColour(model_block_variables_color)
}
};

var ReactConstraintsField = {
  "type": "constraints",
  "message0": "Jobs: %1",
  "args0": [
    {
      "type": "input_statement",
      "name": "CONSTRAINTS"
    }
  ],
  previousStatement: "variables",
  nextStatement: "objective",

}



Blockly.Blocks['constraints'] = {
init: function() {
  //@ts-ignore
  this.jsonInit(ReactConstraintsField);
  //@ts-ignore
  this.setStyle('loop_blocks');
    //@ts-ignore
    this.setColour(model_blocks_color_constraints)
}
};



var ReactStepField = {
  "type": "constraints",
  "message0": "Step:",
  "message1": "Name: %1",
  "args1": [
    {
      "type": "field_input",
      "name": "VARNAME",
      "text": "varname",
      "spellcheck": false
    }],
    "message2": "Tool/Framework: %1",
    "args2": [
      {
        "type": "input_value",
        "name": "CONSTRAINTS"
      }],
      "message3": "Arguments: %1",
      "args3": [
        {
          "type": "field_input",
          "name": "VARNAME",
          "text": "varname",
          "spellcheck": false
        }],
  "message4": "Environment: %1",
  "args4": [
    {
      "type": "input_statement",
      "name": "CONSTRAINTS"
    }
  ],
  previousStatement: "ACTION",
  nextStatement: "ACTION",

}



Blockly.Blocks['step'] = {
init: function() {
  //@ts-ignore
  this.jsonInit(ReactStepField);
  //@ts-ignore
  this.setStyle('loop_blocks');
    //@ts-ignore
  this.setColour(model_blocks_color_step)
}
};

var ReactJobsField = {
  "message0": "Job %1:",
  "args0": [
    {
      "type": "field_input",
      "name": "VARNAME",
      "text": "varname",
      "spellcheck": false
    }
  ],
  "message1": "%1",
  "args1": [
    {
      "type": "input_statement",
      "name": "CONSTRAINTS"
    }
  ],
  previousStatement: "ACTION",
  nextStatement: "ACTION",

}



Blockly.Blocks['jobs'] = {
init: function() {
  //@ts-ignore
  this.jsonInit(ReactJobsField);
  //@ts-ignore
  this.setStyle('loop_blocks');
    //@ts-ignore
    this.setColour(model_blocks_color_constraints)
}
};

var ReactColVariableField = (variables: any,index_cols: any) => ({
  "message0": "variable %1",
  "output": "VARIABLE",
  "args0": [
    {
      "type": "input_dummy",
      "name": "INPUT",
      "options": []
    }
  ],

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
   "output": "ACTION",
  "args0": [
    {
      "type": "input_dummy",
      "name": "INPUT",
      "options": []
    }
  ],
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
    "output": "ACTION",

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
    "output": "ACTION",

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
    "output": "ACTION",

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
  "message0": "%1 %2 %3 ",
  "args0": [
    {
      "type": "input_value",
      "name": "PREV_STATEMENT",
    },
    {
      "type": "field_dropdown",
      "name": "OPERATION",
      "options": [       
        ["<=", "<="],
        [">=",">="],
        ["X","X"],
        ["-","-"],
        ["+","+"],
      ]
    },
    {
      "type": "input_value",
      "name": "NEXT_STATEMENT",
    } ],
    "input": "ACTION",
    "output": "ACTION",
}

Blockly.Blocks['operation'] = {
  init: function() {
    //@ts-ignore
    this.jsonInit(ReactOperationField);
    //@ts-ignore
    this.setStyle('math_blocks');
    //@ts-ignore
    this.setColour(operation_color);
  }
};


var ReactConstraintField = {
  "message0": "Job %1",
  "args0": [
    {
      "type": "input_value",
      "name": "CONSTRAINT",
    } ],
    "input": "ACTION",
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
  "output": "ACTION",
  "args0": [
    {
      "type": "field_number",
      "name": "VALUE",
      "min": 0,
      "max": 100000,
      "precision": 0.001,
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
    "input": "ACTION",
    "previousStatement": "objective",
}

Blockly.Blocks['objective'] = {
  init: function() {
    //@ts-ignore
    this.jsonInit(ReactObjectiveField);
    //@ts-ignore
    this.setStyle('loop_blocks');
    //@ts-ignore
    this.setColour(model_blocks_color_objective)
  }
};



var ReactNeedsField = {
  "message0": "Needs %1",
  "args0": [
      {
        "type": "input_value",
        "name": "OBJECTIVE",
      }
     ],
    "input": "ACTION",
    "previousStatement": "ACTION",
    "nextStatement": "ACTION",

}

Blockly.Blocks['needs'] = {
  init: function() {
    //@ts-ignore
    this.jsonInit(ReactNeedsField);
    //@ts-ignore
    this.setStyle('loop_blocks');
    //@ts-ignore
    this.setColour(model_blocks_color_objective)
  }
};

