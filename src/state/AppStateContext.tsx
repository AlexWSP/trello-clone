import { createContext, useContext, useEffect, Dispatch, FC } from "react"
import { Action } from './actions'
import {
    appStateReducer,
    AppState,
    List,
    Task
} from "./appStateReducer"
import { useImmerReducer } from "use-immer"
import { DragItem } from "../DragItem"
import { save } from "../api"
import { withInitialState } from "../withInitialState"

const appData: AppState = {
    draggedItem: null,
    lists: [ 
        {
            id: "0",
            text: "To Do",
            tasks: [{ id: "c0", text: "Generate app scaffold" }]
        },
        {
            id: "1",
            text: "In Progress",
            tasks: [{ id: "c2", text: "Learn Typescript" }]
        },
        {
            id: "2",
            text: "Done",
            tasks: [{ id: "c3", text: "Begin to use static typing" }]
        }
    ] 
}

type AppStateContextProps = {
    draggedItem: DragItem | null
    lists: List[]
    getTasksByListId(id: string): Task[]
    dispatch: Dispatch<Action>
}

type AppStateProviderProps = {
    children: React.ReactNode
    initialState: AppState
}

const AppStateContext = createContext<AppStateContextProps>({} as AppStateContextProps)

// export const AppStateProvider = withInitialState<AppStateProviderProps>(
    export const AppStateProvider: FC = ({ children }) => {
        const [state, dispatch] = useImmerReducer(appStateReducer, appData)
    // ({ children, initialState }) => {
    //     const [state, dispatch] = useImmerReducer(
    //         appStateReducer,
    //         initialState
    //     )

        // useEffect(() => {
        // save(state)
        // }, [state])

        const { draggedItem, lists } = state
        const getTasksByListId = (id: string) => {
            return lists.find((list) => list.id === id)?.tasks || []
        }
        return (
            <AppStateContext.Provider value={{ draggedItem, lists, getTasksByListId, dispatch }}>
                {children}
            </AppStateContext.Provider> 
        ) 
    } 
// )

export const useAppState = () => {
    return useContext(AppStateContext)
}