import { app } from './application/web.js';
import { createImageDir } from './utils/utils.js';

const PORT = 9000;

createImageDir('images');

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
