import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import {ConfigService} from "@nestjs/config"

const logger = new Logger();
const configService = new ConfigService()

async function bootstrap() {

  const user = configService.get<string>('RABBITMQ_USER')
  const password = configService.get<string>('RABBITMQ_PASSWORD')
  const url = configService.get<string>('RABBITMQ_URL')

  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://${user}:${password}@${url}`],
      noAck: false,
      queue: 'admin-backend',
    },
  });

  await app.listen(() => logger.log('Microservice is listening'));
}
bootstrap();
