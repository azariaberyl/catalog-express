/**
 * Entry point of the application.
 * Starts the server and fetches user data.
 * @module main
 */

import { app } from './application/web.js';
import { ONE_DAY } from './utils/global.js';
import { fetchUser } from './utils/utils.js';

const PORT = 9000;

/**
 * Fetches user data after a delay of one day.
 * @async
 * @function fetchUserData
 */
setInterval(async () => {
  await fetchUser();
}, ONE_DAY);

/**
 * Starts the server and listens on the specified port.
 * @function startServer
 */
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
