import * as bcrypt from 'bcryptjs';
import * as chai from 'chai';
// import * as Jwt from 'jsonwebtoken';
import * as sinon from 'sinon';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import UserModel from '../database/models/user.model';
import UserService from '../database/services/user.service';
import * as schema from '../database/services/validations/validationsLogin';

// import { Response } from 'superagent';

import { Model } from 'sequelize';
import { userAdmin } from './mocks/users.mock';

const sandbox = sinon.createSandbox();

chai.use(chaiHttp);

const { expect } = chai;

describe('Verificando rota de users', () => {
  afterEach(function () {
    sinon.restore();
    sandbox.restore();
  });

  // -------------------Email-------------------
  describe('listagem de email em service users', function () {
    it('retorna o email de users', async function () {
      // arrange
      sinon.stub(Model, 'findOne').resolves(userAdmin as UserModel);

      // act
      const result = await UserService.getByEmail('admin@admin.com');

      // assert
      expect(result).to.deep.equal(userAdmin);
    });

    it('retorna mensagem quando coloca email errado em users', async function () {
      // arrange
      sinon.stub(Model, 'findOne').resolves(null);

      // act
      const result = await UserService.getByEmail('666');

      // assert
      expect(result).to.deep.equal({ message: 'Email não encontrado' });
    });
  });

  // ---------------Role-----------------
  // describe('listagem de role em service users', function () {
  //   it('retorna o role e status de user expecifico', async function () {
  //     // arrange
  //     sandbox.stub(Jwt, 'verify').returns({ data: userAdmin });
  //     sinon.stub(Model, 'findOne').resolves(userAdmin as UserModel);

  //     // act
  //     const result = await UserService.role(userAdmin.email) as {type: number, message: string};

  //     // assert
  //     expect(result.type).to.deep.equal(200);
  //     expect(result.message).to.deep.equal(userAdmin.role);
  //   });
  // });

  // ---------------Login-----------------
  describe('listagem de login em service users', function () {
    it('retorna o login e status de user expecifico', async function () {
      // UserModel.findOne
      // bcrypt.compareSync
      // UserService.generateToken
      
      // arrange
      sinon.stub(schema, 'validateLogin').returns({type: null, message: ''});
      sinon.stub(Model, 'findOne').resolves(userAdmin as UserModel);
      sinon.stub(bcrypt, 'compareSync').resolves(true);
      sinon.stub(UserService, 'generateToken').resolves('QWERTQWERTQWERTtokenEnormeQWERTQWERTQWERT');

      // act
      const result = await UserService.login(userAdmin) as {type: number, message: object};
      const msg = await result.message as {token: string};

      // assert
      expect(result.type).to.deep.equal(200);
      expect(await msg.token).to.deep.equal('QWERTQWERTQWERTtokenEnormeQWERTQWERTQWERT');
    });

    it('retorna status e mensagem de erro com password errado de user', async function () {
      // UserModel.findOne
      // bcrypt.compareSync
      // UserService.generateToken
      
      // arrange
      sinon.stub(schema, 'validateLogin').returns({type: null, message: ''});
      sinon.stub(Model, 'findOne').resolves(userAdmin as UserModel);
      sinon.stub(bcrypt, 'compareSync').returns(false);

      // act
      const result = await UserService.login(userAdmin) as {type: number, message: object};

      // assert
      expect(result.type).to.deep.equal(401);
      expect(result.message).to.deep.equal({ message: 'Invalid email or password' });
    });

    it('retorna status e mensagem de erro com email errado de user', async function () {
      // UserModel.findOne
      // bcrypt.compareSync
      // UserService.generateToken
      
      // arrange
      sinon.stub(schema, 'validateLogin').returns({type: null, message: ''});
      sinon.stub(Model, 'findOne').resolves(null);
      sinon.stub(bcrypt, 'compareSync').resolves(true);

      // act
      const result = await UserService.login(userAdmin) as {type: number, message: object};

      // assert
      expect(result.type).to.deep.equal(401);
      expect(result.message).to.deep.equal({ message: 'Invalid email or password' });
    });
  });

  describe('verifica controller de users', function () {
    it('retorna token de login', async function () {
      // arrange
      // sinon.stub(UserService, 'getAll').resolves(userAdmin);

      // act
      const httpResponse = await chai
        .request(app)
        .post('/login')
        .send({
          email: userAdmin.email,
          password: 'secret_admin'
        })
      const {token} = httpResponse.body;

      // assert
      expect(httpResponse.status).to.equal(200);
      expect(httpResponse.body).to.be.deep.equal({token});

      const httpRespRole = await chai
      .request(app)
      .get('/login/role')
      .auth(token, 'pass')
      .set('Authorization', `${token}`);

      expect(httpRespRole.status).to.equal(401);
      expect(httpRespRole.body).to.be.deep.equal({message: "Token must be a valid token"});
    });
  });
});
