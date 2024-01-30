/* eslint-disable import/no-anonymous-default-export */
const notifState = {
    isAdd: false,
    isAddDetail: false,
    isUpdate: false,
    isGet: false,
    isDelete: false,
    isLoading: false,
    isError: false,
    alertMsg: '',
    dataNotif: [],
    dataName: [],
    alertM: '',
    alertUpload: [],
    page: {},
    isExport: false,
    detEmail: {},
    link: '',
    dataAllNotif: [],
    isAll: false,
    isUpload: false,
    draftEmail: {},
    isDraft: null,
    isRead: null,
    draftAjuan: null
};

export default (state=notifState, action) => {
        switch(action.type){
            case 'GET_ALL_NOTIF_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_ALL_NOTIF_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isAll: true,
                    dataAllNotif: action.payload.data.result,
                    alertMsg: 'get notif Succesfully'
                };
            }
            case 'GET_ALL_NOTIF_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: "Failed get data notif"
                };
            }
            case 'GET_NOTIF_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_NOTIF_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isGet: true,
                    dataNotif: action.payload.data.result.rows,
                    page: action.payload.data.pageInfo,
                    alertMsg: 'get notif Succesfully'
                };
            }
            case 'GET_NOTIF_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'DRAFT_NOTIF_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'DRAFT_NOTIF_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    draftEmail: action.payload.data,
                    isDraft: true,
                    alertMsg: 'get notif Succesfully'
                };
            }
            case 'DRAFT_NOTIF_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isDraft: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'AJUAN_NOTIF_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'AJUAN_NOTIF_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    draftEmail: action.payload.data,
                    draftAjuan: true,
                    alertMsg: 'get notif Succesfully'
                };
            }
            case 'AJUAN_NOTIF_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    draftAjuan: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'READ_NOTIF_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'READ_NOTIF_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isRead: true,
                    alertMsg: 'send notif Succesfully'
                };
            }
            case 'READ_NOTIF_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isRead: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'DETAIL_NOTIF_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'DETAIL_NOTIF_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isGet: true,
                    detEmail: action.payload.data.result,
                    alertMsg: 'get detail notif Succesfully',
                };
            }
            case 'DETAIL_NOTIF_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'NEXT_DATA_NOTIF_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'NEXT_DATA_NOTIF_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isGet: true,
                    dataNotif: action.payload.data.result.rows,
                    alertMsg: 'next data Succesfully',
                    page: action.payload.data.pageInfo
                };
            }
            case 'NEXT_DATA_NOTIF_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isGet: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'UPDATE_NOTIF_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting'
                };
            }
            case 'UPDATE_NOTIF_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isUpdate: true,
                    alertMsg: 'update user Succesfully'
                };
            }
            case 'UPDATE_NOTIF_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: 'failed update notif',
                };
            }
            case 'ADD_NOTIF_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'ADD_NOTIF_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isAdd: true,
                    isError: false,
                    alertMsg: 'add user Succesfully'
                };
            }
            case 'ADD_NOTIF_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: 'failed create notif',
                };
            }
            case 'RESET_NOTIF': {
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
                    isRead: null,
                    draftAjuan: null
                }
            }
            default: {
                return state;
            }
        }
    }