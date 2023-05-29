/* eslint-disable import/no-anonymous-default-export */
const kppState = {
    isAdd: false,
    isAddDetail: false,
    isUpdate: false,
    isGet: false,
    isDelete: false,
    isLoading: false,
    isError: false,
    alertMsg: '',
    dataKpp: [],
    dataName: [],
    alertM: '',
    alertUpload: [],
    page: {},
    isExport: false,
    detKpp: {},
    link: '',
    dataAll: [],
    isAll: false,
    isUpload: false
};

export default (state=kppState, action) => {
        switch(action.type){
            case 'GET_ALL_KPP_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_ALL_KPP_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isAll: true,
                    dataAll: action.payload.data.result.rows,
                    alertMsg: 'get bank Succesfully',
                    page: action.payload.data.pageInfo
                };
            }
            case 'GET_ALL_KPP_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: "Failed get data bank"
                };
            }
            case 'GET_KPP_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_KPP_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isGet: true,
                    dataKpp: action.payload.data.result,
                    alertMsg: 'get bank Succesfully'
                };
            }
            case 'GET_KPP_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'DETAIL_KPP_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'DETAIL_KPP_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isGet: true,
                    detKpp: action.payload.data.result,
                    alertMsg: 'get detail bank Succesfully',
                };
            }
            case 'DETAIL_KPP_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'NEXT_DATA_KPP_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'NEXT_DATA_KPP_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isAll: true,
                    dataAll: action.payload.data.result.rows,
                    alertMsg: 'next data Succesfully',
                    page: action.payload.data.pageInfo
                };
            }
            case 'NEXT_DATA_KPP_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isAll: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'UPDATE_KPP_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting'
                };
            }
            case 'UPDATE_KPP_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isUpdate: true,
                    alertMsg: 'update user Succesfully'
                };
            }
            case 'UPDATE_KPP_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: action.payload.response.data.message,
                    alertM: action.payload.response.data.error
                };
            }
            case 'ADD_KPP_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'ADD_KPP_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isAdd: true,
                    isError: false,
                    alertMsg: 'add user Succesfully'
                };
            }
            case 'ADD_KPP_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: action.payload.response.data.message,
                    alertM: action.payload.response.data.error
                };
            }
            case 'UPLOAD_KPP_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting....'
                };
            }
            case 'UPLOAD_KPP_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isUpload: true,
                    alertMsg: 'upload master Succesfully'
                };
            }
            case 'UPLOAD_KPP_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: action.payload.response.data.message,
                    alertUpload: action.payload.response.data.result
                };
            }
            case 'EXPORT_MASTER_KPP_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'EXPORT_MASTER_KPP_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isExport: true,
                    link: action.payload.data.link,
                    alertMsg: 'success export data'
                };
            }
            case 'EXPORT_MASTER_KPP_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: 'Failed export data'
                };
            }
            case 'RESET_KPP': {
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