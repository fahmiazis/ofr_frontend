/* eslint-disable import/no-anonymous-default-export */
import http from '../../helpers/http'
import qs from 'qs'

export default {
    addCart: (token, data, id) => ({
        type: 'ADD_CART',
        payload: http(token).post(`/ikk/add/${id}`, qs.stringify(data))
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
    uploadDocCart: (token, no, id, data) => ({
        type: 'UPLOAD_DOC',
        payload: http(token).post(`/ikk/updoc?no=${no}&id=${id}`, data)
    }),
    submitIkk: (token, data) => ({
        type: 'SUBMIT_IKK',
        payload: http(token).patch(`/ikk/submit`, data)
    }),
    submitIkkFinal: (token, no) => ({
        type: 'SUBMIT_IKKFINAL',
        payload: http(token).patch(`/ikk/subfinikk`, qs.stringify(no))
    }),
    getIkk: (token, status, reject, menu, type, category, data, time1, time2, search) => ({
        type: 'GET_IKK',
        payload: http(token).get(`/ikk/get?status=${status}&reject=${reject}&menu=${menu}&type=${type}&category=${category}&data=${data}&time1=${time1}&time2=${time2}&search=${search === undefined ? '' : search}`),
    }),
    getDetail: (token, no) => ({
        type: 'DETAIL_IKK',
        payload: http(token).patch(`/ikk/detail`, qs.stringify(no)),
    }),
    getDetailId: (token, id) => ({
        type: 'DETAILID_IKK',
        payload: http(token).patch(`/ikk/detailid/${id}`),
    }),
    getDetailReport: (token, data) => ({
        type: 'DETAIL_REPORT',
        payload: http(token).patch(`/ikk/detrep`, data),
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
    editIkk: (token, id, idtrans, data) => ({
        type: 'EDIT_IKK',
        payload: http(token).patch(`/ikk/update/${id}/${idtrans}`, qs.stringify(data))
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
        payload: http(token).patch(`/ikk/verif`, data)
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
    getReport: (token, status, reject, menu, time1, time2, type, search) => ({
        type: 'REPORT_IKK',
        payload: http(token).get(`/ikk/report?status=${status}&reject=${reject}&menu=${menu}&time1=${time1}&time2=${time2}&type=${type}&search=${search === undefined ? '' : search}`),
    }),
    confirmNewIdent: (token, id) => ({
        type: 'CONFIRM_IDENTIKK',
        payload: http(token).patch(`/ikk/confident/${id}`)
    }),
    uploadBuktiBayar: (token, id, data) => ({
        type: 'UPLOAD_BUKTIIKK',
        payload: http(token).post(`/ikk/uplist?id=${id}`, data)
    }),
    submitBuktiBayar: (token, data) => ({
        type: 'SUBMIT_BUKTIIKK',
        payload: http(token).patch(`/ikk/sublistbayar`, qs.stringify(data))
    }),
    getDocBayar: (token,  data) => ({
        type: 'DOC_BUKTIIKK',
        payload: http(token).patch(`/ikk/getdocbayar`, qs.stringify(data))
    }),
    updateNilaiVerif: (token, data) => ({
        type: 'UPDATE_NILAIIKK',
        payload: http(token).patch(`/ikk/upniverif`, qs.stringify(data))
    }),
    resetIkk: () => ({
        type: 'RESET_IKK'
    })
}