import React, { useState, useRef, useCallback } from 'react';
import './UploadAvatar.css';

const UploadAvatar = ({ user, onAvatarUpdate }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [preview, setPreview] = useState(null);
  const previewUrlRef = useRef(null);
  const fileInputRef = useRef(null);

  const prepareFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setMessage('Vui lòng chọn file ảnh');
      setIsSuccess(false);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setMessage('File ảnh không được vượt quá 5MB');
      setIsSuccess(false);
      return;
    }
    // Clear previous preview url if exists
    if (previewUrlRef.current) {
      try { URL.revokeObjectURL(previewUrlRef.current); } catch {}
      previewUrlRef.current = null;
    }
    setMessage('');
    // Prefer object URL for instant preview and large files
    try {
      const objUrl = URL.createObjectURL(file);
      previewUrlRef.current = objUrl;
      setPreview(objUrl);
    } catch {
      // Fallback to FileReader
      const reader = new FileReader();
      reader.onload = (ev) => setPreview(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    prepareFile(file);
  };

  // Drag & Drop support
  const onDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer?.files?.[0];
    if (file) {
      if (fileInputRef.current) fileInputRef.current.files = e.dataTransfer.files;
      prepareFile(file);
    }
  }, []);

  const onDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Paste from clipboard
  const onPaste = (e) => {
    const items = e.clipboardData?.items || [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type && item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) {
          prepareFile(file);
          return;
        }
      }
    }
  };

  const handleUpload = async () => {
    const file = fileInputRef.current.files[0];
    if (!file) {
      setMessage('Vui lòng chọn file ảnh');
      setIsSuccess(false);
      return;
    }

    setIsUploading(true);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/upload/avatar', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Upload avatar thành công!');
        setIsSuccess(true);
        setPreview(null);
        fileInputRef.current.value = '';
        
        // Update parent component
        if (onAvatarUpdate) {
          onAvatarUpdate(data.data.user);
        }
      } else {
        setMessage(data.message || 'Upload thất bại');
        setIsSuccess(false);
      }
    } catch (error) {
      setMessage('Có lỗi xảy ra khi upload. Vui lòng thử lại.');
      setIsSuccess(false);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteAvatar = async () => {
    if (!user.avatar) return;

    setIsUploading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/upload/avatar', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Xóa avatar thành công!');
        setIsSuccess(true);
        
        // Update parent component
        if (onAvatarUpdate) {
          onAvatarUpdate(data.data.user);
        }
      } else {
        setMessage(data.message || 'Xóa avatar thất bại');
        setIsSuccess(false);
      }
    } catch (error) {
      setMessage('Có lỗi xảy ra khi xóa avatar. Vui lòng thử lại.');
      setIsSuccess(false);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setPreview(null);
    setMessage('');
    setIsSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (previewUrlRef.current) {
      try { URL.revokeObjectURL(previewUrlRef.current); } catch {}
      previewUrlRef.current = null;
    }
  };

  return (
    <div className="upload-avatar-container">
      <div className="upload-avatar-card">
        <h3>Quản lý Avatar</h3>
        
        {/* Current Avatar */}
        <div className="current-avatar">
          <h4>Avatar hiện tại:</h4>
          {user.avatar ? (
            <div className="avatar-display">
              <img src={user.avatar} alt="Current Avatar" className="current-avatar-img" />
              <button 
                onClick={handleDeleteAvatar}
                className="delete-avatar-btn"
                disabled={isUploading}
              >
                Xóa Avatar
              </button>
            </div>
          ) : (
            <div className="no-avatar">
              <div className="no-avatar-icon">👤</div>
              <p>Chưa có avatar</p>
            </div>
          )}
        </div>

        {/* Upload New Avatar */}
        <div className="upload-section" onDrop={onDrop} onDragOver={onDragOver} onPaste={onPaste}>
          <h4>Upload Avatar mới:</h4>
          
          <div className="file-input-container">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*"
              className="file-input"
              id="avatar-upload"
            />
            <label htmlFor="avatar-upload" className="file-input-label">
              Chọn ảnh từ thiết bị / Kéo thả / Dán ảnh
            </label>
          </div>

          {preview && (
            <div className="preview-container">
              <h5>Xem trước:</h5>
              <img src={preview} alt="Preview" className="preview-img" />
            </div>
          )}

          {message && (
            <div className={`message ${isSuccess ? 'success' : 'error'}`}>
              {message}
            </div>
          )}

          <div className="upload-actions">
            {preview && (
              <>
                <button 
                  onClick={handleUpload}
                  className="upload-btn"
                  disabled={isUploading}
                >
                  {isUploading ? 'Đang upload...' : 'Upload Avatar'}
                </button>
                <button 
                  onClick={handleCancel}
                  className="cancel-btn"
                  disabled={isUploading}
                >
                  Hủy
                </button>
              </>
            )}
          </div>
        </div>

        <div className="upload-info">
          <p><strong>Lưu ý:</strong></p>
          <ul>
            <li>Chỉ chấp nhận file ảnh (JPG, PNG, GIF, etc.)</li>
            <li>Kích thước file tối đa: 5MB</li>
            <li>Ảnh sẽ được tự động resize về 300x300px</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UploadAvatar;


