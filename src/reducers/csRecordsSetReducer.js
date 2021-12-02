import {
    DELETE_FROM_CS_RECORDS_SET,
    SAVE_CS_RECORDS_SET
} from "../actions/types";
import _ from "lodash";
import {
    DELETED_ITEMS,
    ADDED_ITEMS_IDS,
    EDITED_ITEMS_IDS,
    STACK,
    ADDED_ITEMS_IDS_STACK,
    EDITED_ITEMS_IDS_STACK,
    ITEMS_DELETED_STACK,
    ACTIONS_STACK
} from "../components/types";


const csRecordsSetReducer = (state = {}, action) => {
    switch (action.type) {
        case SAVE_CS_RECORDS_SET: {
            return action.payload
        }
        case DELETE_FROM_CS_RECORDS_SET: {
            const obj = Object.assign({}, action.payload)
            delete state[obj['0'].Id]
            return state;
        }
        default:
            return state;
    }


}

export default csRecordsSetReducer;