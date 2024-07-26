/* eslint-disable import/no-anonymous-default-export */
const shelfakturState = {
    isAdd: false,
    isAddDetail: false,
    isUpdate: false,
    isGet: null,
    isDelete: false,
    isLoading: false,
    isError: false,
    alertMsg: '',
    dataFaktur: [],
    dataName: [],
    alertM: '',
    alertUpload: [],
    page: {},
    isExport: false,
    detFaktur: {},
    link: '',
    dataAll: [],
    isAll: false,
    isUpload: false,
    allFaktur: [],
    dataFalse: undefined
};

export default (state=shelfakturState, action) => {
        switch(action.type){
            case 'GET_SHELFAKTUR_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_SHELFAKTUR_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isAll: true,
                    dataAll: action.payload.data.result.rows,
                    alertMsg: 'get faktur Succesfully',
                    page: action.payload.data.pageInfo
                };
            }
            case 'GET_SHELFAKTUR_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    alertMsg: "Failed get data faktur"
                };
            }
            case 'SYNC_FAKTUR_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'SYNC_FAKTUR_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isGet: true,
                    alertMsg: 'get detail faktur Succesfully',
                };
            }
            case 'SYNC_FAKTUR_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isGet: false,
                    // dataFalse: action.payload.response.data,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'NEXT_DATA_SHELFAKTUR_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'NEXT_DATA_SHELFAKTUR_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isAll: true,
                    dataAll: action.payload.data.result.rows,
                    alertMsg: 'next data Succesfully',
                    page: action.payload.data.pageInfo
                };
            }
            case 'NEXT_DATA_SHELFAKTUR_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isAll: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'RESET_SHELFAKTUR': {
                return {
                    ...state,
                    isError: false,
                    isUpdate: false,
                    isAdd: false,
                    isDelete: false,
                    isGet: null,
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