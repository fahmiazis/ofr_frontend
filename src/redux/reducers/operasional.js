/* eslint-disable import/no-anonymous-default-export */
const opsState = {
    isAdd: null,
    isAddDetail: false,
    isUpdate: false,
    isUpload: null,
    isGet: null,
    isGetOps: null,
    isDelete: null,
    isSubmit: null,
    isLoading: false,
    isError: false,
    alertMsg: '',
    dataDoc: [],
    dataCart: [],
    dataName: [],
    detailOps: [],
    alertM: '',
    alertUpload: [],
    page: {},
    isExport: false,
    detCoa: [],
    link: '',
    isGetDoc: null,
    isDetOps: null,
    noklaim: '',
    dataOps: [],
    noDis: [],
    isTtd: null,
    ttdOps: [],
    baseTtd: [],
    isApprove: null
};

export default (state=opsState, action) => {
        switch(action.type){
            case 'GET_CART_OPS_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_CART_OPS_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isGet: true,
                    dataCart: action.payload.data.result,
                    alertMsg: 'get coa Succesfully'
                };
            }
            case 'GET_CART_OPS_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    isGet: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'GET_OPS_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_OPS_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isGetOps: true,
                    dataOps: action.payload.data.result,
                    noDis: action.payload.data.noDis,
                    alertMsg: 'get coa Succesfully'
                };
            }
            case 'GET_OPS_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    isGetOps: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'DETAIL_OPS_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'DETAIL_OPS_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isDetOps: true,
                    detailOps: action.payload.data.result,
                    alertMsg: 'get coa Succesfully'
                };
            }
            case 'DETAIL_OPS_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    isDetOps: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'TTD_OPS_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'TTD_OPS_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isTtd: true,
                    ttdOps: action.payload.data.result,
                    baseTtd: action.payload.data.findTtd,
                    alertMsg: 'get coa Succesfully'
                };
            }
            case 'TTD_OPS_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    isTtd: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'ADD_CART_OPS_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'ADD_CART_OPS_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isAdd: true,
                    alertMsg: 'get detail coa Succesfully',
                };
            }
            case 'ADD_CART_OPS_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isAdd: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'DELETE_CART_OPS_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'DELETE_CART_OPS_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isDelete: true,
                    alertMsg: 'get detail coa Succesfully',
                };
            }
            case 'DELETE_CART_OPS_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isDelete: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'SUBMIT_OPS_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'SUBMIT_OPS_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isOps: true,
                    noklaim: action.payload.data.noklaim,
                    alertMsg: 'get detail coa Succesfully',
                };
            }
            case 'SUBMIT_OPS_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isOps: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'APPROVE_OPS_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'APPROVE_OPS_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isApprove: true,
                    noklaim: action.payload.data.noklaim,
                    alertMsg: 'get detail coa Succesfully',
                };
            }
            case 'APPROVE_OPS_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isApprove: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'UPLOAD_DOC_OPS_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'UPLOAD_DOC_OPS_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isUpload: true,
                    alertMsg: 'get detail coa Succesfully',
                };
            }
            case 'UPLOAD_DOC_OPS_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isUpload: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'GET_DOC_OPS_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_DOC_OPS_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isGetDoc: true,
                    dataDoc: action.payload.data.result,
                    alertMsg: 'get coa Succesfully'
                };
            }
            case 'GET_DOC_OPS_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    isGetDoc: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'RESET_OPS': {
                return {
                    ...state,
                    isAdd: null,
                    isDelete: null,
                    isOps: null,
                    isUpload: null,
                    isGetOps: null,
                    isApprove: null
                }
            }
            default: {
                return state;
            }
        }
    }