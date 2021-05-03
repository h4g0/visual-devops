import { createStore } from 'redux'

const default_state = {
                         variables: [],
                         constraints: [],
                         optimization: [],
                         algorithm: "Simplex"
                        }

export const append = (element: any, list: string) => {
    return {
        type: 'APPEND',
        list: list,
        element: element
    }
}

export const clean = (list: string) => {
    return {
        type: 'CLEAN',
        list: list
    }
}

function append_to_list(state: any,element: any, list: string): any {
    let new_state: any = state

    new_state[list].push(element)
    
    return new_state
}

function clean_list(state: any,list: string): any {
    let new_state: any = state

    new_state[list] = []

    return new_state

}

export const modify_model = (state = default_state, action: any) => {
    switch (action.state){
        case('APPEND'):
            return append_to_list(state, action.element, action.list);
        case('CLEAN'):
            return clean_list(state, action.list);
    }
}

