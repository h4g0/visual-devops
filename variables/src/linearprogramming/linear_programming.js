"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
exports.__esModule = true;
exports.stringify_variables = exports.model1_cols = exports.create_constraints = exports.gen_equals = exports.gen_sum = exports.gen_forall = exports.gen_operation = exports.generate_model_variables = exports.generate_input_variable = exports.generate_mul_vars = exports.gen_permutations = void 0;
/**
export function execute_operation_col(operation: string,col: collumn): any  {
    
    switch(operation) {
    
        case 'Sum':
        
        let aux_col: number[] = <number[]> col

        return aux_col.reduce((a:number, b:number) => a + b,0)
        
        break;

        case "Len":

        return col.length

        break;
        
    }
}
**/
function gen_permutations(cols, var_cols) {
    var perms = [];
    if (var_cols.length == 0)
        return perms;
    var col_values = cols.get(var_cols[0]);
    if (var_cols.length == 1) {
        col_values.forEach(function (cv) {
            perms.push([cv]);
        });
        return perms;
    }
    var next_perms = gen_permutations(cols, var_cols.slice(1));
    col_values.forEach(function (cel) {
        return next_perms.forEach(function (perm) {
            var new_perm = __spreadArray([], perm);
            new_perm.unshift(cel);
            perms.push(new_perm);
        });
    });
    return perms;
}
exports.gen_permutations = gen_permutations;
function generate_mul_vars(cols, name, var_cols) {
    var aux_input_variables = new Map();
    if (var_cols.length == 0)
        return aux_input_variables;
    var perms = gen_permutations(cols, var_cols);
    perms.forEach(function (perm) {
        aux_input_variables.set([name, perm], { name: name, index: perm });
    });
    return aux_input_variables;
}
exports.generate_mul_vars = generate_mul_vars;
function generate_input_variable(cols, my_var) {
    var name = my_var.name;
    var formula = my_var.formula;
    var curr_vars = new Map();
    var operations = [];
    var operating_cols = [];
    formula.forEach(function (ms) {
        switch (ms.type) {
            case "Collumn":
                var col_vars = cols.get(ms.value);
                if (col_vars == undefined) {
                    try {
                        throw new Error("Collumn " + ms.value + " is non existing");
                    }
                    catch (e) {
                        console.log(e);
                    }
                }
                operating_cols.push(ms.value);
                break;
            case "Operation":
                var curr_operation = operations.length > 0 ? null : operations[operations.length - 1];
                switch (curr_operation) {
                    case "x":
                        break;
                }
                break;
        }
    });
    return generate_mul_vars(cols, name, operating_cols);
}
exports.generate_input_variable = generate_input_variable;
function generate_model_variables(cols, input_vars) {
    var model_variables = new Map();
    input_vars.forEach(function (my_var_str) {
        var equal_division = my_var_str.split(" = ");
        var var_name = equal_division[0];
        var var_value = equal_division[1];
        var mul_division = var_value.split(" x ");
        var form = [];
        for (var i = 0; i < mul_division.length; i++) {
            form.push({ type: "Collumn", value: mul_division[i] });
            if (i < mul_division.length - 1)
                form.push({ type: "Operation", value: "x" });
        }
        var my_var = { name: var_name, formula: form };
        var aux_model_variables = generate_input_variable(cols, my_var);
        aux_model_variables.forEach(function (value, key) {
            model_variables.set(key, value);
        });
    });
    return model_variables;
}
exports.generate_model_variables = generate_model_variables;
function gen_operation(cols, model_variables, operation, forma, formb) {
    var new_form = [];
    forma.forEach(function (smb) { return new_form.push(smb); });
    var new_entry = { type: "Operation", value: operation };
    new_form.push(new_entry);
    formb.forEach(function (smb) { return new_form.push(smb); });
    return new_form;
}
exports.gen_operation = gen_operation;
function gen_forall(cols, col, model_variables, form) {
    var forms = [];
    var aux_val_cols = cols.get(col);
    if (aux_val_cols == undefined) {
        try {
            throw new Error("Collumn " + col + " is non existing");
        }
        catch (e) {
            console.log(e);
        }
    }
    var val_cols = aux_val_cols;
    val_cols.forEach(function (cell) {
        var new_form = __spreadArray([], form);
        new_form = new_form.map(function (a) { return a.value === col ? { type: a.type, value: cell } : a; });
        //let new_form: string = form.replace("/[" + col + "]/g", "[" + cell + "]")
        forms.push(new_form);
    });
    return forms;
}
exports.gen_forall = gen_forall;
function gen_sum(cols, col, model_variables, form) {
    var forms = [];
    var aux_val_cols = cols.get(col);
    if (aux_val_cols == undefined) {
        try {
            throw new Error("Collumn " + col + " is non existing");
        }
        catch (e) {
            console.log(e);
        }
    }
    var val_cols = aux_val_cols;
    var position = 0;
    val_cols.forEach(function (cell) {
        var new_form = __spreadArray([], form);
        new_form = new_form.map(function (a) { return (a.type == "Operation" && a.value.index.includes(cell))
            ? { type: a.type, value: { name: a.value.name, index: a.value.index.map(function (b) { return b === col ? b : cell; }) } }
            : a; });
        //let new_form: string = form.replace("/[" + col + "]/g", "[" + cell + "]")
        forms.push.apply(forms, new_form);
        if (position < col.length - 1)
            forms.push({ type: "Operation", value: "+" });
        position++;
    });
    return forms;
}
exports.gen_sum = gen_sum;
function gen_equals(cols, col, model_variables, form) {
    var forms = [];
    var aux_val_cols = cols.get(col);
    if (aux_val_cols == undefined) {
        try {
            throw new Error("Collumn " + col + " is non existing");
        }
        catch (e) {
            console.log(e);
        }
    }
    var val_cols = aux_val_cols;
    var position = 0;
    val_cols.forEach(function (cell) {
        var new_form = __spreadArray([], form);
        new_form = new_form.map(function (a) { return ((a.type === "Variable" || a.type === "Collumn") && a.value.index.includes(cell))
            ? { type: a.type, value: { name: a.value.name, index: a.value.index.map(function (b) { return b === col ? b : cell; }) } }
            : a; });
        forms.push.apply(forms, new_form);
        if (position < col.length - 1)
            forms.push({ type: "Operation", value: "=" });
        position++;
    });
    return forms;
}
exports.gen_equals = gen_equals;
function create_constraints(cols, my_constraints) {
    var constraints = [];
    return constraints;
}
exports.create_constraints = create_constraints;
exports.model1_cols = new Map();
exports.model1_cols.set("Compartment", ["Front", "Center", "Rear"]);
exports.model1_cols.set("Weight_capacity", ["10", "16", "18"]);
exports.model1_cols.set("Space_capacity", ["6800", "8700", "5300"]);
exports.model1_cols.set("Cargo", ["C1", "C2", "C3", "C4"]);
exports.model1_cols.set("Weigth", ["18", "15", "23", "12"]);
exports.model1_cols.set("Volume", ["480", "650", "580", "390"]);
exports.model1_cols.set("Profit", ["310", "380", "350", "285"]);
var input_vars = ["Cargo_quantity = Cargo x Compartment"];
var model_variables = generate_model_variables(exports.model1_cols, input_vars);
function stringify_variables(model_variables) {
    return Array.from(model_variables.keys()).map(function (element, index) {
        return "" + element[0] + element[1].map(function (e, i) {
            return "[" + e + "]";
        }).join("");
    }).join("\n");
}
exports.stringify_variables = stringify_variables;
console.log(stringify_variables(model_variables));
/**
 * Constraints
 **/
// FORALL( Cargo, SUM( Compartment,Cargo_quantity[Cargo][Compartment] ) <= Weight_capacity[Cargo]  )
// [FORALL, Cargo]([SUM, Compartment] Cargo_quantity[Cargo][Compartment] <= Weight_capacity[Cargo])
// [FORALL, Compartment]([SUM, Cargo] Cargo_quantity[Cargo][Compartment] <= Weight[Compartment])
// [FORALL, Compartment]([SUM, Cargo] Volume[Cargo]*Cargo_quantity[Cargo][Compartment] <= Space[Compartment])
// [EQUAL, Compartment]([SUM, Cargo] Volume[Cargo]  / Weight_capacity[Compartment] )
/**
* Objective
*
**/
// [SUM, Cargo] ([Sum, Compartment] Profit[Cargo]*Cargo_quantity[Cargo][Compartment])
var Cargo = "Cargo";
var Compartment = "Compartment";
/*
let sum_cargo: formula = gen_sum(cols,Compartment,model_variables,[ {type: "Variable",value: {name: "Cargo_quantity", index: ["Cargo","Compartment"]}}])
let operation_meq: formula = gen_operation(cols,model_variables,"<=",sum_cargo,[ {type: "Collumn", value: {name: "Weight_capacity",index: ["Cargo"]}}] )
let constr_1: formula[] = gen_forall( cols, Cargo, model_variables, operation_meq)


console.log(constr_1)

*/ 
