import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { createServer, getServerPort } from '@devvit/web/server';
import { api } from './routes/api';
import { forms } from './devvit/forms';
import { menus } from './devvit/menus';
import { triggers } from './devvit/triggers';
import { jobs } from './devvit/jobs';
import { settings } from './devvit/settings';

const app = new Hono();
const internal = new Hono();

internal.route('/menus', menus);
internal.route('/forms', forms);
internal.route('/triggers', triggers);
internal.route('/jobs', jobs);
internal.route('/settings', settings);

app.route('/api', api);
app.route('/internal', internal);

serve({
  fetch: app.fetch,
  createServer,
  port: getServerPort(),
});
