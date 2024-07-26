/* eslint-disable import/no-anonymous-default-export */
const coaState = {
    isAdd: false,
    isAddDetail: false,
    isUpdate: false,
    isGet: false,
    isDelete: false,
    isLoading: false,
    isError: false,
    alertMsg: '',
    dataCoa: [],
    dataName: [],
    alertM: '',
    alertUpload: [],
    page: {},
    isExport: false,
    detCoa: {},
    link: '',
    dataAll: [],
    isAll: false,
    isUpload: false,
    allCoa: [],
    nomCoa: [],
    listGl: [],
    glLisIn: [],
    glListrik: [
        547710,
        55020001
    ],
    dataPph:{
        pph21: '21050107',
        pph23: '21050102',
        ppn: '11060204',
        pph4a2: '21050101',
        kasbon: 'V100IN0001',
        bankops: '11010401',
        pc_ho: 'P01H000001'
    },
    dataPphSc:{
        pph21: '213710',
        pph23: '213210',
        ppn: '11060204',
        pph4a2: '213110',
        kasbon: 'V100IN0001',
        bankops: '11010401',
        pc_ho: 'P01H000001'
    }
};

export default (state=coaState, action) => {
        switch(action.type){
            case 'GET_ALL_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_ALL_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isAll: true,
                    dataAll: action.payload.data.result.rows,
                    alertMsg: 'get coa Succesfully',
                    page: action.payload.data.pageInfo
                };
            }
            case 'GET_ALL_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: "Failed get data coa"
                };
            }
            case 'GET_COA_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_COA_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isGet: true,
                    dataCoa: action.payload.data.result,
                    allCoa: action.payload.data.length,
                    nomCoa: action.payload.data.nomcoa,
                    listGl: action.payload.data.listGl,
                    glLisIn: action.payload.data.glLisIn,
                    alertMsg: 'get coa Succesfully'
                };
            }
            case 'GET_COA_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'DETAIL_COA_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'DETAIL_COA_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isGet: true,
                    detCoa: action.payload.data.result,
                    alertMsg: 'get detail coa Succesfully',
                };
            }
            case 'DETAIL_COA_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'NEXT_DATA_COA_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'NEXT_DATA_COA_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isAll: true,
                    dataAll: action.payload.data.result.rows,
                    alertMsg: 'next data Succesfully',
                    page: action.payload.data.pageInfo
                };
            }
            case 'NEXT_DATA_COA_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isAll: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'UPDATE_COA_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting'
                };
            }
            case 'UPDATE_COA_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isUpdate: true,
                    alertMsg: 'update user Succesfully'
                };
            }
            case 'UPDATE_COA_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: action.payload.response.data.message,
                    alertM: action.payload.response.data.error
                };
            }
            case 'ADD_COA_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'ADD_COA_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isAdd: true,
                    isError: false,
                    alertMsg: 'add user Succesfully'
                };
            }
            case 'ADD_COA_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: action.payload.response.data.message,
                    alertM: action.payload.response.data.error
                };
            }
            case 'UPLOAD_COA_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting....'
                };
            }
            case 'UPLOAD_COA_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isUpload: true,
                    alertMsg: 'upload master Succesfully'
                };
            }
            case 'UPLOAD_COA_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: action.payload.response.data.message,
                    alertUpload: action.payload.response.data.result
                };
            }
            case 'EXPORT_MASTER_COA_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'EXPORT_MASTER_COA_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isExport: true,
                    link: action.payload.data.link,
                    alertMsg: 'success export data'
                };
            }
            case 'EXPORT_MASTER_COA_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: 'Failed export data'
                };
            }
            case 'RESET_COA': {
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