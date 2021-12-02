import {
    UPDATE_CS_STATE_OBJECT
} from "../actions/types";
import _ from "lodash";


const csStateObjectReducer =(
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
    }, action) =>{
    if(action.type === UPDATE_CS_STATE_OBJECT){

        return {...state,[action.payload.key] : action.payload.value};
    }
    return state;
}

export default csStateObjectReducer;