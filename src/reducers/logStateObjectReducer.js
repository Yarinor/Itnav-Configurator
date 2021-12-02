import {
    UPDATE_CS_STATE_OBJECT, UPDATE_LOG_STATE_OBJECT
} from "../actions/types";
import _ from "lodash";


const logStateObjectReducer = (
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
    if (action.type === UPDATE_LOG_STATE_OBJECT) {

        return {...state, [action.payload.key]: action.payload.value};
    }
    return state;
}

export default logStateObjectReducer;