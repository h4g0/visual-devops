import { VariableMap } from "blockly";
import { generate_col_variable, generate_matrix_variable } from "../linearprogramming/linear_programming";
import { get_solution } from "./get_solution";

const MIN_VAR = 0
const MAX_VAR = 100000

function round_decimal(x: number): number {
    //@ts-ignore
    const rounded_number: number = parseFloat(parseFloat(x).toFixed(2))
    return rounded_number
}

function replace_values(statement: string,columns: Map<string,string[]>,indexes: Map<string,string>): string {
    let new_statement = "" + statement
    let elements = statement.match(/[a-zA-Z0-9\(\)\_]+(\[[a-zA-Z0-9\(\)\_]+\])+/g) || []

    console.log("Elements")
    console.log(elements)
    
    for(let element of elements) {

        console.log("Element")
        console.log(element)

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
    
    const col_expr = `[a-zA-Z0-9\_]+(\\[.*\\]])+`
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
                const new_element = element.replace(numerical_values[0] || "", "" + parseFloat(numerical_values[0] || "0") * parseFloat(part2))
                new_elements = new_elements.replace(element,new_element)
            }

            else {
                const new_element = `${part2}${element}`
                new_elements = new_elements.replace(element,new_element)
            }

        }

        new_statement = new_statement.replace(mult,new_elements)
        
    }


    console.log("MULTS")
    console.log(statement)
    console.log(new_statement)

    return new_statement

}

function get_values_expr(statement: string,variables: Map<string,string[]>,cols: Map<string,string[]>): [Map<string,number>,number] {
    
    statement = statement.replace(/ X /g,"")

    console.log("STATEMENT")
    console.log(statement)

    let values = get_all_variables_namedVector_objective(variables,cols)

    let new_statement = statement.replace(/\+[ ]*/g,"+")
    new_statement = new_statement.replace(/\-[ ]*/g,"-")

    const num_expr = `[0-9]+((\\.)[0-9]+)*`
    const var_expr = `[a-zA-Z0-9\_]+(\\[[^\\]]*\\])+`
    const val_expr = `([\\+\\-])?(${num_expr})?${var_expr}`

    
    const values_list = new_statement.match(new RegExp(val_expr,"g")) || []

    for(let value of values_list) {
        console.log(value)
        new_statement = new_statement.replace(value,"")

        const sign = value[0] == "-" ? -1 : 1
        value = value.replace(/[\+\-]/g,"")

        const numerical_value = parseFloat( (value.match(new RegExp(`^${num_expr}`)) || ["1"])[0] )

        const variables = ( value.match(new RegExp(var_expr)) || [] )
        if( variables.length == 0) continue
        const variable = (variables[0] || "").replace(/\]/g,"").replace(/\[/g,"_").replace(new RegExp(`^${num_expr}`),"")

        const past_value = values.get(variable) || 0

        values.set(variable, past_value + numerical_value * sign )
    }

    const numerical_expr = `([\\+\\-])?(${num_expr})`
    const numerical_values = new_statement.match(new RegExp(numerical_expr,"g")) || []

    console.log(numerical_values)
    const constant = 0 
    
    /*numerical_values.reduce( (acc: number, curr: string) => {
        const sign = curr[0] == "-" ? -1 : 1
        curr = curr.replace(/[\+\-]/g,"")

        return acc + parseFloat(curr) * sign
    }, 0)*/


    return [values,constant]

}

function get_values_ineq(variables: Map<string,string[]>,cols: Map<string,string[]>,statement: string): [Map<string,number>,number]{
    let values = get_all_variables_namedVector_objective(variables,cols)
    const expr = statement.split(/(\<\=|\>\=|\=|\>|\<)/g)

    console.log(expr)
    if(expr.length == 0) return [values,0]

    if(expr.length == 1) {
        const values_expr = get_values_expr(statement,variables,cols)
        
        for( let value of Array.from(values_expr[0].entries())){
            const variable = value[0].replace("]","").replace("[","_")
            const value_right = value[1]
    
            values.set(variable, round_decimal(value_right))
        }


        return [values,0]

    }

    const values_constants_right = get_values_expr(expr[0],variables,cols)
    const values_constants_left = get_values_expr(expr[2],variables,cols)

    const values_right = values_constants_right[0]
    const values_left = values_constants_left[0]

    const constants_right = values_constants_right[1]
    const constants_left = values_constants_left[1]

    console.log(values_left)
    console.log(values_right)

    
    for( let value of Array.from(values_right.entries())){
        const variable = value[0].replace("]","").replace("[","_")
        const value_right = value[1]
        console.log(value[0])
        const value_left = values_left.get(value[0])  || 0
        console.log(value_left)
        values.set(variable, round_decimal(value_right - value_left))
    }


    const constants = constants_left - constants_right

    return [values,constants]
}

function parse_model(indexes: Map<string,string>,variables: Map<string,string[]>,columns: Map<string,string[]>,statement: string){
    const replaced_objective = replace_values(statement, columns,indexes)

    console.log(replaced_objective)
    const simplified_subtrs_objective = simplify_subtrs(replaced_objective)
    const simpliflid_mult_objective = simplify_mults(simplified_subtrs_objective)

    const values_constants = get_values_ineq(variables,columns,simpliflid_mult_objective)

    const values = values_constants[0]
    const constants = values_constants[1]

  

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

        const ineq = ( constraint.match(/(\<\=|\>\=|\=|\>|\<)/g) || ["Error"] )[0]
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

function get_non_negativity_max_values_constraints(variables: Map<string,string[]>,cols: Map<string,string[]>,min_var: number,max_var: number){
    const zero_variables = get_all_variables_namedVector_objective(variables,cols)
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

function get_all_variables_namedVector_objective(variables: Map<string,string[]>,cols: Map<string,string[]>): Map<string,number>{
    const all_variables = new Map<string,number>() 


    for( let value of Array.from(variables.entries())){
        const variable = value[0]
        const var_cols = value[1]

        if(var_cols.length == 0) {
            const variable_name = value[0].replace("]","").replace("[","_")
            all_variables.set(variable_name,0)
        }

        if(var_cols.length == 1){
            const gen_vars = generate_col_variable(cols,variable,var_cols[0])

            for( let gen_value of Array.from(gen_vars.entries())){
                const variable_name = gen_value[0].replace("]","").replace("[","_")
                all_variables.set(variable_name,0)            
            }

        }

        if(var_cols.length == 2){
            const gen_vars = generate_matrix_variable(cols,variable,var_cols[0],var_cols[1])
            
            for( let gen_value of Array.from(gen_vars.entries())){
                const variable_name = gen_value[0].replace("]","").replace("[","_")
                all_variables.set(variable_name,0)            
            }

        }
       
    }

    return all_variables
}

function convert_subjectTo_clp(simplex_model: any): any{
    const constraints = simplex_model.constraints
    const subjectTo = []

    
  const transform_vars= (x: any,y: any) => {
    const value = parseFloat(y)
    const sign = value >= 0 ? "+" : "-"
    const abs = value >= 0 ? value : value * -1

    return ` ${sign} ${abs} ${x}`
  }
  
    for(let i = 0; i < constraints.length; i++) {
      
      const goal = constraints[i].constraint

      const constant = constraints[i].constant

      const namedVector = Object.keys(constraints[i].namedVector)

      const constraint_vars = namedVector.reduce((acc: string,x: any) => acc + transform_vars(x,constraints[i].namedVector[x]),"")
      
      const constraint = `cons${i}:${constraint_vars} ${goal} ${constant}`
      

      subjectTo.push(constraint)
    }

    return "\n" + subjectTo.join("\n")
}

function convert_model_clp(simplex_model: any): any {

  const transform_objective = (x: any,y: any) => {
    const value = parseFloat(y)
    const sign = value >= 0 ? "+" : "-"
    const abs = value >= 0 ? value : value * -1

    return ` ${sign} ${abs} ${x}`
  }

  let model = '' 
  model += simplex_model.optimizationType == "max" ? "Maximize" : "Minimize"

  model += "\n" + "obj:" + Object.keys(simplex_model.objective).reduce((acc: string,x: any) => acc + transform_objective(x,simplex_model.objective[x]),"")
  
  model += "\nSubject To"

  model += convert_subjectTo_clp(simplex_model)
  
  model += "\nEnd"

  return model

}

function convert_results(solution: any) {
  let results = new Map<string,number>()


  const solution_array  = solution.solution
  const solution_variables = solution.variables

  results.set("Objective",parseInt(solution.objectiveValue))
  
  for(let i = 0; i < solution_array.length; i++){
    let variable = solution_variables[i].replace(/\_/,"[")
    variable = variable.replace(/\_/g,"][")
    if( (variable.match(/\[/g) || []).length > 0 ) variable += "]"

    results.set(variable,round_decimal(solution_array[i]))
  }

  console.log(solution)


  return results

}
async function run_clp_model(simplex_model: any) {

  const clp_model = convert_model_clp(simplex_model)


  const solution = await get_solution(clp_model)
  
  console.log(solution)
  console.log(clp_model)


  if(!solution) return new Map<string,number>()
  return convert_results(solution)

}

export async function run_model(indexes: Map<string,string>, variables: Map<string, string[]>,index_cols: string[],constraints: string[],columns: Map<string,string[]>,goal: string,objective: string): Promise<Map<string,number>>{

    const objective_model = parse_objective(indexes , variables, columns ,goal ,objective )
    const constraints_model = parse_constraints(indexes, variables, constraints, columns )

    const non_negativy_max_constraints = get_non_negativity_max_values_constraints(variables,columns,MIN_VAR,MAX_VAR)

    constraints_model.push(...non_negativy_max_constraints)

    console.log(constraints_model)
    
    const optimization_type = goal == "MAXIMIZE" ? "max" : "min"

    console.log(goal)

    const model  = {
        objective: Object.fromEntries(objective_model),
        constraints: constraints_model,
        optimizationType: optimization_type
    }

    console.log(model)
    

    /*const new_model = {
        "objective": {
          "varname_Blonde": 1,
          "varname_Red": 1
        },
        "constraints": [
          {
            "namedVector": {
              "varname_Blonde": 1,
              "varname_Red": 0
            },
            "constraint": "<=",
            "constant": 20
          },
          {
            "namedVector": {
              "varname_Blonde": 0,
              "varname_Red": 1
            },
            "constraint": "<=",
            "constant": 20
          },
          {
            "namedVector": {
              "varname_Blonde": 1,
              "varname_Red": 0
            },
            "constraint": "<=",
            "constant": 2
          },
          {
            "namedVector": {
              "varname_Blonde": 0,
              "varname_Red": 1
            },
            "constraint": "<=",
            "constant": 2
          },
          {
            "namedVector": {
              "varname_Blonde": 1,
              "varname_Red": 0
            },
            "constraint": "<=",
            "constant": 10
          },
          {
            "namedVector": {
              "varname_Blonde": 0,
              "varname_Red": 1
            },
            "constraint": "<=",
            "constant": 10
          },
          {
            "namedVector": {
              "varname_Blonde": 1,
              "varname_Red": 0
            },
            "constraint": ">=",
            "constant": 0
          },
          {
            "namedVector": {
              "varname_Blonde": 1,
              "varname_Red": 0
            },
            "constraint": "<=",
            "constant": 10000
          },
          {
            "namedVector": {
              "varname_Blonde": 0,
              "varname_Red": 1
            },
            "constraint": ">=",
            "constant": 0
          },
          {
            "namedVector": {
              "varname_Blonde": 0,
              "varname_Red": 1
            },
            "constraint": "<=",
            "constant": 10000
          }
        ],
        "optimizationType": "max"
      }*/
    

    
    const solution = await run_clp_model(model)

    console.log(solution)
   
    return solution
}
