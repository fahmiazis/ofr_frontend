/* eslint-disable import/no-anonymous-default-export */
const userState = {
    isAdd: false,
    isUpload: false,
    isUpdate: null,
    isGet: false,
    isGetRole: false,
    isDetail: false,
    isDelete: false,
    token: '',
    isLoading: false,
    isError: false,
    alertMsg: '',
    dataUser: [],
    dataRole: [],
    detailUser: {},
    detailRole: {},
    alertM: '',
    alertUpload: [],
    page: {},
    isExport: false,
    link: '',
    isChange: null,
    isReset: false,
    isUpimage: null,
    genUser: null,
    addRole: null,
    updateRole: null,
    isDetailRole: null,
    accKlaim: ['3', '13', '23'],
    accFinance: ['2', '7', '8', '9', '17'],
    accTax: ['4', '14', '24', '34']
}

export default (state=userState, action) => {
        switch(action.type){
            case 'EXPORT_MASTER_USER_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'EXPORT_MASTER_USER_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    isExport: true,
                    link: action.payload.data.link,
                    alertMsg: 'success export data'
                };
            }
            case 'EXPORT_MASTER_USER_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isExport: false,
                    isError: true,
                    alertMsg: 'Failed export data'
                };
            }
            case 'ADD_USER_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'ADD_USER_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isAdd: true,
                    isError: false,
                    alertMsg: 'add user Succesfully'
                };
            }
            case 'ADD_USER_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isAdd: false,
                    isError: true,
                    alertMsg: action.payload.response.data.message,
                    alertM: action.payload.response.data.error
                };
            }
            case 'ADD_ROLE_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'ADD_ROLE_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    addRole: true,
                    alertMsg: 'add role Succesfully'
                };
            }
            case 'ADD_ROLE_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    addRole: false,
                    alertMsg: 'add role failed'

                };
            }
            case 'UPLOAD_IMAGE_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'UPLOAD_IMAGE_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isUpimage: true,
                    alertMsg: 'add user Succesfully'
                };
            }
            case 'UPLOAD_IMAGE_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isUpimage: false,
                    alertMsg: action.payload.response.data.message,
                    alertM: action.payload.response.data.error
                };
            }
            case 'GET_USER_PENDING': {
                return {
                    ...state,
                    isGet: false,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_USER_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    isGet: true,
                    dataUser: action.payload.data.result.rows,
                    alertMsg: 'get user Succesfully',
                    page: action.payload.data.pageInfo
                };
            }
            case 'GET_USER_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isGet: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'GET_ROLE_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_ROLE_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    isGetRole: true,
                    dataRole: action.payload.data.result,
                    alertMsg: 'get user Succesfully',
                };
            }
            case 'GET_ROLE_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'NEXT_DATA_USER_PENDING': {
                return {
                    ...state,
                    isGet: false,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'NEXT_DATA_USER_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    isGet: true,
                    dataUser: action.payload.data.result.rows,
                    alertMsg: 'add user Succesfully',
                    page: action.payload.data.pageInfo
                };
            }
            case 'NEXT_DATA_USER_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isAdd: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'GET_DETAIL_USER_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    isDetail: false,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_DETAIL_USER_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    isDetail: true,
                    detailUser: action.payload.data.result,
                    alertMsg: 'get detail user Succesfully'
                };
            }
            case 'GET_DETAIL_USER_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isDetail: false,
                    isError: true,
                    alertMsg: action.payload.response !== undefined ? action.payload.response.data.message : 'something went wrong',
                    alert: action.payload.response !== undefined ? action.payload.response.data.error : 'something went wrong'
                };
            }
            case 'GET_DETAIL_ROLE_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_DETAIL_ROLE_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    isDetailRole: true,
                    detailRole: action.payload.data.result,
                    alertMsg: 'get detail user Succesfully'
                };
            }
            case 'GET_DETAIL_ROLE_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isDetailRole: false
                };
            }
            case 'UPDATE_USER_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting'
                };
            }
            case 'UPDATE_USER_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isUpdate: true,
                    isError: false,
                    alertMsg: 'update user Succesfully'
                };
            }
            case 'UPDATE_USER_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isUpdate: false,
                    isError: true,
                    alertMsg: action.payload.response.data.message,
                    alertM: action.payload.response.data.error
                };
            }
            case 'UPDATE_ROLE_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting'
                };
            }
            case 'UPDATE_ROLE_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isUpdateRole: true,
                    alertMsg: 'update role Succesfully'
                };
            }
            case 'UPDATE_ROLE_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isUpdateRole: false,
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
            case 'CHANGE_PW_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'CHANGE_PW_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isChange: true,
                    alertMsg: 'change pw succesfully'
                };
            }
            case 'CHANGE_PW_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isChange: false,
                    alertMsg: 'unable connect to server',
                };
            }
            case 'RESET_PW_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'RESET_PW_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isReset: true,
                    alertMsg: 'reset pw succesfully'
                };
            }
            case 'RESET_PW_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: 'unable connect to server',
                };
            }
            case 'GENERATE_USER_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GENERATE_USER_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    genUser: true,
                    alertMsg: 'reset pw succesfully'
                };
            }
            case 'GENERATE_USER_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    genUser: false,
                    alertMsg: 'unable connect to server',
                };
            }
            case 'RESET': {
                return {
                    ...state,
                    isError: false,
                    isUpload: false,
                    isExport: false,
                    isUpdate: null,
                    isChange: null,
                    isReset: false,
                    isUpimage: null,
                    genUser: null,
                    isUpdateRole: null,
                    addRole: null,
                    isDetailRole: null
                }
            }
            // case 'USERS_LOADED': {
            //     return {
            //         loadedAt: moment(),
            //         users: payload
            //     }
            // }
            default: {
                return state;
            }
        }
    }