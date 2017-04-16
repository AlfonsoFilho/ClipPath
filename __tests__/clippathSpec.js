
const ClipPath = require('./../src/clippath').ClipPath;

describe('ClipPath', function() {

  beforeEach(function() {
    document.body.innerHTML = `
      <img id="test" class="image" src="https://unsplash.it/500/300/?random" alt="Check out unsplash.it">
    `
  })

  it('should export functions', function() {
    expect(typeof ClipPath).toBe('function');
    expect(typeof ClipPath.applyClipPath).toBe('function');
  })

  it('shuld change style on webkit based', function() {
    // mock webkit property
    document.getElementById('test').style.webkitClipPath = {};
    ClipPath('.image', '10px 10px, 20px 20px, 30px 30px');
    expect(document.getElementById('test').style.webkitClipPath).toBe('polygon(10px 10px, 20px 20px, 30px 30px)')
  })

  it('shuld change style', function() {
    ClipPath('.image', '10px 10px, 20px 20px, 30px 30px');
    expect(document.getElementById('test').style.clipPath).toBe('polygon(10px 10px, 20px 20px, 30px 30px)')
  })

  it('shuld change if does not has support', function() {
    ClipPath('.image', '10px 10px, 20px 20px, 30px 30px', false);
    expect(document.getElementById('test').style.clipPath).toBeUndefined()
    expect(document.getElementById('test').style.webkitClipPath).toBeUndefined()
    expect(document.getElementsByTagNameNS('http://www.w3.org/2000/svg', 'polygon')[0].getAttribute('points')).toBe('10 10, 20 20, 30 30')
  })
})