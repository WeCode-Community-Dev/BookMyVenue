const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        try {
            const userRoles = req.user.roles;

            if (!userRoles || userRoles.length === 0) {
                return res.status(403).json({
                    success: false,
                    message: "Access denied. No roles assigned.",
                });
            }

            const hasAccess = userRoles.some(role => allowedRoles.includes(role));

            if (!hasAccess) {
                return res.status(403).json({
                    success: false,
                    message: "Access denied. You do not have the permission to perform this action.",
                });
            }

            next();
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    };
};

export default authorizeRoles;