import { app } from './application/web.js';
import { requiredEnvVariables } from './utils/global.js';
import { checkEnvVariables } from './utils/utils.js';

checkEnvVariables(requiredEnvVariables);
const PORT = 9000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
