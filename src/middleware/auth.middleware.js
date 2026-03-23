import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Bạn chưa đăng nhập!' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        req.user = decoded; // Attach user id to request
        next();
    } catch (err) {
        return res.status(401).json({ success: false, message: 'Token không hợp lệ hoặc đã hết hạn!' });
    }
}