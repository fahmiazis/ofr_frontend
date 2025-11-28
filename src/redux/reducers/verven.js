/* eslint-disable import/no-anonymous-default-export */
const verifvenState = {
    isAdd: null,
    isAddDetail: false,
    isUpdate: false,
    isUpload: null,
    isGet: null,
    isGetVerven: null,
    isDelete: null,
    isSubmit: null,
    isLoading: false,
    isError: false,
    alertMsg: '',
    dataDoc: [],
    dataCart: [],
    dataName: [],
    detailVerven: [],
    alertM: '',
    alertUpload: [],
    page: {},
    isExport: false,
    detCoa: [],
    link: '',
    isGetDoc: null,
    isDetVerven: null,
    noverven: '',
    dataVerven: [],
    noDis: [],
    isTtd: null,
    ttdVerven: [],
    baseTtd: [],
    docDraft: [],
    isDraft: null,
    isApprove: null,
    isApplist: null,
    isFinVerven: null,
    isReject: null,
    appRevisi: null,
    isEdit: null,
    subRevisi: null,
    subVerif: null,
    subBayar: null,
    newVerven: [],
    editVrf: null,
    isTtdList: null,
    ttdVervenList: [],
    baseTtdList: [],
    isRejectList: null,
    depoCart: {},
    isGetReport: null,
    dataReport: [],
    idVerven: {},
    detailId: null,
    confIdent: null,
    uploadBukti: null,
    isDocBukti: null,
    docBukti: [],
    submitBukti: null,
    detailReport: [],
    isDetRep: false,
    updateNilai: null,
    isIdVerven: null,
    dataAddVer: {},
    noTrans: '',
    isGenNo: null,
    messAdd: '',
    isUploadRekven: null,
    isUpdateRekven: null,
    isAddRekven: null,
    isGetRekven: null,
    isDelRekven: null,
    dataRekven: [],
};

export default (state=verifvenState, action) => {
        switch(action.type){
            case 'GET_VERVEN_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_VERVEN_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isGetVerven: true,
                    dataVerven: action.payload.data.result,
                    noDis: action.payload.data.noDis,
                    newVerven: action.payload.data.newVerven,
                    alertMsg: 'get coa Succesfully'
                };
            }
            case 'GET_VERVEN_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    isGetVerven: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'DETAIL_VERVEN_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'UPLOAD_DOCVERVEN_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'UPLOAD_DOCVERVEN_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isUpload: true,
                    alertMsg: 'get detail coa Succesfully',
                };
            }
            case 'UPLOAD_DOCVERVEN_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isUpload: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'DETAIL_VERVEN_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isDetVerven: true,
                    detailVerven: action.payload.data.result,
                    alertMsg: 'get coa Succesfully'
                };
            }
            case 'DETAIL_VERVEN_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    isDetVerven: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'VERVEN_ID_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'VERVEN_ID_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isIdVerven: true,
                    idVerven: action.payload.data.result,
                    alertMsg: 'get coa Succesfully'
                };
            }
            case 'VERVEN_ID_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    isIdVerven: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'EDIT_VERVEN_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'EDIT_VERVEN_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isEdit: true,
                    alertMsg: 'get detail coa Succesfully',
                };
            }
            case 'EDIT_VERVEN_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isEdit: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'DOC_VERVEN_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'DOC_VERVEN_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isGetDoc: true,
                    dataDoc: action.payload.data.result,
                    alertMsg: 'get detail coa Succesfully',
                };
            }
            case 'DOC_VERVEN_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isGetDoc: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'GENNO_VERVEN_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GENNO_VERVEN_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isGenNo: true,
                    noTrans: action.payload.data.result,
                    alertMsg: 'get detail coa Succesfully',
                };
            }
            case 'GENNO_VERVEN_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isGenNo: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'ADD_VERVEN_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'ADD_VERVEN_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isAdd: true,
                    dataAddVer: action.payload.data.result,
                    alertMsg: 'get detail coa Succesfully',
                };
            }
            case 'ADD_VERVEN_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isAdd: false,
                    messAdd: action.payload.response.data !== undefined ? 'NO KTP Atau NO NPWP Telah Terdaftar Dan Pastikan Pengisian Data Dengan Benar' : "Unable connect to server",
                    alertMsg: "Unable connect to server"
                };
            }
            case 'VERIF_VERVEN_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'VERIF_VERVEN_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isVerven: true,
                    noverven: action.payload.data.noverven,
                    alertMsg: 'get detail coa Succesfully',
                };
            }
            case 'VERIF_VERVEN_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isVerven: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'REJECT_VERVEN_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'REJECT_VERVEN_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isReject: true,
                    alertMsg: 'get detail coa Succesfully',
                };
            }
            case 'REJECT_VERVEN_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isReject: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'REVISI_VERVEN_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'REVISI_VERVEN_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    subRevisi: true,
                    alertMsg: 'get detail coa Succesfully',
                };
            }
            case 'REVISI_VERVEN_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    subRevisi: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'DELETE_REKVEN_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'DELETE_REKVEN_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isDelRekven: true,
                    alertMsg: 'get detail coa Succesfully',
                };
            }
            case 'DELETE_REKVEN_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isDelRekven: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'GET_REKVEN_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_REKVEN_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isGetRekven: true,
                    dataRekven: action.payload.data.result,
                    alertMsg: 'get detail coa Succesfully',
                };
            }
            case 'GET_REKVEN_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isGetRekven: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'UPLOAD_REKVEN_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'UPLOAD_REKVEN_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isUploadRekven: true,
                    alertMsg: 'get detail coa Succesfully',
                };
            }
            case 'UPLOAD_REKVEN_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isUploadRekven: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'UPDATE_REKVEN_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'UPDATE_REKVEN_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isUpdateRekven: true,
                    alertMsg: 'get detail coa Succesfully',
                };
            }
            case 'UPDATE_REKVEN_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isUpdateRekven: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'ADD_REKVEN_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'ADD_REKVEN_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isAddRekven: true,
                    alertMsg: 'get detail coa Succesfully',
                };
            }
            case 'ADD_REKVEN_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isAddRekven: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'RESET_VERVEN': {
                return {
                    ...state,
                    isAdd: null,
                    isDelete: null,
                    isVerven: null,
                    isUpload: null,
                    isGetVerven: null,
                    isApprove: null,
                    isApplist: null,
                    isFinVerven: null,
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
                    updateNilai: null
                }
            }
            default: {
                return state;
            }
        }
    }