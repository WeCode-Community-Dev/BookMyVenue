import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    out: './drizzle',
    schema: './src/models/index.js',
    dialect: 'postgresql',
    dbCredentials: {
    url: 'postgresql://postgres:postgres@localhost:5432/bookmyvenue',
},
});