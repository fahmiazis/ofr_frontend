/* eslint-disable import/no-anonymous-default-export */
import http from '../../helpers/http'
import qs from 'qs'

export default {
    addCart: (token, data) => ({
        type: 'ADD_CART',
        payload: http(token).post(`/klaim/add`, qs.stringify(data))
    }),
    deleteCart: (token, id) => ({
        type: 'DELETE_CART',
        payload: http(token).delete(`/klaim/del/${id}`)
    }),
    getCart: (token) => ({
        type: 'GET_CART',
        payload: http(token).get(`/klaim/cart`),
    }),
    getDocCart: (token, no) => ({
        type: 'GET_DOC',
        payload: http(token).patch(`/klaim/doc`, qs.stringify(no)),
    }),
    getDocDraft: (token, name) => ({
        type: 'GET_DOCDRAFT',
        payload: http(token).patch(`/klaim/docdraft/${name}`),
    }),
    UploadDocCart: (token, no, id, data) => ({
        type: 'UPLOAD_DOC',
        payload: http(token).post(`/klaim/updoc?no=${no}&id=${id}`, data)
    }),
    submitKlaim: (token) => ({
        type: 'SUBMIT_KLAIM',
        payload: http(token).patch(`/klaim/submit`)
    }),
    submitKlaimFinal: (token, no) => ({
        type: 'SUBMIT_KLAIMFINAL',
        payload: http(token).patch(`/klaim/subfinklaim`, qs.stringify(no))
    }),
    getKlaim: (token, status, reject, menu, type, category, data) => ({
        type: 'GET_KLAIM',
        payload: http(token).get(`/klaim/get?status=${status}&reject=${reject}&menu=${menu}&type=${type}&category=${category}&data=${data}`),
    }),
    getDetail: (token, no) => ({
        type: 'DETAIL_KLAIM',
        payload: http(token).patch(`/klaim/detail`, qs.stringify(no)),
    }),
    getApproval: (token, no) => ({
        type: 'TTD_KLAIM',
        payload: http(token).patch(`/klaim/ttd`, qs.stringify(no))
    }),
    getApprovalList: (token, no) => ({
        type: 'TTDLIST_KLAIM',
        payload: http(token).patch(`/klaim/ttdlist`, qs.stringify(no))
    }),
    approveKlaim: (token, no) => ({
        type: 'APPROVE_KLAIM',
        payload: http(token).patch(`/klaim/app`, qs.stringify(no))
    }),
    rejectKlaim: (token, data) => ({
        type: 'REJECT_KLAIM',
        payload: http(token).patch(`/klaim/reject`, data)
    }),
    appRevisi: (token, no) => ({
        type: 'APP_REVISI',
        payload: http(token).patch(`/klaim/apprev`, qs.stringify(no))
    }),
    editKlaim: (token, id, data) => ({
        type: 'EDIT_KLAIM',
        payload: http(token).patch(`/klaim/update/${id}`, qs.stringify(data))
    }),
    editVerif: (token, id, data) => ({
        type: 'EDIT_VERIF',
        payload: http(token).patch(`/klaim/editvrf/${id}`, qs.stringify(data))
    }),
    submitRevisi: (token, data) => ({
        type: 'SUBMIT_REVISI',
        payload: http(token).patch(`/klaim/subrev`, qs.stringify(data))
    }),
    submitVerif: (token, data) => ({
        type: 'SUBMIT_VERIF',
        payload: http(token).patch(`/klaim/verif`, qs.stringify(data))
    }),
    submitAjuanBayar: (token, data) => ({
        type: 'SUBMIT_BAYAR',
        payload: http(token).patch(`/klaim/subbayar`, data)
    }),
    approveListKlaim: (token, no) => ({
        type: 'APPROVELIST_KLAIM',
        payload: http(token).patch(`/klaim/applist`, qs.stringify(no))
    }),
    rejectListKlaim: (token, data) => ({
        type: 'REJECTLIST_KLAIM',
        payload: http(token).patch(`/klaim/rejectlist`, data)
    }),
    getReport: (token, status, reject, menu) => ({
        type: 'REPORT_KLAIM',
        payload: http(token).get(`/klaim/report?status=${status}&reject=${reject}&menu=${menu}`),
    }),
    resetKlaim: () => ({
        type: 'RESET_KLAIM'
    })
}