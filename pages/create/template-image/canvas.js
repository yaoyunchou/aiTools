export const drawCanvas2d =  async (ctx, canvas,config) =>{
    // // 清空
    // ctx.clearRect(0, 0, 512, 512);
    // // 背景
    // ctx.fillStyle = '#fff';
    // ctx.fillRect(0, 0, 512, 512);
    // 頭像
    
    // 主图片
    if (config.mainImage) {
      await drawImageToCanvas(ctx, canvas, config.mainImage, 0, 0, 512, 512);
    }
    if (config.avatar) {
      await drawImageToCanvas(ctx, canvas, config.avatar, 18, 18, 72, 72);
    }
    // 完成
    // 贴纸
    // if (config.sticker) {
    //   await drawImageToCanvas(ctx, canvas, config.sticker, 350, 32, 120, 120);
    // }
    // 标题
    ctx.font = '20px sans-serif';
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'left';
    ctx.shadowColor = 'rgba(0,0,0,0.18)';
    ctx.shadowBlur = 8;
    ctx.fillText(config.titleText, 10, 130);
    // 天數
    ctx.font = '36px sans-serif';
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'left';
    ctx.shadowColor = 'rgba(0,0,0,0.18)';
    ctx.shadowBlur = 8;
    ctx.fillText(config.day, 10, 185);
    // 单位
    ctx.font = '12px sans-serif';
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'left';
    ctx.shadowColor = 'rgba(0,0,0,0.18)';
    ctx.shadowBlur = 8;
    ctx.fillText(config.unit, 41, 185);

    // 副标题
    ctx.font = '20px sans-serif';
    ctx.shadowBlur = 0;
    ctx.fillText(config.subtitleText, 10, 241);
    // time
    ctx.font = '36px sans-serif';
    ctx.fillText(config.timeStr, 10, 284);
    // 排名
    ctx.font = '16px sans-serif';
    ctx.fillText(config.rankText, 12,310);
    // 描述
    ctx.font = '20px sans-serif';
    drawWrappedText(ctx, config.descText, 10, 450, 480, 28);
    // 二维码
    // if (config.showQrcode && config.qrcodeUrl) {
    //   await drawImageToCanvas(ctx, canvas, config.qrcodeUrl, 384, 384, 96, 96);
    // }
  }
 const  drawImageToCanvas = (ctx, canvas, src, x, y, w, h) =>{
    return new Promise((resolve) => {
      const img = canvas.createImage();
      img.onload = () => {
        ctx.drawImage(img, x, y, w, h);
        resolve();
      };
      img.onerror = resolve;
      img.src = src;
    });
  }

function drawWrappedText(ctx, text, x, y, maxWidth, lineHeight) {
  const paragraphs = text.split('\n');
  for (let p = 0; p < paragraphs.length; p++) {
    let line = '';
    const words = paragraphs[p].split(' ');
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, y);
        line = words[n] + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, y);
    y += lineHeight;
  }
}