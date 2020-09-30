const assert = require('assert')
const bcrypt = require('bcryptjs')
const fetch = require('node-fetch')
const HOST = process.env.HOST || 'http://localhost'
const INTERNAL_PORT = 3000
const db = require('../../models')
const { User, Subject } = db

describe('# Subject Request', () => {
  let token = ''     // for saving sign in token
  const testAdmin = {
    name: 'test',
    email: 'test@example.com',
    password: 'test',
    role: 'admin'
  }
  before(async () => {
    await User.destroy({ where: {}, truncate: true })
    await Subject.destroy({ where: {}, truncate: true })
    // create a test user
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(testAdmin.password, salt)
    await User.create({
      name: testAdmin.name,
      email: testAdmin.email,
      password: hash,
      role: testAdmin.role
    })
    // sign in as test user   
    await fetch(`${HOST}:${INTERNAL_PORT}/api/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testAdmin.email,
        password: testAdmin.password
      })
    })
      .then(res => res.json())
      .then(res => {
        token = res.token
      })
  })

  it('POST /api/admin/subjects', async () => {
    await fetch(`${HOST}:${INTERNAL_PORT}/api/admin/subjects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      body: JSON.stringify({ name: 'test' })
    })
      .then(res => {
        assert.strictEqual(res.status, 200)
        return res.json()
      })
      .then(res => {
        assert.strictEqual(res.message, 'Create the subject successfully!')
      })
  })

  it('GET /api/subjects', async () => {
    await fetch(`${HOST}:${INTERNAL_PORT}/api/subjects`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      }
    })
      .then(res => {
        assert.strictEqual(res.status, 200)
        return res.json()
      }).then(res => {
        assert.strictEqual(res.subjects[0].name, 'test')
      })
  })

  it('PUT /api/admin/subjects/:id', async () => {
    await fetch(`${HOST}:${INTERNAL_PORT}/api/admin/subjects/${1}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      body: JSON.stringify({ name: 'puttest' })
    })
      .then(res => {
        assert.strictEqual(res.status, 200)
        return res.json()
      })
      .then(res => {
        assert.strictEqual(res.message, 'Edit the subject successfully!')
      })
  })

  it('GET /api/admin/subjects/:id', async () => {
    await fetch(`${HOST}:${INTERNAL_PORT}/api/admin/subjects/${1}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      }
    })
      .then(res => {
        assert.strictEqual(res.status, 200)
        return res.json()
      }).then(res => {
        assert.strictEqual(res.subject.name, 'puttest')
      })
  })

  it('DELETE /api/admin/subjects/:id', async () => {
    await fetch(`${HOST}:${INTERNAL_PORT}/api/admin/subjects/${1}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
    })
      .then(res => {
        assert.strictEqual(res.status, 200)
        return res.json()
      })
      .then(res => {
        assert.strictEqual(res.message, 'Remove the subject successfully!')
      })
  })

  after(async () => {
    // remove the test user
    await User.destroy({ where: {}, truncate: true })
    await Subject.destroy({ where: {}, truncate: true })
  })
})
