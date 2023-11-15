/* eslint-disable import/no-anonymous-default-export */
const glikkState = {
    isAdd: false,
    isAddDetail: false,
    isUpdate: false,
    isGet: false,
    isDelete: false,
    isLoading: false,
    isError: false,
    alertMsg: '',
    dataGlikk: [],
    dataName: [],
    alertM: '',
    alertUpload: [],
    page: {},
    isExport: false,
    detGlikk: {},
    link: '',
    dataAll: [],
    isAll: false,
    isUpload: false
};

export default (state=glikkState, action) => {
        switch(action.type){
            case 'GET_ALLGLIKK_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_ALLGLIKK_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isAll: true,
                    dataAll: action.payload.data.result.rows,
                    alertMsg: 'get glikk Succesfully',
                    page: action.payload.data.pageInfo
                };
            }
            case 'GET_ALLGLIKK_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: "Failed get data glikk"
                };
            }
            case 'GET_GLIKK_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_GLIKK_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isGet: true,
                    dataGlikk: action.payload.data.result,
                    alertMsg: 'get glikk Succesfully'
                };
            }
            case 'GET_GLIKK_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'DETAIL_GLIKK_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'DETAIL_GLIKK_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isGet: true,
                    detGlikk: action.payload.data.result,
                    alertMsg: 'get detail glikk Succesfully',
                };
            }
            case 'DETAIL_GLIKK_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'NEXT_DATA_GLIKK_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'NEXT_DATA_GLIKK_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isAll: true,
                    dataAll: action.payload.data.result.rows,
                    alertMsg: 'next data Succesfully',
                    page: action.payload.data.pageInfo
                };
            }
            case 'NEXT_DATA_GLIKK_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isAll: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'UPDATE_GLIKK_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting'
                };
            }
            case 'UPDATE_GLIKK_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isUpdate: true,
                    alertMsg: 'update user Succesfully'
                };
            }
            case 'UPDATE_GLIKK_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: action.payload.response.data.message,
                    alertM: action.payload.response.data.error
                };
            }
            case 'ADD_GLIKK_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'ADD_GLIKK_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isAdd: true,
                    isError: false,
                    alertMsg: 'add user Succesfully'
                };
            }
            case 'ADD_GLIKK_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: action.payload.response.data.message,
                    alertM: action.payload.response.data.error
                };
            }
            case 'UPLOAD_GLIKK_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting....'
                };
            }
            case 'UPLOAD_GLIKK_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isUpload: true,
                    alertMsg: 'upload master Succesfully'
                };
            }
            case 'UPLOAD_GLIKK_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: action.payload.response.data.message,
                    alertUpload: action.payload.response.data.result
                };
            }
            case 'EXPORT_MASTER_GLIKK_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'EXPORT_MASTER_GLIKK_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isExport: true,
                    link: action.payload.data.link,
                    alertMsg: 'success export data'
                };
            }
            case 'EXPORT_MASTER_GLIKK_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: 'Failed export data'
                };
            }
            case 'RESET_GLIKK': {
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