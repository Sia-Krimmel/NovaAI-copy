import Cors from '@modules/cors';
import * as Utilities from '@common/utilities';

export function initMiddleware(middleware) {
  return (req, res) =>
    new Promise((resolve, reject) => {
      middleware(req, res, (result) => {
        if (result instanceof Error) {
          return reject(result);
        }
        return resolve(result);
      });
    });
}

export const cors = initMiddleware(
  Cors({
    methods: ['GET', 'POST', 'OPTIONS'],
  })
);

export async function setup(context): Promise<{ sessionKey?: any; viewer?: Record<string, any> | null }> {
  let viewer = null;
  let sessionKey = context.req.cookies['sitekey'] || '';

  if (!Utilities.isEmpty(sessionKey)) {
    try {
      const response = await fetch('https://api-nova.onrender.com/api/users/viewer', {
        method: 'PUT',
        headers: { 'X-API-KEY': sessionKey, 'Content-Type': 'application/json' },
      });

      const result = await response.json();

      if (result && result.viewer) {
        viewer = result.viewer;
      }
    } catch (e) {}
  }

  return { sessionKey, viewer };
}
