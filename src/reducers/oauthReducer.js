import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function oauthReducer(state = initialState.oauths, action) {
    switch (action.type) {
        case types.OAUTH_TOKEN_RECEIVED: {
            return {
                oauthReturnedToken: action.token,
                authenticatedUser: {}
            };
        }
        case types.OAUTH_TOKEN_DESTROYED: {
            return {
                oauthReturnedToken: "",
                authenticatedUser: {}
            };
        }
        case types.OAUTH_AUTH_USER_LOADED: {
            return {
                oauthReturnedToken: state.oauthReturnedToken,
                authenticatedUser: action.user
            };
        }
        default: {
            return state;
        }
    }
}
