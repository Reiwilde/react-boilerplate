import { Reducer, ReducersMapObject } from 'redux'
import Imt from 'seamless-immutable'

/**
 * Turns an object whose values are different reducer functions, into a single
 * reducer function. It will call every child reducer, and gather their results
 * into a single immutable state object, whose keys correspond to the keys of the passed
 * reducer functions.
 *
 * @param reducers An object whose values correspond to different
 * reducer functions that need to be combined into one. The reducers may never return
 * undefined for any action. Instead, they should return their initial state.
 *
 * @returns A reducer function that invokes every reducer inside the
 * passed object, and builds a immutable state object with the same shape.
 */
export default function combineReducers (reducers: ReducersMapObject): Reducer {
  const reducersKeys = Object.keys(reducers)

  return function combination (state = Imt({}), action) {
    return reducersKeys.reduce((prevState, key) => {
      const reducer = reducers[key]

      return prevState.set(key, reducer(prevState[key], action))
    }, state)
  }
}
