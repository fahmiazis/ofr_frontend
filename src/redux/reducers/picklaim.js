/* eslint-disable import/no-anonymous-default-export */
const picklaimState = {
    isAdd: false,
    isAddDetail: false,
    isUpdate: false,
    isGet: false,
    isDelete: false,
    isLoading: false,
    isError: false,
    alertMsg: '',
    dataPicklaim: [],
    dataName: [],
    alertM: '',
    alertUpload: [],
    page: {},
    isExport: false,
    detPicklaim: {},
    link: '',
    dataAll: [],
    isAll: false,
    isUpload: false,
    allPicklaim: [],
    dataRek: [],
    isFinRek: false
};

export default (state=picklaimState, action) => {
        switch(action.type){
            case 'GET_ALL_PICKLAIM_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_ALL_PICKLAIM_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isAll: true,
                    dataAll: action.payload.data.result.rows,
                    alertMsg: 'get finance Succesfully',
                    page: action.payload.data.pageInfo
                };
            }
            case 'GET_ALL_PICKLAIM_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: "Failed get data finance"
                };
            }
            case 'GET_PICKLAIM_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_PICKLAIM_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isGet: true,
                    dataPicklaim: action.payload.data.result,
                    allPicklaim: action.payload.data.length,
                    alertMsg: 'get finance Succesfully'
                };
            }
            case 'GET_PICKLAIM_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'DETAIL_PICKLAIM_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'DETAIL_PICKLAIM_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isGet: true,
                    detPicklaim: action.payload.data.result,
                    alertMsg: 'get detail finance Succesfully',
                };
            }
            case 'DETAIL_PICKLAIM_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'NEXT_DATA_PICKLAIM_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'NEXT_DATA_PICKLAIM_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isAll: true,
                    dataAll: action.payload.data.result.rows,
                    alertMsg: 'next data Succesfully',
                    page: action.payload.data.pageInfo
                };
            }
            case 'NEXT_DATA_PICKLAIM_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isAll: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'UPDATE_PICKLAIM_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting'
                };
            }
            case 'UPDATE_PICKLAIM_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isUpdate: true,
                    alertMsg: 'update user Succesfully'
                };
            }
            case 'UPDATE_PICKLAIM_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: action.payload.response.data.message,
                    alertM: action.payload.response.data.error
                };
            }
            case 'ADD_PICKLAIM_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'ADD_PICKLAIM_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isAdd: true,
                    isError: false,
                    alertMsg: 'add user Succesfully'
                };
            }
            case 'ADD_PICKLAIM_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: action.payload.response.data.message,
                    alertM: action.payload.response.data.error
                };
            }
            case 'UPLOAD_PICKLAIM_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting....'
                };
            }
            case 'UPLOAD_PICKLAIM_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isUpload: true,
                    alertMsg: 'upload master Succesfully'
                };
            }
            case 'UPLOAD_PICKLAIM_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: action.payload.response.data.message,
                    alertUpload: action.payload.response.data.result
                };
            }
            case 'EXPORT_MASTER_PICKLAIM_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'EXPORT_MASTER_PICKLAIM_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isExport: true,
                    link: action.payload.data.link,
                    alertMsg: 'success export data'
                };
            }
            case 'EXPORT_MASTER_PICKLAIM_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: 'Failed export data'
                };
            }
            case 'RESET_PICKLAIM': {
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