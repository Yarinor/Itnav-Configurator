import _ from "lodash"
import {
    FETCH_APPLICATIONS
} from "../actions/types";
import {toJSON} from "lodash/seq";

const applicationReducer = (state= {}, action) =>{
    switch(action.type){
        case FETCH_APPLICATIONS:
            return {...state,..._.mapKeys(action.payload, 'Name')};
        default:
            return state;

    }
}

export default applicationReducer;