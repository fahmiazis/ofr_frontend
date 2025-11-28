/* eslint-disable import/no-anonymous-default-export */
const dokumenState = {
    isAdd: null,
    isUpload: false,
    isUpdate: null,
    isGet: false,
    isDetail: false,
    isDelete: false,
    token: '',
    isLoading: false,
    isError: false,
    alertMsg: '',
    dataDokumen: [],
    detailDokumen: {},
    alertM: '',
    alertUpload: [],
    page: {},
    isExport: false,
    link: '',
    isShow: null,
    dataShow: '',
    isApprove: null,
    isReject: null,
    isEditName: null,
    isCreate: null,
    isGetName: null,
    dataName: [],
    isDetName: true,
    detailName: [],
    isDeleteName: null,
    idName: {},
    isTempName: null,
};

export default (state=dokumenState, action) => {
        switch(action.type){
            case 'SHOW_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'SHOW_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isShow: true,
                    dataShow: action.payload.config.url,
                    alertMsg: 'show document succesfully',
                };
            }
            case 'SHOW_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isShow: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'APPROVE_DOKUMEN_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'APPROVE_DOKUMEN_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isApprove: true,
                    alertMsg: 'approve document succesfully',
                };
            }
            case 'APPROVE_DOKUMEN_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isApprove: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'REJECT_DOKUMEN_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'REJECT_DOKUMEN_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isReject: true,
                    alertMsg: 'reject document succesfully',
                };
            }
            case 'REJECT_DOKUMEN_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isReject: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'EXPORT_MASTER_DOKUMEN_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'EXPORT_MASTER_DOKUMEN_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    isExport: true,
                    link: action.payload.data.link,
                    alertMsg: 'success export data'
                };
            }
            case 'EXPORT_MASTER_DOKUMEN_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isExport: false,
                    isError: true,
                    alertMsg: 'Failed export data'
                };
            }
            case 'ADD_DOKUMEN_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'ADD_DOKUMEN_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isAdd: true,
                    isError: false,
                    alertMsg: 'add dokumen Succesfully'
                };
            }
            case 'ADD_DOKUMEN_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isAdd: false,
                };
            }
            case 'GET_DOKUMEN_PENDING': {
                return {
                    ...state,
                    isGet: false,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_DOKUMEN_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    isGet: true,
                    dataDokumen: action.payload.data.result.rows,
                    alertMsg: 'get dokumen Succesfully',
                    page: action.payload.data.pageInfo
                };
            }
            case 'GET_DOKUMEN_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'NEXT_DATA_DOKUMEN_PENDING': {
                return {
                    ...state,
                    isGet: false,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'NEXT_DATA_DOKUMEN_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    isGet: true,
                    dataDokumen: action.payload.data.result.rows,
                    alertMsg: 'get dokumen Succesfully',
                    page: action.payload.data.pageInfo
                };
            }
            case 'NEXT_DATA_DOKUMEN_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'GET_DETAIL_DOKUMEN_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    isDetail: false,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_DETAIL_DOKUMEN_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    isDetail: true,
                    detailDokumen: action.payload.data.result,
                    alertMsg: 'get detail dokumen Succesfully'
                };
            }
            case 'GET_DETAIL_DOKUMEN_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isDetail: false,
                    isError: true,
                    alertMsg: action.payload.response.data.message,
                    alert: action.payload.response.data.error
                };
            }
            case 'UPDATE_DOKUMEN_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Login in ....'
                };
            }
            case 'UPDATE_DOKUMEN_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isUpdate: true,
                    isError: false,
                    alertMsg: 'update dokumen Succesfully'
                };
            }
            case 'UPDATE_DOKUMEN_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isUpdate: false
                };
            }
            case 'UPLOAD_MASTER_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting....'
                };
            }
            case 'UPLOAD_MASTER_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isUpload: true,
                    isError: false,
                    alertMsg: 'upload master Succesfully'
                };
            }
            case 'UPLOAD_MASTER_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isUpload: false,
                    isError: true,
                    alertMsg: action.payload.response.data.message,
                    alertUpload: action.payload.response.data.result
                };
            }
            case 'CREATE_NAMEDOK_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'CREATE_NAMEDOK_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isCreate: true,
                    alertMsg: 'add approve Succesfully'
                };
            }
            case 'CREATE_NAMEDOK_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isCreate: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'UPDATE_NAMEDOK_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'UPDATE_NAMEDOK_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isEditName: true,
                    alertMsg: 'edit name approve Succesfully'
                };
            }
            case 'UPDATE_NAMEDOK_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isEditName: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'GET_NAMEDOK_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_NAMEDOK_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isGetName: true,
                    dataName: action.payload.data.result.rows,
                    page: action.payload.data.pageInfo,
                    alertMsg: 'get approve Succesfully',
                };
            }
            case 'GET_NAMEDOK_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isGetName: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'GET_TEMPLATE_NAMEDOK_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_TEMPLATE_NAMEDOK_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isTempName: true,
                    idName: action.payload.data.result,
                    alertMsg: 'get detail approve Succesfully',
                };
            }
            case 'GET_TEMPLATE_NAMEDOK_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isTempName: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'GET_DETAIL_NAMEDOK_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_DETAIL_NAMEDOK_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isDetName: true,
                    detailName: action.payload.data.result,
                    alertMsg: 'get detail approve Succesfully',
                };
            }
            case 'GET_DETAIL_NAMEDOK_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isDetName: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'DELETE_NAMEDOK_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'DELETE_NAMEDOK_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isDeleteName: true,
                    alertMsg: 'delete approve Succesfully',
                };
            }
            case 'DELETE_NAMEDOK_REJECTED': {
                return {
                    ...state,
                    isDeleteName: false,
                    isLoading: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'RESET_DOKUMEN': {
                return {
                    ...state,
                    isError: false,
                    isUpload: false,
                    isExport: false,
                    isApprove: null,
                    isReject: null,
                    isEditName: null,
                    isCreate: null,
                    isDetName: null,
                    isGetName: null,
                    isTempName: null,
                    isDeleteName: null,
                    isUpdate: null,
                    isAdd: null
                }
            }
            default: {
                return state;
            }
        }
    }