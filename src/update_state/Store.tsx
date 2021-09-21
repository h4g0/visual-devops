import { createStore } from 'redux'
import { dataReducer } from './Reducer'

let dataStore: any = createStore(dataReducer)

export default dataStore