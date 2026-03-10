import React, { useState, useEffect } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import axios from "axios"
import http from '../helpers/http'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

const filePict = ['png', 'jpg', 'jpeg', 'bmp']

export default function AllPages(props) {
  const [numPages, setNumPages] = useState(null)
  const [blobUrl, setBlobUrl] = useState(null)
  const [loading, setLoading] = useState(true)

  const { pdf, dataFile } = props
  const genData = dataFile === undefined ? 'file.pdf' : dataFile.path.split('/')
  const cekDoc = genData[2].split('.')
  const ext = cekDoc[cekDoc.length - 1]
  const isImage = filePict.find(item => item === ext) !== undefined

  useEffect(() => {
    const fetchFile = async () => {
      try {
        setLoading(true)

        const res = await (isImage
          ? http().get(dataFile.path, { responseType: 'blob' })
          : axios.get(pdf, {
              responseType: 'blob',
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
              }
            })
        )

        const url = URL.createObjectURL(res.data)
        setBlobUrl(url)
      } catch (err) {
        console.log('ERROR FETCH FILE:', err)
      } finally {
        setLoading(false)
      }
    }

    if (dataFile) fetchFile()

    return () => {
      if (blobUrl) URL.revokeObjectURL(blobUrl)
    }
  }, [dataFile, pdf])

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages)
  }

  if (loading) return <div>Loading...</div>
  if (!blobUrl) return <div>File tidak ditemukan</div>

  return (
    isImage ?
      <div>
        <img className="imgPdf" src={blobUrl} alt="document" />
      </div>
    : ext === 'pdf' ?
      <div id="wrap">
        <iframe id="scaled-frame" src={blobUrl} className='pdfDiv' />
      </div>
    : 'File cannot show, please download this file'
  )
}