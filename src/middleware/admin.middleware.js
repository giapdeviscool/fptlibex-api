export const adminMiddleware = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({ 
            success: false, 
            message: 'Truy cập bị từ chối! Bạn không có quyền quản trị.' 
        });
    }
};
