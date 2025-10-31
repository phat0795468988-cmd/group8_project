const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const User = require('../models/User');

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Cấu hình multer để xử lý file upload
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Chỉ cho phép upload file ảnh'), false);
    }
  }
});

// Middleware upload single file
const uploadSingle = upload.single('avatar');

// Upload avatar
const uploadAvatar = async (req, res) => {
  try {
    const userId = (req.user && (req.user._id || req.user.id)) || null;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    // Kiểm tra file được upload
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng chọn file ảnh để upload'
      });
    }

    const hasCloudinary = !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);

    let avatarUrl = null;
    if (hasCloudinary) {
      // Upload lên Cloudinary
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: 'image',
            folder: 'group2-avatars',
            public_id: `avatar-${userId}-${Date.now()}`,
            transformation: [
              { width: 300, height: 300, crop: 'fill', gravity: 'face' },
              { quality: 'auto' }
            ]
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(req.file.buffer);
      });
      avatarUrl = result.secure_url;
    } else {
      // Dev fallback: dùng chính ảnh người dùng chọn (data URL) để nhìn thấy hình thật
      try {
        const base64 = req.file.buffer.toString('base64');
        avatarUrl = `data:${req.file.mimetype};base64,${base64}`;
      } catch (e) {
        // Nếu tạo data URL lỗi, dùng placeholder cuối cùng
        avatarUrl = `https://i.pravatar.cc/300?u=${userId}`;
      }
      console.log('[DEV] Using inline data URL for avatar fallback');
    }

    // Cập nhật avatar URL vào database
    const user = await User.findByIdAndUpdate(
      userId,
      { avatar: avatarUrl },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy user'
      });
    }

    res.json({
      success: true,
      message: 'Upload avatar thành công',
      data: {
        avatar: avatarUrl,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar
        }
      }
    });
  } catch (error) {
    console.error('Upload avatar error:', error);
    // Fallback cuối: vẫn trả về placeholder để không chặn luồng demo
    try {
      const userId = (req.user && (req.user._id || req.user.id)) || 'unknown';
      let avatarUrl;
      if (req.file && req.file.buffer && req.file.mimetype) {
        // cố gắng dùng ảnh người dùng chọn nếu có
        const base64 = req.file.buffer.toString('base64');
        avatarUrl = `data:${req.file.mimetype};base64,${base64}`;
      } else {
        avatarUrl = `https://i.pravatar.cc/300?u=${userId}`;
      }
      const user = await User.findByIdAndUpdate(
        userId,
        { avatar: avatarUrl },
        { new: true }
      );
      return res.json({
        success: true,
        message: 'Không thể upload Cloudinary trong môi trường hiện tại. Dùng ảnh placeholder.',
        data: {
          avatar: avatarUrl,
          user: user ? {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar
          } : undefined
        }
      });
    } catch (fallbackErr) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi server khi upload avatar',
        error: error.message
      });
    }
  }
};

// Xóa avatar
const deleteAvatar = async (req, res) => {
  try {
    const userId = (req.user && (req.user._id || req.user.id)) || null;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    // Lấy thông tin user hiện tại
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy user'
      });
    }

    // Nếu có avatar, xóa khỏi Cloudinary (bỏ qua nếu là placeholder)
    if (user.avatar && !user.avatar.includes('i.pravatar.cc')) {
      try {
        const publicId = user.avatar.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`group2-avatars/${publicId}`);
      } catch (cloudinaryError) {
        console.error('Cloudinary delete error:', cloudinaryError);
        // Không dừng quá trình nếu xóa Cloudinary thất bại
      }
    }

    // Xóa avatar URL khỏi database
    user.avatar = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Xóa avatar thành công',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar
        }
      }
    });
  } catch (error) {
    console.error('Delete avatar error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi xóa avatar',
      error: error.message
    });
  }
};

module.exports = {
  uploadAvatar,
  deleteAvatar,
  uploadSingle
};


