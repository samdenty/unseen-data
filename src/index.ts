import { b4decode, b4encode } from 'base4'
import * as CircularJSON from 'circular-json'
import * as pako from 'pako'

export type Charset = [string, string, string, string]
export const defaultCharset: Charset = ['\u200B', '\u200C', '\u200D', '\uFEFF']

interface IUnseen {
  compression?: boolean
  charset?: Charset
}

class Unseen {
  private compression: boolean
  private charset: Charset

  constructor({ compression = true, charset = defaultCharset }: IUnseen = {}) {
    this.compression = compression
    this.charset = charset
  }

  /**
   * Encodes data and returns the resulting base4 string
   * @param input The input data to encode
   */
  public encode(input) {
    const serialized = CircularJSON.stringify(input)

    const deflated = this.compression
      ? encodeURIComponent(pako.deflate(serialized, { to: 'string' }))
      : serialized

    const shouldCompress = deflated.length < serialized.length
    const raw = `${+shouldCompress}${shouldCompress ? deflated : serialized}`

    const output = new String(this.b4encode(raw)) as String & { compressed: boolean }
    output.compressed = shouldCompress

    return output
  }

  /**
   * Decodes base4 and returns the original data
   * @param input The input data to decode
   */
  public decode(input) {
    const raw = this.b4decode(input)

    const isCompressed = !!+raw[0]
    const data = raw.substring(1)

    const serialized = isCompressed
      ? pako.inflate(decodeURIComponent(data), { to: 'string' })
      : data

    const output = CircularJSON.parse(serialized)

    return output
  }

  /**
   * Base4 encodes a string with the current charset
   */
  private b4encode(data: string) {
    let output = b4encode(data)
    this.charset.forEach(
      (char, i) => (output = output.split(`${i}`).join(char))
    )

    return output
  }

  /**
   * Base4 decodes a string with the current charset
   */
  private b4decode(data: string) {
    let output = data
    this.charset.forEach(
      (char, i) => (output = output.split(char).join(`${i}`))
    )

    return b4decode(output)
  }
}

export default Unseen
