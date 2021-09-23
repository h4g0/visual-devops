const SimpleSimplex = require('simple-simplex');

const MIN_VAR = 0
const MAX_VAR = 10000

function round_decimal(x: number): number {
    //@ts-ignore
    const rounded_number: number = parseFloat(parseFloat(x).toFixed(2))
    return rounded_number
}

function replace_values(statement: string,columns: Map<string,string[]>,indexes: Map<string,string>): string {
    let new_statement = "" + statement
    let elements = statement.match(/[a-zA-Z]+(\[[a-zA-Z]+\])+/g) || []

    for(let element of elements) {
        const col_indexes = get_col_indexes(element)

        if(col_indexes.length > 2) continue

        const col = col_indexes[0]
        const index = col_indexes[1]

        const col_vals = columns.get(col) || []

        if(col_vals.length == 0) continue

        const index_col_name = indexes.get(col) || ""

        if(index_col_name == "") continue

        const index_col = columns.get(index_col_name) || []

        if(index_col.length == 0) continue

        const index_col_pos = index_col.indexOf(index)

        if(index_col_pos == -1 || index_col_pos > col_vals.length) continue

        const value = col_vals[index_col_pos]

        new_statement = new_statement.replace(element,value)
    }

    return new_statement
}

function get_col_indexes(statement: string): string[] {
    let new_statement = "" + statement
    new_statement = statement.replace(/\]/g,"")

    const col_indexes = new_statement.split(/\[/g) || []

    return col_indexes
}

function simplify_subtrs(statement: string): string {
    let new_statement = "" + statement

    const subtrs = statement.match(/\- \([^\)]+\)/g) || []

    for(let subtr of subtrs) {
        let new_subtr = "" + subtr
        new_subtr = new_subtr.slice(2,new_subtr.length)
        new_subtr = new_subtr.replace(/\-/g,"PLUS")
        new_subtr = new_subtr.replace(/\+/g,"-")
        new_subtr = new_subtr.replace(/PLUS/g,"+")

        new_statement = new_statement.replace(subtr,"- " + new_subtr)
    }

    return new_statement
}

function simplify_mults(statement: string): string {
    let new_statement = "" + statement

    let mults = []
    
    const col_expr = `[a-zA-Z]+(\\[.*\\]])+`
    const num_expr = `[0-9]+((\\.)[0-9]+)*`
    
    const mults_rigth = statement.match(new RegExp(`\\([^\\)]*\\) X ${num_expr}`,"g")) || []
    const mults_left = statement.match(new RegExp(`${num_expr} X \\([^\\)]*\\)`,"g")) || []


    mults.push(...mults_rigth)
    mults.push(...mults_left)

    for( let el = 0; el < mults.length; el++ ) {
        const mult = mults[el]
        const part1_part2 = mult.split(" X ") 
        if(part1_part2.length < 2) continue

        const part1 = el < mults_rigth.length ? part1_part2[0] : part1_part2[1]
        const part2 = el < mults_rigth.length ? part1_part2[1] : part1_part2[0]        

        let elements_string= part1.replace(/[\(\)]/g,"")
        let new_elements = "" + elements_string

        elements_string = elements_string.replace(/[\+\-]/g,"")
        let elements = elements_string.split(" ")
        elements = elements.filter( (x: string) => x != " " && x != "")

        for(let element of elements) {
            const numerical_values = element.match(new RegExp(num_expr,"g")) || []

            if( numerical_values.length > 0 ) {
                const new_element = element.replace(numerical_values[0], "" + parseFloat(numerical_values[0]) * parseFloat(part2))
                new_elements = new_elements.replace(element,new_element)
            }

            else {
                const new_element = `${part2}${element}`
                new_elements = new_elements.replace(element,new_element)
            }

        }

        new_statement = new_statement.replace(mult,new_elements)
        
    }

    new_statement = new_statement.replace("X ", "X")

    return new_statement

}

function get_values_expr(statement: string): [Map<string,number>,number] {
    
    let values = new Map<string,number>()

    let new_statement = statement.replace(/\+[ ]*/g,"+")
    new_statement = new_statement.replace(/\-[ ]*/g,"-")

    const num_expr = `[0-9]+((\\.)[0-9]+)*`
    const var_expr = `[a-zA-Z]+(\\[[^\\]]*\\])+`
    const val_expr = `([\\+\\-])?(${num_expr})?${var_expr}`

    
    const values_list = new_statement.match(new RegExp(val_expr,"g")) || []

    for(let value of values_list) {
        new_statement = new_statement.replace(value,"")

        const sign = value[0] == "-" ? -1 : 1
        value = value.replace(/[\+\-]/g,"")

        const numerical_value = parseFloat( (value.match(new RegExp(num_expr)) || ["1"])[0] )

        const variables = ( value.match(new RegExp(var_expr)) || [] )
        if( variables.length == 0) continue
        const variable = variables[0]

        const past_value = values.get(variable) || 0

        values.set(variable, past_value + numerical_value * sign )
    }

    const numerical_expr = `([\\+\\-])?(${num_expr})`
    const numerical_values = new_statement.match(new RegExp(numerical_expr,"g")) || []

    const constant = numerical_values.reduce( (acc: number, curr: string) => {
        const sign = curr[0] == "-" ? -1 : 1
        curr = curr.replace(/[\+\-]/g,"")

        return acc + parseFloat(curr) * sign
    }, 0)


    return [values,constant]

}

function get_values_ineq(variables: Map<string,string[]>,statement: string): [Map<string,number>,number]{
    let values = get_all_variables_namedVector_objective(variables)
    const expr = statement.split(/(\<\=|\>\=|\=|\>|\<)/g)

    console.log(expr)
    if(expr.length == 0) return [values,0]

    if(expr.length == 1) return get_values_expr(statement)

    const values_constants_right = get_values_expr(expr[0])
    const values_constants_left = get_values_expr(expr[2])

    const values_right = values_constants_right[0]
    const values_left = values_constants_left[0]

    const constants_right = values_constants_right[1]
    const constants_left = values_constants_left[1]

    for( let value of Array.from(values_right.entries())){
        const variable = value[0].replace("]","").replace("[","_")
        const value_right = value[1]
        const value_left = values_left.get(variable)  || 0

        values.set(variable, round_decimal(value_right - value_left))
    }

    const constants = constants_left - constants_right

    return [values,constants]
}

function parse_model(indexes: Map<string,string>,variables: Map<string,string[]>,columns: Map<string,string[]>,statement: string){
    const replaced_objective = replace_values(statement, columns,indexes)
    const simplified_subtrs_objective = simplify_subtrs(replaced_objective)
    const simpliflid_mult_objective = simplify_mults(simplified_subtrs_objective)

    const values_constants = get_values_ineq(variables,simpliflid_mult_objective)

    const values = values_constants[0]
    const constants = values_constants[1]

    console.log(values)
    console.log(constants)

    return values_constants
}

function parse_objective(indexes: Map<string,string>,variables: Map<string,string[]>,columns: Map<string,string[]>,goal: string,objective: string){
    const values_constants = parse_model(indexes , variables, columns ,objective )

    const values = values_constants[0]

    return values
}

function parse_constraints(indexes: Map<string,string>,variables: Map<string,string[]>,constraints: string[],columns: Map<string,string[]>,){
    const model_constraints = []

    for(let constraint of constraints){
        const values_constants = parse_model(indexes , variables, columns ,constraint)

        const ineq = ( constraint.match(/(\<\=|\>\=|\=|\>|\<)/g) || ["="] )[0]
        const values = values_constants[0]
        const constant = values_constants[1]
    
        model_constraints.push({
            namedVector: Object.fromEntries(values),
            constraint: ineq,
            constant: constant,
        })
    }
    
    return model_constraints
}

function get_non_negativity_max_values_constraints(variables: Map<string,string[]>,min_var: number,max_var: number){
    const zero_variables = get_all_variables_namedVector_objective(variables)
    let non_negativy_max_constraints = []

    for(let value of Array.from(zero_variables.entries())){
        zero_variables.set(value[0],1)

        const named_vector = Object.fromEntries(zero_variables)

        non_negativy_max_constraints.push({
            namedVector: named_vector,
            constraint: ">=",
            constant: min_var,
        })

        non_negativy_max_constraints.push({
            namedVector: named_vector,
            constraint: "<=",
            constant: max_var,
        })

        zero_variables.set(value[0],0)

    
    }

    return non_negativy_max_constraints
}

function get_all_variables_namedVector_objective(variables: Map<string,string[]>): Map<string,number>{
    const all_variables = new Map<string,number>() 

    for( let value of Array.from(variables.entries())){
        const variable = value[0].replace("]","").replace("[","_")
        
        all_variables.set(variable,0)
    }

    return all_variables
}

export function run_model(indexes: Map<string,string>, variables: Map<string, string[]>,index_cols: string[],constraints: string[],columns: Map<string,string[]>,goal: string,objective: string): Map<string,string>{
    let solution = new Map<string,string>()

    const objective_model = parse_objective(indexes , variables, columns ,goal ,objective )
    const constraints_model = parse_constraints(indexes, variables, constraints, columns )

    const non_negativy_max_constraints = get_non_negativity_max_values_constraints(variables,MIN_VAR,MAX_VAR)

    constraints_model.push(...non_negativy_max_constraints)

    console.log(constraints_model)
    
    const optimization_type = goal == "Maximize" ? "max" : "min"

    const model  = {
        objective: Object.fromEntries(objective_model),
        constraints: constraints_model,
        optimizationType: optimization_type
    }
    
    console.log(model)

    const solver = new SimpleSimplex(model)

    
    const result = solver.solve({
        methodName: 'simplex',
      });

    console.log({
        solution: result.solution,
        isOptimal: result.details.isOptimal,
    })

    /*const solver = new SimpleSimplex({
        objective: {
          A: 70,
          b: 210,
          c: -200,
        },
        constraints: [
          {
            namedVector: { A: 1, b: -1, c: 1 },
            constraint: '<=',
            constant: 100,
          },
          {
            namedVector: { A: 5, b: 4, c: 4 },
            constraint: '<=',
            constant: 480,
          },
          {
            namedVector: { A: 40, b: 20, c: 30 },
            constraint: '<=',
            constant: 3200,
          },
        ],
        optimizationType: 'max',
      });

      const result = solver.solve({
        methodName: 'simplex',
      });
       
      // see the solution and meta data
      console.log({
        solution: result.solution,
        isOptimal: result.details.isOptimal,
      })*/
    
    return solution
}
