'use strict';
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const mongoose = require('mongoose');
const transaction = require('.');

chai.should();
chai.use(chaiAsPromised);

describe('Transaction Helper', function () {
  beforeEach(function () {
    this.session = {
      endSession: sinon.stub(),
      withTransaction: sinon.stub().callsFake(async fn => {
        await fn();
      }),
    };

    sinon.stub(mongoose, 'startSession').resolves(this.session);
  });

  afterEach(function () {
    sinon.restore();
  });

  it('should call the transaction function with the session as argument', async function () {
    const fn = sinon.stub().resolves();

    await transaction(fn);

    fn.calledWith(this.session).should.be.true;
  });

  it('should call the native withTransaction with the provided transaction options', async function () {
    const fn = sinon.stub().resolves();
    const options = { readConcern: 'majority', writeConcern: 'majority' };

    await transaction(fn, options);

    this.session.withTransaction.firstCall.args[1].should.be.equal(options);
  });

  it('should return the result when the transaction succeeds', async function () {
    const expectedResult = 'result';
    const fn = sinon.stub().resolves(expectedResult);

    const actualResult = await transaction(fn);

    actualResult.should.be.equal(expectedResult);
  });

  it('should throw an error when the transaction fails', async function () {
    const error = new Error('Duplicate key');
    const fn = sinon.stub().rejects(error);

    await transaction(fn).should.eventually.be.rejectedWith(error);
  });

  it('should end the session when transaction is over', async function () {
    const fn = sinon.stub().resolves();

    await transaction(fn);

    this.session.endSession.called.should.be.true;
  });
});
