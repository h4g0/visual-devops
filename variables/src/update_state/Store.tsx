import { createStore } from 'redux'
import { loginReducer } from './Reducer'

let loginStore: any = createStore(loginReducer)

export default loginStore