import {
    RESET_AW_CONFIG_STATE_OBJECT,
    RESET_CS_STATE_OBJECT,
    UPDATE_AW_CONFIG_STATE_OBJECT
} from "../actions/types";
import _ from "lodash";


const awConfigStateObjectReducer = (
    state = {
    deletedItems: new Array(),
    addedItemsIds: new Array(),
    editedItemsIds: new Array(),
    stack: new Array(),
    addedItemsIdsStack: new Array(),
    editedItemsIdsStack: new Array(),
    itemsDeletedStack: new Array(),
    actionsStack: new Array(),
    lastPageVisited:0
}, action) => {
    if (action.type === UPDATE_AW_CONFIG_STATE_OBJECT) {
        return {...state, [action.payload.key]: action.payload.value};
    }
    if(action.type === RESET_AW_CONFIG_STATE_OBJECT){
        for(let i = 0 ;state.deletedItems.length; i++){
            state.deletedItems.pop()
        }
        for(let i = 0 ;state.addedItemsIds.length; i++){
            state.addedItemsIds.pop()
        }
        for(let i = 0 ;state.editedItemsIds.length; i++){
            state.editedItemsIds.pop()
        }
        for(let i = 0 ;state.stack.length; i++){
            state.stack.pop()
        }
        for(let i = 0 ;state.addedItemsIdsStack.length; i++){
            state.addedItemsIdsStack.pop()
        }
        for(let i = 0 ;state.editedItemsIdsStack.length; i++){
            state.editedItemsIdsStack.pop()
        }
        for(let i = 0 ;state.itemsDeletedStack.length; i++){
            state.itemsDeletedStack.pop()
        }
        for(let i = 0 ;state.actionsStack.length; i++){
            state.actionsStack.pop()
        }
        state.lastPageVisited = 0;

    }

    return state;
}

export default awConfigStateObjectReducer;