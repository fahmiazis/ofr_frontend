/* eslint-disable import/no-anonymous-default-export */
const klaimState = {
    isAdd: null,
    isAddDetail: false,
    isUpdate: false,
    isUpload: null,
    isGet: null,
    isGetKlaim: null,
    isDelete: null,
    isSubmit: null,
    isLoading: false,
    isError: false,
    alertMsg: '',
    dataDoc: [],
    dataCart: [],
    dataName: [],
    detailKlaim: [],
    alertM: '',
    alertUpload: [],
    page: {},
    isExport: false,
    detCoa: [],
    link: '',
    isGetDoc: null,
    isDetKlaim: null,
    noklaim: '',
    dataKlaim: [],
    noDis: [],
    isTtd: null,
    ttdKlaim: [],
    baseTtd: [],
    docDraft: [],
    isDraft: null,
    isApprove: null,
    isApplist: null,
    isFinKlaim: null,
    isReject: null,
    appRevisi: null,
    isEdit: null,
    subRevisi: null,
    subVerif: null,
    subBayar: null,
    newKlaim: [],
    editVrf: null,
    isTtdList: null,
    ttdKlaimList: [],
    baseTtdList: [],
    isRejectList: null,
};

export default (state=klaimState, action) => {
        switch(action.type){
            case 'GET_CART_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_CART_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isGet: true,
                    dataCart: action.payload.data.result,
                    alertMsg: 'get coa Succesfully'
                };
            }
            case 'GET_CART_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    isGet: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'GET_KLAIM_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_KLAIM_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isGetKlaim: true,
                    dataKlaim: action.payload.data.result,
                    noDis: action.payload.data.noDis,
                    newKlaim: action.payload.data.newKlaim,
                    alertMsg: 'get coa Succesfully'
                };
            }
            case 'GET_KLAIM_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    isGetKlaim: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'DETAIL_KLAIM_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'DETAIL_KLAIM_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isDetKlaim: true,
                    detailKlaim: action.payload.data.result,
                    alertMsg: 'get coa Succesfully'
                };
            }
            case 'DETAIL_KLAIM_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    isDetKlaim: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'TTD_KLAIM_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'TTD_KLAIM_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isTtd: true,
                    ttdKlaim: action.payload.data.result,
                    baseTtd: action.payload.data.findTtd,
                    alertMsg: 'get coa Succesfully'
                };
            }
            case 'TTD_KLAIM_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    isTtd: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'TTDLIST_KLAIM_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'TTDLIST_KLAIM_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isTtdList: true,
                    ttdKlaimList: action.payload.data.result,
                    baseTtdList: action.payload.data.findTtd,
                    alertMsg: 'get coa Succesfully'
                };
            }
            case 'TTDLIST_KLAIM_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    isTtdList: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'ADD_CART_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'ADD_CART_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isAdd: true,
                    alertMsg: 'get detail coa Succesfully',
                };
            }
            case 'ADD_CART_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isAdd: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'EDIT_KLAIM_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'EDIT_KLAIM_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isEdit: true,
                    alertMsg: 'get detail coa Succesfully',
                };
            }
            case 'EDIT_KLAIM_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isEdit: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'EDIT_VERIF_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'EDIT_VERIF_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    editVrf: true,
                    alertMsg: 'get detail coa Succesfully',
                };
            }
            case 'EDIT_VERIF_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    editVrf: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'DELETE_CART_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'DELETE_CART_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isDelete: true,
                    alertMsg: 'get detail coa Succesfully',
                };
            }
            case 'DELETE_CART_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isDelete: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'SUBMIT_KLAIM_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'SUBMIT_KLAIM_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isKlaim: true,
                    noklaim: action.payload.data.noklaim,
                    alertMsg: 'get detail coa Succesfully',
                };
            }
            case 'SUBMIT_KLAIM_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isKlaim: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'SUBMIT_KLAIMFINAL_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'SUBMIT_KLAIMFINAL_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isFinKlaim: true,
                    alertMsg: 'success submet final Succesfully',
                };
            }
            case 'SUBMIT_KLAIMFINAL_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isFinKlaim: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'APPROVE_KLAIM_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'APPROVE_KLAIM_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isApprove: true,
                    alertMsg: 'get detail coa Succesfully',
                };
            }
            case 'APPROVE_KLAIM_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isApprove: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'APPROVELIST_KLAIM_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'APPROVELIST_KLAIM_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isApplist: true,
                    alertMsg: 'get detail coa Succesfully',
                };
            }
            case 'APPROVELIST_KLAIM_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isApplist: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'APP_REVISI_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'APP_REVISI_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    appRevisi: true,
                    alertMsg: 'get detail coa Succesfully',
                };
            }
            case 'APP_REVISI_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    appRevisi: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'SUBMIT_REVISI_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'SUBMIT_REVISI_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    subRevisi: true,
                    alertMsg: 'get detail coa Succesfully',
                };
            }
            case 'SUBMIT_REVISI_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    subRevisi: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'SUBMIT_VERIF_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'SUBMIT_VERIF_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    subVerif: true,
                    alertMsg: 'get detail coa Succesfully',
                };
            }
            case 'SUBMIT_VERIF_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    subVerif: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'SUBMIT_BAYAR_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'SUBMIT_BAYAR_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    subBayar: true,
                    alertMsg: 'success submit bayar Succesfully',
                };
            }
            case 'SUBMIT_BAYAR_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    subBayar: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'REJECT_KLAIM_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'REJECT_KLAIM_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isReject: true,
                    alertMsg: 'get detail coa Succesfully',
                };
            }
            case 'REJECT_KLAIM_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isReject: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'REJECTLIST_KLAIM_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'REJECTLIST_KLAIM_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isRejectList: true,
                    alertMsg: 'get detail coa Succesfully',
                };
            }
            case 'REJECTLIST_KLAIM_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isRejectList: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'UPLOAD_DOC_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'UPLOAD_DOC_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isUpload: true,
                    alertMsg: 'get detail coa Succesfully',
                };
            }
            case 'UPLOAD_DOC_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isUpload: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'GET_DOC_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_DOC_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isGetDoc: true,
                    dataDoc: action.payload.data.result,
                    alertMsg: 'get coa Succesfully'
                };
            }
            case 'GET_DOC_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    isGetDoc: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'GET_DOCDRAFT_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_DOCDRAFT_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isDraft: true,
                    docDraft: action.payload.data.result,
                    alertMsg: 'get coa Succesfully'
                };
            }
            case 'GET_DOCDRAFT_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    isDraft: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'RESET_KLAIM': {
                return {
                    ...state,
                    isAdd: null,
                    isDelete: null,
                    isKlaim: null,
                    isUpload: null,
                    isGetKlaim: null,
                    isApprove: null,
                    isApplist: null,
                    isFinKlaim: null,
                    isReject: null,
                    isRejectList: null,
                    appRevisi: null,
                    isEdit: null,
                    subRevisi: null,
                    subVerif: null,
                    editVrf: null,
                    subBayar: null
                }
            }
            default: {
                return state;
            }
        }
    }