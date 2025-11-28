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
    getKlaim: (token, status, reject, menu, type, category, data, time1, time2, search, depo, limit) => ({
        type: 'GET_KLAIM',
        payload: http(token).patch(`/klaim/get?status=${status}&reject=${reject}&menu=${menu}&type=${type}&category=${category}&data=${data}&time1=${time1}&time2=${time2}&search=${search === undefined ? '' : search}&limit=${limit === undefined ? 100 : limit}&page=1`, data={depo: depo}),
    }),
    getDetail: (token, no) => ({
        type: 'DETAIL_KLAIM',
        payload: http(token).patch(`/klaim/detail`, qs.stringify(no)),
    }),
    getDetailId: (token, id) => ({
        type: 'DETAILID_KLAIM',
        payload: http(token).patch(`/klaim/detailid/${id}`),
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
        payload: http(token).patch(`/klaim/app`, no)
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
    genNomorTransfer: (token) => ({
        type: 'GENERATE_NOPEMB',
        payload: http(token).patch(`/klaim/genbayar`)
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
    getReport: (token, status, reject, menu, time1, time2, type, search) => ({
        type: 'REPORT_KLAIM',
        payload: http(token).get(`/klaim/report?status=${status}&reject=${reject}&menu=${menu}&time1=${time1}&time2=${time2}&type=${type}&search=${search === undefined ? '' : search}`),
    }),
    uploadBuktiBayar: (token, id, data) => ({
        type: 'UPLOAD_BUKTI',
        payload: http(token).post(`/klaim/uplist?id=${id}`, data)
    }),
    submitBuktiBayar: (token, data) => ({
        type: 'SUBMIT_BUKTI',
        payload: http(token).patch(`/klaim/sublistbayar`, qs.stringify(data))
    }),
    getDocBayar: (token,  data) => ({
        type: 'DOC_BUKTI',
        payload: http(token).patch(`/klaim/getdocbayar`, qs.stringify(data))
    }),
    updateNilaiVerif: (token, data) => ({
        type: 'UPDATE_NILAIKLAIM',
        payload: http(token).patch(`/klaim/upniverif`, qs.stringify(data))
    }),
    uploadDataKlaim: (token, data) => ({
        type: 'UPLOAD_KLAIM',
        payload: http(token).post(`/klaim/upload`, data)
    }),
    deleteOutlet: (token, id) => ({
        type: 'DELETE_OUTLET',
        payload: http(token).delete(`/klaim/outlet/del/${id}`)
    }),
    getOutlet: (token, id) => ({
        type: 'GET_OUTLET',
        payload: http(token).get(`/klaim/outlet/get/${id}`)
    }),
    uploadOutlet: (token, data) => ({
        type: 'UPLOAD_OUTLET',
        payload: http(token).patch(`/klaim/outlet/upload`, data)
    }),
    updateOutlet: (token, data) => ({
        type: 'UPDATE_OUTLET',
        payload: http(token).patch(`/klaim/outlet/update`, data)
    }),
    addOutlet: (token, data) => ({
        type: 'ADD_OUTLET',
        payload: http(token).patch(`/klaim/outlet/add`, data)
    }),
    downloadFormVerif: (token, list) => ({
        type: 'DOWNLOAD_FORM_KLAIM',
        payload: http(token).patch(`/klaim/download`, list)
    }),
    deleteFakturKl: (token, id) => ({
        type: 'DELETE_FAKTURKL',
        payload: http(token).delete(`/klaim/faktur/del/${id}`)
    }),
    getFakturKl: (token, id) => ({
        type: 'GET_FAKTURKL',
        payload: http(token).get(`/klaim/faktur/get/${id}`)
    }),
    uploadFakturKl: (token, data) => ({
        type: 'UPLOAD_FAKTURKL',
        payload: http(token).patch(`/klaim/faktur/upload`, data)
    }),
    updateFakturKl: (token, data) => ({
        type: 'UPDATE_FAKTURKL',
        payload: http(token).patch(`/klaim/faktur/update`, data)
    }),
    addFakturKl: (token, data) => ({
        type: 'ADD_FAKTURKL',
        payload: http(token).patch(`/klaim/faktur/add`, data)
    }),
    nextPage: (token, link) => ({
        type: 'NEXT_REPORT_KLAIM',
        payload: http(token).get(`${link}`)
    }),
    nextKlaim: (token, link) => ({
        type: 'NEXT_KLAIM',
        payload: http(token).patch(`${link}`)
    }),
    resetKlaim: () => ({
        type: 'RESET_KLAIM'
    })
}