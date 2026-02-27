import fs from 'fs';
import { swaggerSpec } from './src/docs/swagger.js';

fs.writeFileSync(
  './swagger.json',
  JSON.stringify(swaggerSpec, null, 2)
);

console.log('✅ swagger.json created');
