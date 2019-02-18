import { createStore } from 'redux'
import { Immutable } from 'seamless-immutable'

import combineReducers from '@libs/redux-utils/combineReducers'

export type TStoreState = Immutable<{}>

const reducers = combineReducers({})

let reduxDevTools: any

if (typeof window !== 'undefined') {
  reduxDevTools = (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__()
}

export default createStore(reducers, reduxDevTools)
