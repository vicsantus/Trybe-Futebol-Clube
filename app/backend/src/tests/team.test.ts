import * as chai from 'chai';
import * as sinon from 'sinon';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import TeamsModel from '../database/models/teams.model';
import TeamsService from '../database/services/teams.service';

// import { Response } from 'superagent';

import { Model } from 'sequelize';
import { allProducts } from './mocks/team.mock';

chai.use(chaiHttp);

const { expect } = chai;

describe('Verificando rota /teams', () => {
  afterEach(function () {
    sinon.restore();
  });

  describe('verifica listagem de service teams', function () {
    it('retorna a lista completa de teams', async function () {
      // arrange
      sinon.stub(Model, 'findAll').resolves(allProducts as TeamsModel[]);

      // act
      const result = await TeamsService.getAll();

      // assert
      expect(result).to.deep.equal(allProducts);
    });

    it('retorna um item de teams', async function () {
      // arrange
      sinon.stub(Model, 'findByPk').resolves(allProducts[0] as TeamsModel);

      // act
      const result = await TeamsService.getById('1');

      // assert
      expect(result).to.deep.equal(allProducts[0]);
    });

    it('retorna mensagem quando coloca id errado em teams', async function () {
      // arrange
      sinon.stub(Model, 'findByPk').resolves(null);

      // act
      const result = await TeamsService.getById('666');

      // assert
      expect(result).to.deep.equal({ message: 'Time não encontrado' });
    });
  });

  describe('verifica controller de teams', function () {
    it('retorna a lista completa de teams', async function () {
      // arrange
      sinon.stub(TeamsService, 'getAll').resolves(allProducts);

      // act
      const httpResponse = await chai
        .request(app)
        .get('/teams')

      // assert
      expect(httpResponse.status).to.equal(200);
      expect(httpResponse.body).to.deep.equal(allProducts);
    });

    it('retorna um id da lista de teams', async function () {
      // arrange
      sinon.stub(TeamsService, 'getById').resolves(allProducts[0]);

      // act
      const httpResponse = await chai
        .request(app)
        .get('/teams/1')

      // assert
      expect(httpResponse.status).to.equal(200);
      expect(httpResponse.body).to.deep.equal(allProducts[0]);
    });
  });
});
