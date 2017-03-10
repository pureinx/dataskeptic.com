import axios from 'axios';

export const FETCH_CURRENT_PROPOSAL_REQUEST = 'FETCH_CURRENT_PROPOSAL_REQUEST';
export const FETCH_CURRENT_PROPOSAL_SUCCESS = 'FETCH_CURRENT_PROPOSAL_SUCCESS';
export const FETCH_CURRENT_PROPOSAL_FAIL = 'FETCH_CURRENT_PROPOSAL_FAIL';

export function fetchCurrentProposal() {
    return (dispatch) => {
        dispatch(fetchCurrentProposalRequest());

        axios.get('/api/rfc/list')
            .then((res) => dispatch(fetchCurrentProposalSuccess(res.data)))
            .catch((err) => dispatch(fetchCurrentProposalFail(err)))
    }
}

export function fetchCurrentProposalRequest() {
    return {
        type: FETCH_CURRENT_PROPOSAL_REQUEST
    }
}

export function fetchCurrentProposalSuccess(data) {
    return {
        type: FETCH_CURRENT_PROPOSAL_SUCCESS,
        payload: {
            data
        }
    }
}

export function fetchCurrentProposalFail(error) {
    return {
        type: FETCH_CURRENT_PROPOSAL_FAIL,
        payload: {
            error
        }
    }
}