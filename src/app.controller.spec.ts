import { Test, TestingModule } from '@nestjs/testing';

import { AppController } from './app.controller';

describe('AppController', () => {
  let controller: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    controller = app.get<AppController>(AppController);
  });

  describe('healthCheck', () => {
    it('Should return "OK"', () => {
      expect(controller.healthCheck()).toBe('OK');
    });
  });
});
