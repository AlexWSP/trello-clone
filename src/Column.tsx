import { useRef } from "react"
import { ColumnContainer, ColumnTitle } from "./styles"
import { AddNewItem } from "./AddNewItem"
import { useAppState } from "./state/AppStateContext"
import { Card } from "./Card"
import { useDrop } from "react-dnd"
import { addTask, moveTask, moveList, setDraggedItem } from "./state/actions"
import { useItemDrag } from "./utils/useItemDrag"
import { isHidden } from "./utils/isHidden"
import { DragItem } from "./DragItem"

type ColumnProps = {
    text: string
    id: string
    isPreview?: boolean
}

export const Column = ({ text, id, isPreview }: ColumnProps) => {
    const { draggedItem, getTasksByListId, dispatch } = useAppState()
    const tasks = getTasksByListId(id)
    const ref = useRef<HTMLDivElement>(null)

    const [, drop] = useDrop({
        accept: ["COLUMN", "CARD"],
        hover(item: DragItem) {
            if (!draggedItem) {return}
            if (item.type === "COLUMN") {
                if (draggedItem.type === "COLUMN") {
                    if (draggedItem.id === id) {return;}
                    dispatch(moveList(draggedItem.id, id))
                } 
            } else {
                if (draggedItem.type === "CARD") {
                    if (draggedItem.columnId === id) {return}
                    if (tasks.length) {return}
                    dispatch(moveTask(draggedItem.id, null, draggedItem.columnId, id))
                    dispatch(setDraggedItem({ ...draggedItem, columnId: id }))
                }
            }

        }
    })

    const { drag } = useItemDrag({ type: "COLUMN", id, text })

    drag(drop(ref))

    return (
        <ColumnContainer isPreview={isPreview} ref={ref} isHidden={isHidden(draggedItem, "COLUMN", id)}>
        <ColumnTitle>{text}</ColumnTitle>
        {tasks.map((task) => (
            <Card text={task.text} columnId={id} key={task.id} id={task.id}/>
        ))}

        <AddNewItem
            toggleButtonText="+ Add another card"
            onAdd={(text) => dispatch(addTask(text, id))}
            dark
        />
        </ColumnContainer>
    )
}