const db = require('../models')
const { Question, Status, Subject, Scope, Answer } = db

const questionController = {
  getQuestions: (req, res) => {
    Question.findAll(({ include: [Subject, Scope] })).then(questions => {
      Subject.findAll({
        raw: true,
        nest: true
      }).then(subjects => {
        Scope.findAll({
          raw: true,
          nest: true
        }).then(scopes => {
          return res.json({
            questions,
            subjects,
            scopes,
          })
        })
      })
    })
  },
  getMyQuestions: (req, res) => {
    Question.findAll(({ where: { UserId: req.user.id } }, { include: [Status, Answer] })).then(questions => {
      return res.json({
        questions,
      })
    })
  },
  postQuestion: (req, res) => {
    return Question.create({
      SubjectId: req.body.subjectId,
      ScopeId: req.body.scopeId,
      UserId: req.user.id,
      image: 'test image',
      description: req.body.description,
      StatusId: 1,
    }).then((question) => {
      return res.json({ status: 'success', message: '成功提問！' })
    })
  },
}
module.exports = questionController