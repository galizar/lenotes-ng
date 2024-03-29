import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import cookieParser from 'cookie-parser';

import { NotesController } from './notes.controller';
import { 
	NotesStorage,
	SupabaseNotesStorage,
	NaiveNotesStorage
} from '@lenotes-ng/data-storage';
import auth from '../middleware/auth';

@Module({
  controllers: [NotesController],
  providers: [
		{
			provide: NotesStorage,
			useValue: new SupabaseNotesStorage()
		}
	]
})
export class NotesModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(cookieParser(), auth)
			.forRoutes(NotesController);
	}
}
