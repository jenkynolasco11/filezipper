import stream from 'stream'

const Writable = stream.Writable || require('readable-stream').Writable
const Readable = stream.Readable || require('readable-stream').Readable

const memStore = {
  clrMem : () => {
    for(let key in memStore)
      if(key !== 'clrMem') memStore[ key ] = null
  }
}

class WMStrm extends Writable{
  constructor(key, opts) {
    super(opts || {})

    if(!(this instanceof WMStrm)) return new WMStrm(key, opts)

    this.key = key
    memStore[ key ] = new Buffer('')
  }

  _write(chunk, enc, cb) {
    const buffer = (Buffer.isBuffer(chunk))
      ? chunk
      : new Buffer(chunk, enc)

    memStore[ this.key ] = Buffer.concat([memStore[ this.key ], buffer])

    cb() // ? what for?
  }
}

class RMStrm extends Readable{
  constructor(key, opts) {
    super(opts || {})

    if(!(this instanceof RMStrm)) return new RMStrm(key, opts)

    if(key instanceof Buffer) {
      this._object = key
    }

    else this._object = memStore[ key ]
  }

  _read() {
    this.push(this._object)
    this._object = null
  }
}

// const getStream = buffer => {
//   if(!Buffer.isBuffer(buffer))
//     throw new Error('Param has to be a Buffer object')
//
//   const bufferStream = new stream.PassThrough()
//
//   return bufferStream.end(buffer)
// }

export {
  WMStrm,
  RMStrm,
  memStore,
  // getStream
}
