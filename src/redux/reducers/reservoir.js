/* eslint-disable import/no-anonymous-default-export */
const kppState = {
    isGenTrans: null,
    isGenTransDetail: false,
    isGenPemb: null,
    isGet: false,
    isDelete: false,
    isLoading: false,
    isError: false,
    alertMsg: '',
    dataReservoir: [],
    dataName: [],
    alertM: '',
    alertUpload: [],
    page: {},
    isExport: false,
    detReservoir: {},
    link: '',
    dataAll: [],
    isAll: false,
    isUpload: false
};

export default (state=kppState, action) => {
        switch(action.type){
            case 'GET_ALL_RESERVOIR_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_ALL_RESERVOIR_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isAll: true,
                    dataAll: action.payload.data.result.rows,
                    alertMsg: 'get bank Succesfully',
                    page: action.payload.data.pageInfo
                };
            }
            case 'GET_ALL_RESERVOIR_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: "Failed get data bank"
                };
            }
            case 'GET_RESERVOIR_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_RESERVOIR_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isGet: true,
                    dataReservoir: action.payload.data.result,
                    alertMsg: 'get bank Succesfully'
                };
            }
            case 'GET_RESERVOIR_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'DETAIL_RESERVOIR_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'DETAIL_RESERVOIR_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isGet: true,
                    detReservoir: action.payload.data.result,
                    alertMsg: 'get detail bank Succesfully',
                };
            }
            case 'DETAIL_RESERVOIR_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'NEXT_DATA_RESERVOIR_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'NEXT_DATA_RESERVOIR_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isAll: true,
                    dataAll: action.payload.data.result.rows,
                    alertMsg: 'next data Succesfully',
                    page: action.payload.data.pageInfo
                };
            }
            case 'NEXT_DATA_RESERVOIR_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isAll: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'GENPEMB_RESERVOIR_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting'
                };
            }
            case 'GENPEMB_RESERVOIR_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isGenPemb: true,
                    alertMsg: 'update reservoir Succesfully'
                };
            }
            case 'GENPEMB_RESERVOIR_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    isGenPemb: false,
                    alertMsg: action.payload.response.data.message,
                    alertM: action.payload.response.data.error
                };
            }
            case 'GENTRANS_RESERVOIR_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GENTRANS_RESERVOIR_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isGenTrans: true,
                    alertMsg: 'add reservoir Succesfully'
                };
            }
            case 'GENTRANS_RESERVOIR_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    isGenTrans: false,
                    alertMsg: action.payload.response.data.message,
                    alertM: action.payload.response.data.error
                };
            }
            case 'RESET_RESERVOIR': {
                return {
                    ...state,
                    isError: false,
                    isGenPemb: null,
                    isGenTrans: null,
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