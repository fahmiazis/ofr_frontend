/* eslint-disable import/no-anonymous-default-export */
const spvklaimState = {
    isAdd: false,
    isAddDetail: false,
    isUpdate: false,
    isGet: false,
    isDelete: false,
    isLoading: false,
    isError: false,
    alertMsg: '',
    dataSpvklaim: [],
    dataName: [],
    alertM: '',
    alertUpload: [],
    page: {},
    isExport: false,
    detSpvklaim: {},
    link: '',
    dataAll: [],
    isAll: false,
    isUpload: false,
    allSpvklaim: [],
    dataRek: [],
    isFinRek: false
};

export default (state=spvklaimState, action) => {
        switch(action.type){
            case 'GET_ALL_SPVKLAIM_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_ALL_SPVKLAIM_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isAll: true,
                    dataAll: action.payload.data.result.rows,
                    alertMsg: 'get finance Succesfully',
                    page: action.payload.data.pageInfo
                };
            }
            case 'GET_ALL_SPVKLAIM_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: "Failed get data finance"
                };
            }
            case 'GET_SPVKLAIM_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_SPVKLAIM_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isGet: true,
                    dataSpvklaim: action.payload.data.result,
                    allSpvklaim: action.payload.data.length,
                    alertMsg: 'get finance Succesfully'
                };
            }
            case 'GET_SPVKLAIM_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'DETAIL_SPVKLAIM_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'DETAIL_SPVKLAIM_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isGet: true,
                    detSpvklaim: action.payload.data.result,
                    alertMsg: 'get detail finance Succesfully',
                };
            }
            case 'DETAIL_SPVKLAIM_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'NEXT_DATA_SPVKLAIM_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'NEXT_DATA_SPVKLAIM_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isAll: true,
                    dataAll: action.payload.data.result.rows,
                    alertMsg: 'next data Succesfully',
                    page: action.payload.data.pageInfo
                };
            }
            case 'NEXT_DATA_SPVKLAIM_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isAll: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'UPDATE_SPVKLAIM_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting'
                };
            }
            case 'UPDATE_SPVKLAIM_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isUpdate: true,
                    alertMsg: 'update user Succesfully'
                };
            }
            case 'UPDATE_SPVKLAIM_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: action.payload.response.data.message,
                    alertM: action.payload.response.data.error
                };
            }
            case 'ADD_SPVKLAIM_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'ADD_SPVKLAIM_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isAdd: true,
                    isError: false,
                    alertMsg: 'add user Succesfully'
                };
            }
            case 'ADD_SPVKLAIM_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: action.payload.response.data.message,
                    alertM: action.payload.response.data.error
                };
            }
            case 'UPLOAD_SPVKLAIM_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting....'
                };
            }
            case 'UPLOAD_SPVKLAIM_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isUpload: true,
                    alertMsg: 'upload master Succesfully'
                };
            }
            case 'UPLOAD_SPVKLAIM_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: action.payload.response.data.message,
                    alertUpload: action.payload.response.data.result
                };
            }
            case 'EXPORT_MASTER_SPVKLAIM_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'EXPORT_MASTER_SPVKLAIM_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isExport: true,
                    link: action.payload.data.link,
                    alertMsg: 'success export data'
                };
            }
            case 'EXPORT_MASTER_SPVKLAIM_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: 'Failed export data'
                };
            }
            case 'RESET_SPVKLAIM': {
                return {
                    ...state,
                    isError: false,
                    isUpdate: false,
                    isAdd: false,
                    isDelete: false,
                    isGet: false,
                    isExport: false,
                    isLoading: false,
                    isUpload: false
                }
            }
            default: {
                return state;
            }
        }
    }