import { createBrowserRouter } from 'react-router-dom';
import ownerRoutes from "../modules/owner/owner.routes";

import { venueRoutes } from "../modules/venues/venues.routes";
import { authRoutes } from "../modules/auth/auth.routes";
import { homeRoutes } from "../modules/home/home.routes";
import { adminRoutes } from "../modules/admin/admin.routes";

const router = createBrowserRouter([
   ...homeRoutes,
   ...authRoutes,
   ...venueRoutes,
   ...ownerRoutes,
   ...adminRoutes,
]);

export default router;