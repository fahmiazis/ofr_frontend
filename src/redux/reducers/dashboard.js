/* eslint-disable import/no-anonymous-default-export */
const dashboardState = {
    isLoading: false,
    isGet: null,
    dataStatus: [],
    periode: {}
}

export default (state = dashboardState, action) => {
    switch (action.type) {
        case 'GET_STATUS_DASHBOARD_PENDING': {
            return {
                ...state,
                isLoading: true
            }
        }
        case 'GET_STATUS_DASHBOARD_FULFILLED': {
            return {
                ...state,
                isLoading: false,
                isGet: true,
                dataStatus: action.payload.data.result,
                periode: action.payload.data.periode
            }
        }
        case 'GET_STATUS_DASHBOARD_REJECTED': {
            return {
                ...state,
                isLoading: false,
                isGet: false
            }
        }
        default: {
            return state
        }
    }
}
