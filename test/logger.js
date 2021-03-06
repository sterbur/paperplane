const { expect } = require('chai')

const { logger } = require('..')

describe('logger', () => {
  let output

  const message = {
    foo: 'bar',
    req: {
      body: 'not included',
      headers: {
        'content-type': 'application/json'
      },
      method: 'POST',
      url: '/users'
    },
    res: {
      body: 'not included',
      statusCode: 201
    }
  }

  describe('when logging requests', () => {
    beforeEach(() => {
      logger(message)
      output = JSON.parse(console.info.calls[0][0])
    })

    it('includes request headers', () => {
      expect(output.req.headers).to.be.an('object')
      expect(output.req.headers['content-type']).to.equal(message.req.headers['content-type'])
    })

    it('includes request method', () =>
      expect(output.req.method).to.equal(message.req.method)
    )

    it('includes request url', () =>
      expect(output.req.url).to.equal(message.req.url)
    )

    it('omits other request properties', () =>
      expect(output.req.body).to.be.undefined
    )

    it('includes response statusCode', () =>
      expect(output.res.statusCode).to.equal(message.res.statusCode)
    )

    it('omits other response properties', () =>
      expect(output.res.body).to.be.undefined
    )

    it('passes thru other message properties unchanged', () =>
      expect(output.foo).to.equal('bar')
    )

    it('logs to console.info', () =>
      expect(console.info.calls.length).to.equal(1)
    )
  })

  describe('when used as the cry', () => {
    beforeEach(() => {
      const err = new Error('message')
      err.extraData = { foo: 'bar' }
      logger(err)
      output = JSON.parse(console.info.calls[0][0])
    })

    it('includes the error message', () =>
      expect(output.message).to.equal('message')
    )

    it('includes the error name', () =>
      expect(output.name).to.equal('Error')
    )

    it('includes the error stack', () =>
      expect(output.stack).to.exist
    )

    it('includes any extra data attached to the error', () =>
      expect(output.extraData).to.eql({ foo: 'bar' })
    )
  })
})
