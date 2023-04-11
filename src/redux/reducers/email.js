/* eslint-disable import/no-anonymous-default-export */
const emailState = {
    isAdd: false,
    isAddDetail: false,
    isUpdate: false,
    isGet: false,
    isDelete: false,
    isLoading: false,
    isError: false,
    alertMsg: '',
    dataEmail: [],
    dataName: [],
    alertM: '',
    alertUpload: [],
    page: {},
    isExport: false,
    detEmail: {},
    link: '',
    dataAll: [],
    isAll: false,
    isUpload: false,
    draftEmail: {},
    isDraft: null,
    isSend: null
};

export default (state=emailState, action) => {
        switch(action.type){
            case 'GET_ALL_EMAIL_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_ALL_EMAIL_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isAll: true,
                    dataAll: action.payload.data.result,
                    alertMsg: 'get email Succesfully'
                };
            }
            case 'GET_ALL_EMAIL_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: "Failed get data email"
                };
            }
            case 'GET_EMAIL_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_EMAIL_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isGet: true,
                    dataEmail: action.payload.data.result.rows,
                    page: action.payload.data.pageInfo,
                    alertMsg: 'get email Succesfully'
                };
            }
            case 'GET_EMAIL_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'DRAFT_EMAIL_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'DRAFT_EMAIL_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    draftEmail: action.payload.data,
                    isDraft: true,
                    alertMsg: 'get email Succesfully'
                };
            }
            case 'DRAFT_EMAIL_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isDraft: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'SEND_EMAIL_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'SEND_EMAIL_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isSend: true,
                    alertMsg: 'send email Succesfully'
                };
            }
            case 'SEND_EMAIL_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isSend: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'DETAIL_EMAIL_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'DETAIL_EMAIL_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isGet: true,
                    detEmail: action.payload.data.result,
                    alertMsg: 'get detail email Succesfully',
                };
            }
            case 'DETAIL_EMAIL_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'NEXT_DATA_EMAIL_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'NEXT_DATA_EMAIL_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isAll: true,
                    dataAll: action.payload.data.result.rows,
                    alertMsg: 'next data Succesfully',
                    page: action.payload.data.pageInfo
                };
            }
            case 'NEXT_DATA_EMAIL_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isAll: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'UPDATE_EMAIL_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting'
                };
            }
            case 'UPDATE_EMAIL_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isUpdate: true,
                    alertMsg: 'update user Succesfully'
                };
            }
            case 'UPDATE_EMAIL_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: action.payload.response.data.message,
                    alertM: action.payload.response.data.error
                };
            }
            case 'ADD_EMAIL_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'ADD_EMAIL_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isAdd: true,
                    isError: false,
                    alertMsg: 'add user Succesfully'
                };
            }
            case 'ADD_EMAIL_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: action.payload.response.data.message,
                    alertM: action.payload.response.data.error
                };
            }
            case 'RESET_EMAIL': {
                return {
                    ...state,
                    isError: false,
                    isUpdate: false,
                    isAdd: false,
                    isDelete: false,
                    isGet: false,
                    isExport: false,
                    isLoading: false,
                    isUpload: false,
                    isDraft: null,
                    isSend: null
                }
            }
            default: {
                return state;
            }
        }
    }