import CryptoJS from "crypto-js";

export const encrypt = (data) => {
  // Encrypt
  var cipherText = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    process.env.PUBLIC_KEY
  ).toString();
  return cipherText;
};

export const decrypt = (hashedData) => {
  // Decrypt
  var bytes = CryptoJS.AES.decrypt(hashedData, process.env.PUBLIC_KEY);
  var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  return decryptedData;
};
