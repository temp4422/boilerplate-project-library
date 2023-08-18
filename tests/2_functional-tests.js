/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *
 */

const chaiHttp = require('chai-http')
const chai = require('chai')
const assert = chai.assert
const server = require('../server')

chai.use(chaiHttp)

suite('Functional Tests', function () {
  /*
   * ----[EXAMPLE TEST]----
   * Each test should completely test the response of the API end-point including response status code!
   */
  test('#example Test GET /api/books', (done) => {
    chai
      .request(server)
      .get('/api/books')
      .end((err, res) => {
        assert.equal(res.status, 200)
        assert.isArray(res.body, 'response should be an array')
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount')
        assert.property(res.body[0], 'title', 'Books in array should contain title')
        assert.property(res.body[0], '_id', 'Books in array should contain _id')
        done()
      })
  })
  /*
   * ----[END of EXAMPLE TEST]----
   */

  suite('Routing tests', () => {
    suite('POST /api/books with title => create book object/expect book object', () => {
      test('Test POST /api/books with title', (done) => {
        chai
          .request(server)
          .post('/api/books')
          .send({ title: 'titleX' })
          .end((err, res) => {
            assert.equal(res.status, 200)
            assert.property(res.body, '_id', 'Books in array should contain _id')
            assert.property(res.body, 'title', 'Books in array should contain title')
          })
        done()
      })

      test('Test POST /api/books with no title given', (done) => {
        chai
          .request(server)
          .post('/api/books')
          .send({ title: '' })
          .end((err, res) => {
            assert.equal(res.status, 200)
            assert.equal(res.body, 'missing required field title')
          })
        done()
      })
    })

    suite('GET /api/books => array of books', () => {
      test('Test GET /api/books', (done) => {
        chai
          .request(server)
          .get('/api/books')
          .end((err, res) => {
            assert.equal(res.status, 200)
            assert.isArray(res.body)
          })
        done()
      })
    })

    suite('GET /api/books/[id] => book object with [id]', () => {
      test('Test GET /api/books/[id] with id not in db', (done) => {
        chai
          .request(server)
          .get('/api/books/64df76ed4b3543f51c50XXXX')
          .end((err, res) => {
            assert.equal(res.status, 200)
            assert.equal(res.body, 'no book exists')
          })
        done()
      })

      test('Test GET /api/books/[id] with valid id in db', (done) => {
        chai
          .request(server)
          .get('/api/books/64df76ed4b3543f51c50e548')
          .end((err, res) => {
            assert.equal(res.status, 200)
            assert.isObject(res.body)
          })
        done()
      })
    })

    suite('POST /api/books/[id] => add comment/expect book object with id', () => {
      test('Test POST /api/books/[id] with comment', (done) => {
        chai
          .request(server)
          .post('/api/books/64df76ed4b3543f51c50e548')
          .send({ comment: 'test' })
          .end((err, res) => {
            assert.equal(res.status, 200)
            assert.isObject(res.body)
          })
        done()
      })

      test('Test POST /api/books/[id] without comment field', (done) => {
        chai
          .request(server)
          .post('/api/books/64df76ed4b3543f51c50e548')
          .send({ comment: '' })
          .end((err, res) => {
            assert.equal(res.status, 200)
            assert.equal(res.body, 'missing required field comment')
          })
        done()
      })

      test('Test POST /api/books/[id] with comment, id not in db', (done) => {
        chai
          .request(server)
          .post('/api/books/64df76ed4b3543f51c50e548_XXXXXX')
          .send({ comment: 'test' })
          .end((err, res) => {
            assert.equal(res.status, 200)
            assert.equal(res.body, 'no book exists')
          })
        done()
      })
    })

    suite('DELETE /api/books/[id] => delete book object id', () => {
      test('Test DELETE /api/books/[id] with valid id in db', (done) => {
        chai
          .request(server)
          .delete('/api/books/64df78981c1410ee92d3f600')
          .end((err, res) => {
            assert.equal(res.status, 200)
            // assert.equal(res.body, 'delete successful')
          })
        done()
      })
      test('Test DELETE /api/books/[id] with  id not in db', (done) => {
        chai
          .request(server)
          .delete('/api/books/64df76ed4b3543f51c50e548_XXXXX')
          .end((err, res) => {
            assert.equal(res.status, 200)
            assert.equal(res.body, 'no book exists')
          })
        done()
      })
    })
  })
})
