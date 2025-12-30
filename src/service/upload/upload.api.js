import client from '../client';

/**
 * 정적 이미지 URL 생성
 * @param {string} filename - 파일명
 * @returns {string} 이미지 URL
 */
export const getImageUrl = (filename) => {
  const baseURL = client.defaults.baseURL || '';
  return `${baseURL}/uploads/${filename}`;
};

/**
 * 파일 업로드
 * @param {File} file - 업로드할 파일
 * @param {Object} options - 추가 옵션
 * @returns {Promise<Object>} 업로드 결과
 */
export const uploadFile = async (file, options = {}) => {
  const formData = new FormData();
  formData.append('file', file);

  if (options.location) {
    formData.append('location', options.location);
  }

  return await client.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

/**
 * 다중 파일 업로드
 * @param {File[]} files - 업로드할 파일 배열
 * @param {Object} options - 추가 옵션
 * @returns {Promise<Object>} 업로드 결과
 */
export const uploadMultipleFiles = async (files, options = {}) => {
  const formData = new FormData();

  files.forEach((file, index) => {
    formData.append(`files[${index}]`, file);
  });

  if (options.location) {
    formData.append('location', options.location);
  }

  return await client.post('/upload/multiple', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
