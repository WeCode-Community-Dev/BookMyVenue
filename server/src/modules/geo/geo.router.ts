import { Router } from 'express';
import type { Request, Response } from 'express';
import { verifyAccessToken } from '../../middlewares/auth.middleware';
import { searchPlace } from './geo.service';
import { ResponseUtil } from '../../utils/responseUtils';
import { logError } from '../../utils/logger';

const router: Router = Router();

/**
 * @openapi
 * /geo/search:
 *   get:
 *     tags: [Geo]
 *     summary: Search for places using OpenStreetMap Nominatim
 *     description: |
 *       Search for cities, towns, or places in India using OpenStreetMap's Nominatim geocoding service.
 *       Results include coordinates, city/district, and postcode information.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 2
 *         description: Search query (city, town, or place name)
 *     responses:
 *       200:
 *         description: Array of search results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       displayName:
 *                         type: string
 *                       lat:
 *                         type: number
 *                       lng:
 *                         type: number
 *                       city:
 *                         type: string
 *                       district:
 *                         type: string
 *                       postcode:
 *                         type: string
 *       400:
 *         description: Missing or invalid query parameter
 *       401:
 *         description: Not authenticated
 *       503:
 *         description: Search service temporarily unavailable
 */
router.get('/search', verifyAccessToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const { q } = req.query;

    if (!q || typeof q !== 'string' || q.trim().length < 2) {
      ResponseUtil.badRequest(res, 'Search query must be at least 2 characters');
      return;
    }

    const results = await searchPlace(q);
    ResponseUtil.success(res, 'Places found', results);
  } catch (err) {
    const error = err as Error;
    if (error.message.includes('temporarily unavailable')) {
      ResponseUtil.internalServerError(res, error.message);
    } else {
      logError('Geo search error', {
        module: 'geo.router.ts/search',
        error: error.message,
      });
      ResponseUtil.internalServerError(res, 'Search failed. Please try again.');
    }
  }
});

export { router as geoRouter };
