var chai = require('chai');
var sinon = require('sinon');
chai.use(require('sinon-chai'));

const { expect } = require('chai');

const { sequelize,
  dataTypes,
  checkModelName,
  checkUniqueIndex,
  checkPropertyExists } = require('sequelize-test-helpers')

const db = require('../../models')
const ProductModel = require('../../models/product')

describe('# Product Model', () => {

  before(done => {
    done()
  })

  const Product = ProductModel(sequelize, dataTypes)
  const product = new Product()
  checkModelName(Product)('Product')

  context('properties', () => {
    ;[
      'name', 'description', 'price'
    ].forEach(checkPropertyExists(product))
  })

  context('action', () => {

    let data = null

    it('create', (done) => {
      db.Product.create({}).then((product) => {
        data = product
        done()
      })
    })
    it('read', (done) => {
      db.Product.findByPk(data.id).then((product) => {
        expect(product.id).to.be.equal(product.id)
        done()
      })
    })
    it('update', (done) => {
      db.Product.update({}, { where: { id: data.id } }).then(() => {
        db.Product.findByPk(data.id).then((product) => {
          expect(data.updatedAt).to.be.not.equal(product.updatedAt)
          done()
        })
      })
    })
    it('delete', (done) => {
      db.Product.destroy({ where: { id: data.id } }).then(() => {
        db.Product.findByPk(data.id).then((product) => {
          expect(product).to.be.equal(null)
          done()
        })
      })
    })
  })
})
