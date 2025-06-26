import { createContext, useContext } from "solid-js";
import type { State } from "./stores/state";
import type { SetStoreFunction } from "solid-js/store";

export const StateContext = createContext<[State, SetStoreFunction<State>]>();

export function getStateContext() {
    const context = useContext(StateContext)
  
    if (!context) {
      throw new Error("useStateContext: cannot find a StateContext")
    }
  
    return context
  }