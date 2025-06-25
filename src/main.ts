
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  // 🔧 Supprimer l'index username_1 si présent
  const connection = app.get<Connection>(getConnectionToken());
  const indexes = await connection.collection('users').indexes();

  const indexToDelete = indexes.find(i => i.name === 'username_1');
  if (indexToDelete) {
    await connection.collection('users').dropIndex('username_1');
    console.log('✅ Index "username_1" supprimé avec succès.');
  }

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
