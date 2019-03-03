
/* global describe, beforeEach, expect, it, jest */

import { ClipPath } from '../clippath'

describe('ClipPath', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <img id="test" class="image" src="https://unsplash.it/500/300/?random" alt="Check out unsplash.it">
    `
  })

  it('should export functions', () => {
    expect(typeof ClipPath).toBe('function')
  })

  it('should not call apply', () => {
    const apply = jest.fn()
    ClipPath(undefined, 'path', { _supportPolygon: false, _applyClipPath: apply })
    expect(apply).not.toHaveBeenCalled()
  })

  it('should call apply', () => {
    const apply = jest.fn()
    ClipPath('.image', 'point', { _supportPolygon: false, _applyClipPath: apply })
    expect(apply).toHaveBeenCalled()
  })

  it('should change style on webkit based', () => {
    // mock webkit property
    document.getElementById('test').style.webkitClipPath = {}
    ClipPath('.image', '10px 10px, 20px 20px, 30px 30px')

    expect(document.getElementById('test').style.webkitClipPath).toBe(
      'polygon(10px 10px, 20px 20px, 30px 30px)'
    )
  })

  it('should change style', () => {
    expect(document.getElementById('test').style.clipPath).toBe('')
    ClipPath('.image', '10px 10px, 20px 20px, 30px 30px')
    expect(document.getElementById('test').style.clipPath).toBe(
      'polygon(10px 10px, 20px 20px, 30px 30px)'
    )
  })

  it('should change if does not has support', () => {
    ClipPath('.image', '10px 10px, 20px 20px, 30px 30px', { _supportPolygon: false })
    expect(document.getElementById('test').style.clipPath).toBe('')
    expect(
      document.getElementById('test').style.webkitClipPath
    ).toBeUndefined()
    expect(
      document
        .getElementsByTagNameNS('http://www.w3.org/2000/svg', 'polygon')[0]
        .getAttribute('points')
    ).toBe('10 10, 20 20, 30 30')
  })

})
