import JSZip from 'jszip'
import { join } from 'path'
import Router from 'koa-router'
import bodyparser from 'koa-better-body'
import convert from 'koa-convert'
import formidable from 'formidable'
import filetype from 'file-type'

import {
  memStore,
  WMStrm,
  RMStrm
} from '../utils'

const router = new Router()
let fname = null

const writeToStream = part => {
  fname = part.filename

  const wstream = new WMStrm(fname)

  part.on('data', data => {
    wstream.write(data)
  })

  part.on('end', () => {
    wstream.end()
  })

  // part.on('error', err => {
  // })
}

const formidableOptions = {
  uploadDir : join(__dirname, '../uploads'),
  keepExtensions : true,
  maxFieldsSize : 10 * 1024 * 1024
}

const formy = new formidable.IncomingForm(formidableOptions)
formy.onPart = writeToStream

const body = convert(bodyparser({
  IncomingForm : formy,
  multipart : true,
  urlencoded : true,
  onerror : (err, ctx) => {
    memStore.clrMem()
    fname = null
    ctx.body = `something happened in the backend: ${ err }`
  }
}))

router.prefix('/upload')
router.post('/', body, async ctx => {
  try {
    const rs = new RMStrm(fname)
    const zip = new JSZip()

    const buffer = await zip
      .file(fname, rs)
      .generateAsync({
          type : 'nodebuffer',
          streamFiles : true,
          compression : 'DEFLATE',
          compressionOptions : { level : 9 }
      })

    const { mime } = await filetype(buffer)

    ctx.set('Content-disposition', `attachment; filename=${ fname }.zip`)
    ctx.set('Content-type', mime)
    ctx.body = new RMStrm(buffer)
  } catch (e) {
    ctx.body = `Couldn\'t start download. Error at server... ${ e }`
  }
})

export default router
