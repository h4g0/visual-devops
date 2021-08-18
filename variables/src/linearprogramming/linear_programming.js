"use strict";
exports.__esModule = true;
exports.stringify_variables = exports.model1_variables = exports.variable_indexs = exports.indexes = exports.model1_cols = exports.gen_operation = exports.generate_inequality_operation = exports.fix_expression = exports.generate_mul_operation = exports.generate_single_variable = exports.generate_col_variable = exports.generate_matrix_variable = void 0;
var single_var = "single";
var col_var = "col";
var mat_var = "mat";
function generate_matrix_variable(cols, name, col1, col2) {
    var variable = new Map();
    var col1_items = cols.get(col1);
    var col2_items = cols.get(col2);
    if (col1_items == undefined || col2_items == undefined)
        return variable;
    for (var _i = 0, col1_items_1 = col1_items; _i < col1_items_1.length; _i++) {
        var item1 = col1_items_1[_i];
        for (var _a = 0, col2_items_1 = col2_items; _a < col2_items_1.length; _a++) {
            var item2 = col2_items_1[_a];
            variable.set(name + "[" + item1 + "][" + item2 + "]", {
                name: name,
                type: mat_var,
                formula: [item1, item1]
            });
        }
    }
    return variable;
}
exports.generate_matrix_variable = generate_matrix_variable;
function generate_col_variable(cols, name, col) {
    var variable = new Map();
    var col_items = cols.get(col);
    if (col_items == undefined)
        return variable;
    for (var _i = 0, col_items_1 = col_items; _i < col_items_1.length; _i++) {
        var item = col_items_1[_i];
        variable.set(name + "[" + item + "]", { name: name, type: col_var, formula: [item] });
    }
    return variable;
}
exports.generate_col_variable = generate_col_variable;
function generate_single_variable(name) {
    var variable = new Map();
    variable.set(name, { name: name, type: single_var, formula: [] });
    return variable;
}
exports.generate_single_variable = generate_single_variable;
function get_indexes(statement) {
    var indexes = statement.match(/index_[a-zA-Z0-9]+/g);
    var clean_indexes = indexes == undefined ? [] : indexes.map(function (x) { return x.replace("index_", ""); });
    return clean_indexes;
}
function generate_mul_operation(statement1, statement2, cols) {
    var indexes_stat1 = get_indexes(statement1);
    var indexes_stat2 = get_indexes(statement2);
    var matchs = indexes_stat1.filter(function (x) { return indexes_stat2.includes(x); });
    if (matchs.length == 0)
        return statement1 + " X " + statement2;
    var match = matchs[0];
    var index_values = cols.get(match);
    var expr = "";
    for (var i = 0; i < index_values.length; i++) {
        var index_value = index_values[i];
        var new_stat1 = statement1.replace("index_" + match, index_value);
        var new_stat2 = statement1.replace("index_" + match, index_value);
        expr += new_stat1 + " X " + new_stat2;
        if (i < index_values.length - 1)
            expr += " + ";
    }
    return expr;
}
exports.generate_mul_operation = generate_mul_operation;
function get_index(exp) {
    var index_exp = /index_[a-zA-Z0-9]+/;
    var index = exp.match(index_exp) || [];
    var clean_index = index[0].replace("index_", "");
    return clean_index;
}
function get_non_expanded_expr(statement) {
    var index_exp = /index_[a-zA-Z0-9]+/;
    //const non_exp = statement.match(/[a-zA-Z0-9]+(\[index_[a-zA-Z0-9]+\])+/g) || []
    var non_exp = statement.match(/(\[index_[a-zA-Z0-9]+\])+/g) || [];
    console.log((non_exp));
    return non_exp;
}
function fix_expression(expr, cols) {
    var non_exp = get_non_expanded_expr(expr);
    var new_expr = expr;
    console.log(expr);
    console.log(non_exp);
    for (var _i = 0, non_exp_1 = non_exp; _i < non_exp_1.length; _i++) {
        var exp = non_exp_1[_i];
        var index = get_index(expr);
        var vals = cols.get(index) || [];
        var new_exp = "( ";
        for (var _a = 0, vals_1 = vals; _a < vals_1.length; _a++) {
            var val = vals_1[_a];
            new_exp += exp.replace("index_" + index, val);
        }
        new_exp += " )";
        new_expr = new_expr.replace(exp, new_exp);
    }
    return new_expr;
}
exports.fix_expression = fix_expression;
function generate_inequality_operation(operation, cols, prev_statement, next_statement) {
    var constraints = [];
    var indexes_prev = get_indexes(prev_statement);
    var indexes_next = get_indexes(next_statement);
    console.log(prev_statement + " " + next_statement);
    var matchs = indexes_prev.filter(function (x) { return indexes_next.includes(x); });
    for (var _i = 0, matchs_1 = matchs; _i < matchs_1.length; _i++) {
        var match = matchs_1[_i];
        var values = cols.get(match);
        for (var _a = 0, values_1 = values; _a < values_1.length; _a++) {
            var value = values_1[_a];
            var new_prev_statement = prev_statement.replace("index_" + match, value);
            var new_next_statement = next_statement.replace("index_" + match, value);
            constraints.push(new_prev_statement + " " + operation + " " + new_next_statement);
        }
    }
    return constraints;
}
exports.generate_inequality_operation = generate_inequality_operation;
function gen_operation(op, cols, prev_statement, next_statement) {
    var indequality_ops = ["<", ">", "<=", ">=", "="];
    if (indequality_ops.includes(op))
        return generate_inequality_operation(op, cols, prev_statement, next_statement).join("\n");
    if (op == "X")
        return generate_mul_operation(prev_statement, next_statement, cols);
    if (op == "+")
        return "";
}
exports.gen_operation = gen_operation;
exports.model1_cols = new Map();
exports.model1_cols.set("Compartment", ["Front", "Center", "Rear"]);
exports.model1_cols.set("Weigth_capacity", ["10", "16", "18"]);
exports.model1_cols.set("Space_capacity", ["6800", "8700", "5300"]);
exports.model1_cols.set("Cargo", ["C1", "C2", "C3", "C4"]);
exports.model1_cols.set("Weigth", ["18", "15", "23", "12"]);
exports.model1_cols.set("Volume", ["480", "650", "580", "390"]);
exports.model1_cols.set("Profit", ["310", "380", "350", "285"]);
exports.indexes = new Map();
exports.indexes.set("Compartment", "Compartment");
exports.indexes.set("Weight_capacity", "Compartment");
exports.indexes.set("Space_capacity", "Compartment");
exports.indexes.set("Cargo", "Cargo");
exports.indexes.set("Weight", "Cargo");
exports.indexes.set("Volume", "Cargo");
exports.indexes.set("Profit", "Cargo");
var input_vars = ["Cargo_quantity = Cargo x Compartment"];
exports.variable_indexs = new Map();
exports.variable_indexs.set("CompartmentCargo", ["Cargo", "Compartment"]);
exports.model1_variables = generate_matrix_variable(exports.model1_cols, "CompartmentCargo", "Compartment", "Cargo");
function stringify_variables(vars) {
    var vars_str = [];
    var iterator = vars.keys();
    var value = "";
    while (value = iterator.next().value)
        vars_str.push(value);
    return (vars_str.join("\n"));
}
exports.stringify_variables = stringify_variables;
