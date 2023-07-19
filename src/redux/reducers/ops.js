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
    noops: '',
    dataOps: [],
    noDis: [],
    isTtd: null,
    ttdOps: [],
    baseTtd: [],
    docDraft: [],
    isDraft: null,
    isApprove: null,
    isApplist: null,
    isFinOps: null,
    isReject: null,
    appRevisi: null,
    isEdit: null,
    subRevisi: null,
    subVerif: null,
    subRealisasi: null,
    subBayar: null,
    newOps: [],
    editVrf: null,
    isTtdList: null,
    ttdOpsList: [],
    baseTtdList: [],
    isRejectList: null,
    isGetReport: null,
    dataReport: [],
    idOps: {},
    detailId: null,
    confIdent: null,
    uploadBukti: null,
    isDocBukti: null,
    docBukti: [],
    submitBukti: null
};

export default (state=opsState, action) => {
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
                    newOps: action.payload.data.newOps,
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
            case 'REPORT_OPS_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'REPORT_OPS_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isGetReport: true,
                    dataReport: action.payload.data.result || [],
                    alertMsg: 'get coa Succesfully'
                };
            }
            case 'REPORT_OPS_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    isGetReport: false,
                    dataReport: [],
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
            case 'DETAILID_OPS_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'DETAILID_OPS_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    detailId: true,
                    idOps: action.payload.data.result,
                    alertMsg: 'get coa Succesfully'
                };
            }
            case 'DETAILID_OPS_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    detailId: false,
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
            case 'TTDLIST_OPS_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'TTDLIST_OPS_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isTtdList: true,
                    ttdOpsList: action.payload.data.result,
                    baseTtdList: action.payload.data.findTtd,
                    alertMsg: 'get coa Succesfully'
                };
            }
            case 'TTDLIST_OPS_REJECTED': {
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
            case 'EDIT_OPS_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'EDIT_OPS_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isEdit: true,
                    alertMsg: 'get detail coa Succesfully',
                };
            }
            case 'EDIT_OPS_REJECTED': {
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
            case 'CONFIRM_IDENT_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'CONFIRM_IDENT_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    confIdent: true,
                    alertMsg: 'get detail coa Succesfully',
                };
            }
            case 'CONFIRM_IDENT_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    confIdent: false,
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
                    noops: action.payload.data.noops,
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
            case 'SUBMIT_OPSFINAL_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'SUBMIT_OPSFINAL_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isFinOps: true,
                    alertMsg: 'success submet final Succesfully',
                };
            }
            case 'SUBMIT_OPSFINAL_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isFinOps: false,
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
            case 'APPROVELIST_OPS_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'APPROVELIST_OPS_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isApplist: true,
                    alertMsg: 'get detail coa Succesfully',
                };
            }
            case 'APPROVELIST_OPS_REJECTED': {
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
            case 'SUBMIT_REALISASI_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'SUBMIT_REALISASI_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    subRealisasi: true,
                    alertMsg: 'get detail coa Succesfully',
                };
            }
            case 'SUBMIT_REALISASI_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    subRealisasi: false,
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
            case 'REJECT_OPS_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'REJECT_OPS_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isReject: true,
                    alertMsg: 'get detail coa Succesfully',
                };
            }
            case 'REJECT_OPS_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isReject: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'REJECTLIST_OPS_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'REJECTLIST_OPS_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isRejectList: true,
                    alertMsg: 'get detail coa Succesfully',
                };
            }
            case 'REJECTLIST_OPS_REJECTED': {
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
            case 'DOC_BUKTIOPS_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'DOC_BUKTIOPS_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isDocBukti: true,
                    docBukti: action.payload.data.result,
                    alertMsg: 'upload bukti Succesfully',
                };
            }
            case 'DOC_BUKTIOPS_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isDocBukti: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'UPLOAD_BUKTIOPS_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'UPLOAD_BUKTIOPS_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    uploadBukti: true,
                    alertMsg: 'upload bukti Succesfully',
                };
            }
            case 'UPLOAD_BUKTIOPS_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    uploadBukti: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'SUBMIT_BUKTIOPS_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'SUBMIT_BUKTIOPS_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    submitBukti: true,
                    alertMsg: 'upload bukti Succesfully',
                };
            }
            case 'SUBMIT_BUKTIOPS_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    submitBukti: false,
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
                    isApprove: null,
                    isApplist: null,
                    isFinOps: null,
                    isReject: null,
                    isRejectList: null,
                    appRevisi: null,
                    isEdit: null,
                    subRevisi: null,
                    subVerif: null,
                    subRealisasi: null,
                    editVrf: null,
                    subBayar: null,
                    isGetReport: null,
                    detailId: null,
                    confIdent: null,
                    uploadBukti: null,
                    isDocBukti: null,
                    submitBukti: null,
                }
            }
            default: {
                return state;
            }
        }
    }