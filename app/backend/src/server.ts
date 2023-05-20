import 'dotenv/config';
import { App } from './app';

const PORT = process.env.PORT || process.env.APP_PORT || 3001;

new App().start(PORT);
