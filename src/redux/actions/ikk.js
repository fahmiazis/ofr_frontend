/* eslint-disable import/no-anonymous-default-export */
import http from '../../helpers/http'
import qs from 'qs'

export default {
    addCart: (token, data) => ({
        type: 'ADD_CART',
        payload: http(token).post(`/ikk/add`, qs.stringify(data))
    }),
    deleteCart: (token, id) => ({
        type: 'DELETE_CART',
        payload: http(token).delete(`/ikk/del/${id}`)
    }),
    getCart: (token) => ({
        type: 'GET_CART',
        payload: http(token).get(`/ikk/cart`),
    }),
    getDocCart: (token, no) => ({
        type: 'GET_DOC',
        payload: http(token).patch(`/ikk/doc`, qs.stringify(no)),
    }),
    getDocDraft: (token, name) => ({
        type: 'GET_DOCDRAFT',
        payload: http(token).patch(`/ikk/docdraft/${name}`),
    }),
    UploadDocCart: (token, no, id, data) => ({
        type: 'UPLOAD_DOC',
        payload: http(token).post(`/ikk/updoc?no=${no}&id=${id}`, data)
    }),
    submitIkk: (token) => ({
        type: 'SUBMIT_IKK',
        payload: http(token).patch(`/ikk/submit`)
    }),
    submitIkkFinal: (token, no) => ({
        type: 'SUBMIT_IKKFINAL',
        payload: http(token).patch(`/ikk/subfinklaim`, qs.stringify(no))
    }),
    getIkk: (token, status, reject, menu, type, category, data) => ({
        type: 'GET_IKK',
        payload: http(token).get(`/ikk/get?status=${status}&reject=${reject}&menu=${menu}&type=${type}&category=${category}&data=${data}`),
    }),
    getDetail: (token, no) => ({
        type: 'DETAIL_IKK',
        payload: http(token).patch(`/ikk/detail`, qs.stringify(no)),
    }),
    getApproval: (token, no) => ({
        type: 'TTD_IKK',
        payload: http(token).patch(`/ikk/ttd`, qs.stringify(no))
    }),
    getApprovalList: (token, no) => ({
        type: 'TTDLIST_IKK',
        payload: http(token).patch(`/ikk/ttdlist`, qs.stringify(no))
    }),
    approveIkk: (token, no) => ({
        type: 'APPROVE_IKK',
        payload: http(token).patch(`/ikk/app`, qs.stringify(no))
    }),
    rejectIkk: (token, data) => ({
        type: 'REJECT_IKK',
        payload: http(token).patch(`/ikk/reject`, data)
    }),
    appRevisi: (token, no) => ({
        type: 'APP_REVISI',
        payload: http(token).patch(`/ikk/apprev`, qs.stringify(no))
    }),
    editIkk: (token, id, data) => ({
        type: 'EDIT_IKK',
        payload: http(token).patch(`/ikk/update/${id}`, qs.stringify(data))
    }),
    editVerif: (token, id, data) => ({
        type: 'EDIT_VERIF',
        payload: http(token).patch(`/ikk/editvrf/${id}`, qs.stringify(data))
    }),
    submitRevisi: (token, data) => ({
        type: 'SUBMIT_REVISI',
        payload: http(token).patch(`/ikk/subrev`, qs.stringify(data))
    }),
    submitVerif: (token, data) => ({
        type: 'SUBMIT_VERIF',
        payload: http(token).patch(`/ikk/verif`, qs.stringify(data))
    }),
    submitAjuanBayar: (token, data) => ({
        type: 'SUBMIT_BAYAR',
        payload: http(token).patch(`/ikk/subbayar`, data)
    }),
    approveListIkk: (token, no) => ({
        type: 'APPROVELIST_IKK',
        payload: http(token).patch(`/ikk/applist`, qs.stringify(no))
    }),
    rejectListIkk: (token, data) => ({
        type: 'REJECTLIST_IKK',
        payload: http(token).patch(`/ikk/rejectlist`, data)
    }),
    resetIkk: () => ({
        type: 'RESET_IKK'
    })
}