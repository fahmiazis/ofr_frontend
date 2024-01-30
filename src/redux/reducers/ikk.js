/* eslint-disable import/no-anonymous-default-export */
const ikkState = {
    isAdd: null,
    isAddDetail: false,
    isUpdate: false,
    isUpload: null,
    isGet: null,
    isGetIkk: null,
    isDelete: null,
    isSubmit: null,
    isLoading: false,
    isError: false,
    alertMsg: '',
    dataDoc: [],
    dataCart: [],
    dataName: [],
    detailIkk: [],
    alertM: '',
    alertUpload: [],
    page: {},
    isExport: false,
    detCoa: [],
    link: '',
    isGetDoc: null,
    isDetIkk: null,
    noikk: '',
    dataIkk: [],
    noDis: [],
    isTtd: null,
    ttdIkk: [],
    baseTtd: [],
    docDraft: [],
    isDraft: null,
    isApprove: null,
    isApplist: null,
    isFinIkk: null,
    isReject: null,
    appRevisi: null,
    isEdit: null,
    subRevisi: null,
    subVerif: null,
    subBayar: null,
    newIkk: [],
    editVrf: null,
    isTtdList: null,
    ttdIkkList: [],
    baseTtdList: [],
    isRejectList: null,
    depoCart: {},
    isGetReport: null,
    dataReport: [],
    idIkk: {},
    detailId: null,
    confIdent: null,
    uploadBukti: null,
    isDocBukti: null,
    docBukti: [],
    submitBukti: null,
    detailReport: [],
    isDetRep: false,
    updateNilai: null,
    isFormIkk: null
};

export default (state=ikkState, action) => {
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
                    depoCart: action.payload.data.depo,
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
            case 'GET_IKK_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_IKK_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isGetIkk: true,
                    dataIkk: action.payload.data.result,
                    noDis: action.payload.data.noDis,
                    newIkk: action.payload.data.newIkk,
                    alertMsg: 'get coa Succesfully'
                };
            }
            case 'GET_IKK_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    isGetIkk: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'REPORT_IKK_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'REPORT_IKK_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isGetReport: true,
                    dataReport: action.payload.data.result,
                    alertMsg: 'get coa Succesfully'
                };
            }
            case 'REPORT_IKK_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    isGetReport: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'DETAIL_IKK_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'DETAIL_IKK_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isDetIkk: true,
                    detailIkk: action.payload.data.result,
                    alertMsg: 'get coa Succesfully'
                };
            }
            case 'DETAIL_IKK_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    isDetIkk: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'DETAIL_REPORT_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'DETAIL_REPORT_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isDetRep: true,
                    detailReport: action.payload.data.result,
                    alertMsg: 'get coa Succesfully'
                };
            }
            case 'DETAIL_REPORT_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    isDetRep: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'DETAILID_IKK_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'DETAILID_IKK_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    detailId: true,
                    idIkk: action.payload.data.result,
                    alertMsg: 'get coa Succesfully'
                };
            }
            case 'DETAILID_IKK_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    detailId: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'TTD_IKK_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'TTD_IKK_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isTtd: true,
                    ttdIkk: action.payload.data.result,
                    baseTtd: action.payload.data.findTtd,
                    alertMsg: 'get coa Succesfully'
                };
            }
            case 'TTD_IKK_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    isTtd: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'TTDLIST_IKK_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'TTDLIST_IKK_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isTtdList: true,
                    ttdIkkList: action.payload.data.result,
                    baseTtdList: action.payload.data.findTtd,
                    alertMsg: 'get coa Succesfully'
                };
            }
            case 'TTDLIST_IKK_REJECTED': {
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
            case 'EDIT_IKK_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'EDIT_IKK_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isEdit: true,
                    alertMsg: 'get detail coa Succesfully',
                };
            }
            case 'EDIT_IKK_REJECTED': {
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
            case 'SUBMIT_IKK_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'SUBMIT_IKK_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isIkk: true,
                    noikk: action.payload.data.noikk,
                    alertMsg: 'get detail coa Succesfully',
                };
            }
            case 'SUBMIT_IKK_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isIkk: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'SUBMIT_IKKFINAL_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'SUBMIT_IKKFINAL_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isFinIkk: true,
                    alertMsg: 'success submet final Succesfully',
                };
            }
            case 'SUBMIT_IKKFINAL_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isFinIkk: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'APPROVE_IKK_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'APPROVE_IKK_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isApprove: true,
                    alertMsg: 'get detail coa Succesfully',
                };
            }
            case 'APPROVE_IKK_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isApprove: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'APPROVELIST_IKK_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'APPROVELIST_IKK_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isApplist: true,
                    alertMsg: 'get detail coa Succesfully',
                };
            }
            case 'APPROVELIST_IKK_REJECTED': {
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
            case 'REJECT_IKK_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'REJECT_IKK_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isReject: true,
                    alertMsg: 'get detail coa Succesfully',
                };
            }
            case 'REJECT_IKK_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isReject: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'REJECTLIST_IKK_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'REJECTLIST_IKK_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isRejectList: true,
                    alertMsg: 'get detail coa Succesfully',
                };
            }
            case 'REJECTLIST_IKK_REJECTED': {
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
            case 'DOC_BUKTIIKK_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'DOC_BUKTIIKK_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isDocBukti: true,
                    docBukti: action.payload.data.result,
                    alertMsg: 'upload bukti Succesfully',
                };
            }
            case 'DOC_BUKTIIKK_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isDocBukti: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'UPLOAD_BUKTIIKK_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'UPLOAD_BUKTIIKK_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    uploadBukti: true,
                    alertMsg: 'upload bukti Succesfully',
                };
            }
            case 'UPLOAD_BUKTIIKK_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    uploadBukti: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'SUBMIT_BUKTIIKK_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'SUBMIT_BUKTIIKK_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    submitBukti: true,
                    alertMsg: 'upload bukti Succesfully',
                };
            }
            case 'SUBMIT_BUKTIIKK_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    submitBukti: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'UPDATE_NILAIIKK_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'UPDATE_NILAIIKK_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    updateNilai: true,
                    alertMsg: 'upload bukti Succesfully',
                };
            }
            case 'UPDATE_NILAIIKK_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    updateNilai: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'CONFIRM_IDENTIKK_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'CONFIRM_IDENTIKK_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    confIdent: true,
                    alertMsg: 'get detail coa Succesfully',
                };
            }
            case 'CONFIRM_IDENTIKK_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    confIdent: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'DOWNLOAD_FORM_IKK_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'DOWNLOAD_FORM_IKK_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isFormIkk: true,
                    alertMsg: 'get detail coa Succesfully',
                };
            }
            case 'DOWNLOAD_FORM_IKK_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isFormIkk: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'RESET_IKK': {
                return {
                    ...state,
                    isAdd: null,
                    isDelete: null,
                    isIkk: null,
                    isUpload: null,
                    isGetIkk: null,
                    isApprove: null,
                    isApplist: null,
                    isFinIkk: null,
                    isReject: null,
                    isRejectList: null,
                    appRevisi: null,
                    isEdit: null,
                    subRevisi: null,
                    subVerif: null,
                    editVrf: null,
                    subBayar: null,
                    isGetReport: null,
                    detailId: null,
                    confIdent: null,
                    uploadBukti: null,
                    isDocBukti: null,
                    submitBukti: null,
                    isDetRep: null,
                    updateNilai: null,
                    isFormIkk: null
                }
            }
            default: {
                return state;
            }
        }
    }