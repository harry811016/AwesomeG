const db = require('../models')
const { Scope } = db

const scopeController = {
  getScopes: (req, res) => {
    return Scope.findAll({
      raw: true,
      nest: true
    }).then(scopes => {
      if (req.params.id) {
        Scope.findByPk(req.params.id)
          .then((scope) => {
            return res.json({ scopes, scope })
          }).catch(error => console.log(error))
      } else {
        return res.json({ scopes })
      }
    }).catch(error => console.log(error))
  },
  postScope: (req, res) => {
    if (!req.body.name) {
      return res.json({ status: 'error', message: "name didn't exist" })
    } else {
      return Scope.create({
        name: req.body.name
      })
        .then((scope) => {
          return res.json({ status: 'success', message: 'Create the scope successfully!' })
        }).catch(error => console.log(error))
    }
  },
  putScope: (req, res) => {
    if (!req.body.name) {
      return res.json({ status: 'error', message: "name didn't exist" })
    } else {
      return Scope.findByPk(req.params.id)
        .then((scope) => {
          scope.update(req.body)
            .then((scope) => {
              return res.json({ status: 'success', message: 'Edit the scope successfully!' })
            }).catch(error => console.log(error))
        }).catch(error => console.log(error))
    }
  },
  deleteScope: (req, res) => {
    return Scope.findByPk(req.params.id)
      .then((scope) => {
        scope.destroy()
          .then((scope) => {
            return res.json({ status: 'success', message: 'Remove the scope successfully!' })
          })
      }).catch(error => console.log(error))
  }
}
module.exports = scopeController