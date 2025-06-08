export const getImage = (url) => {
  return new Promise((resolve, reject) => {
    wx.downloadFile({
      url,
      success: (res) => {
          console.log(res)
        resolve(res.tempFilePath);
      },
    });
  });
};