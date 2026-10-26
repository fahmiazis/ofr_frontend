/* eslint-disable import/no-anonymous-default-export */
const mappingState = {
    isLoading: false,
    dataMapping: [],
    count: 0,
    page: {},
    optionUser: [],
    optionSpv: [],
    optionRom: [],
    optionArea: [],
    dataSpv: []
}

export default (state = mappingState, action) => {
    switch (action.type) {
        case 'GET_MAPPING_ARC_PENDING':
        case 'GET_SPV_ARC_PENDING':
        case 'GET_OPTION_MAPPING_ARC_PENDING':
        case 'SAVE_MAPPING_ARC_PENDING':
        case 'DELETE_MAPPING_ARC_PENDING': {
            return { ...state, isLoading: true }
        }
        case 'GET_MAPPING_ARC_FULFILLED': {
            return {
                ...state,
                isLoading: false,
                dataMapping: action.payload.data.result.rows,
                count: action.payload.data.result.count,
                page: action.payload.data.pageInfo
            }
        }
        case 'GET_OPTION_MAPPING_ARC_FULFILLED': {
            return {
                ...state,
                isLoading: false,
                optionUser: action.payload.data.users,
                optionSpv: action.payload.data.spv,
                optionRom: action.payload.data.rom || [],
                optionArea: action.payload.data.areas
            }
        }
        case 'GET_SPV_ARC_FULFILLED': {
            return { ...state, isLoading: false, dataSpv: action.payload.data.result }
        }
        case 'GET_SPV_ARC_REJECTED':
        case 'SAVE_MAPPING_ARC_FULFILLED':
        case 'DELETE_MAPPING_ARC_FULFILLED':
        case 'GET_MAPPING_ARC_REJECTED':
        case 'GET_OPTION_MAPPING_ARC_REJECTED':
        case 'SAVE_MAPPING_ARC_REJECTED':
        case 'DELETE_MAPPING_ARC_REJECTED': {
            return { ...state, isLoading: false }
        }
        default: {
            return state
        }
    }
}
