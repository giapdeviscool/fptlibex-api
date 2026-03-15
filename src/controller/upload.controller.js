import { uploadFile } from "../service/cloud.service.js";

class UploadController {
    static async uploadImage(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({ success: false, message: "Không tìm thấy file tải lên" });
            }

            const fileName = `${Date.now()}-${req.file.originalname}`;
            const fileUrl = await uploadFile(req.file.buffer, fileName);

            res.status(200).json({ 
                success: true, 
                message: "Tải ảnh lên thành công",
                imageUrl: fileUrl 
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}

export default UploadController;
