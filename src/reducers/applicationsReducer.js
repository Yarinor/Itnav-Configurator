import _ from "lodash"
import {
    ADD_APPLICATION,
    FETCH_APPLICATIONS
} from "../actions/types";
import {toJSON} from "lodash/seq";

const applicationReducer = (state= {}, action) =>{
    switch(action.type){
        case FETCH_APPLICATIONS:
            return {...state,..._.mapKeys(action.payload, 'Name')};
        case ADD_APPLICATION:
            return {...state,[action.payload]:{Name:action.payload}}
        default:
            return state;

    }
}

export default applicationReducer;