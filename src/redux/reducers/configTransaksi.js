/* eslint-disable import/no-anonymous-default-export */
const configState = {
    isLoading: false,
    dataConfig: [],
    count: 0,
    page: {},
    optionJenis: [],
    optionArea: []
}

export default (state = configState, action) => {
    switch (action.type) {
        case 'GET_CONFIG_TRANSAKSI_PENDING':
        case 'GET_OPTION_CONFIG_TRANSAKSI_PENDING':
        case 'SAVE_CONFIG_TRANSAKSI_PENDING':
        case 'DELETE_CONFIG_TRANSAKSI_PENDING': {
            return { ...state, isLoading: true }
        }
        case 'GET_CONFIG_TRANSAKSI_FULFILLED': {
            return {
                ...state,
                isLoading: false,
                dataConfig: action.payload.data.result.rows,
                count: action.payload.data.result.count,
                page: action.payload.data.pageInfo
            }
        }
        case 'GET_OPTION_CONFIG_TRANSAKSI_FULFILLED': {
            return {
                ...state,
                isLoading: false,
                optionJenis: action.payload.data.jenis,
                optionArea: action.payload.data.areas
            }
        }
        case 'SAVE_CONFIG_TRANSAKSI_FULFILLED':
        case 'DELETE_CONFIG_TRANSAKSI_FULFILLED':
        case 'GET_CONFIG_TRANSAKSI_REJECTED':
        case 'GET_OPTION_CONFIG_TRANSAKSI_REJECTED':
        case 'SAVE_CONFIG_TRANSAKSI_REJECTED':
        case 'DELETE_CONFIG_TRANSAKSI_REJECTED': {
            return { ...state, isLoading: false }
        }
        default: {
            return state
        }
    }
}
