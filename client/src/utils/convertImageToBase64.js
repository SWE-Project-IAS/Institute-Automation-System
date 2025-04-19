// utils/convertImageToBase64.js
export default function convertImageToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result.split(',')[1]); // Strip the "data:image/*;base64," part
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
