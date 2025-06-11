export const drawCanvas2d =  async (ctx, canvas,config) =>{
    // // 清空
    // ctx.clearRect(0, 0, 512, 512);
    // // 背景
    // ctx.fillStyle = config.textColor;
    // ctx.fillRect(0, 0, 512, 512);
    // 頭像
    
    // 主图片
    if (config.mainImage) {
      await drawImageToCanvas(ctx, canvas, config.mainImage, 0, 0, 512, 512);
    }
    if (config.avatar) {
      await drawRoundImage(ctx, canvas, config.avatar, 18, 18, 72, 72, 43);
    }
    // 完成
    // 贴纸
    // if (config.sticker) {
    //   await drawImageToCanvas(ctx, canvas, config.sticker, 350, 32, 120, 120);
    // }
    const date = new Date();
    // 今天的日期
    ctx.font = '36px sans-serif';
    ctx.fillStyle = config.textColor;
    ctx.textAlign = 'right';
    
    ctx.fillText(date.getDate(), 485,51);
    // 月和年
    ctx.font = '16px sans-serif';
    ctx.fillStyle = config.textColor;
    ctx.textAlign = 'left';
    
    ctx.fillText(`${date.getFullYear()}.${date.getMonth() + 1}`, 431, 75);

    // 标题
    ctx.font = '20px sans-serif';
    ctx.fillStyle = config.textColor;
    ctx.textAlign = 'left';
    
    ctx.fillText(config.titleText, 10, 130);
    // 天數
    ctx.font = '36px sans-serif';
    ctx.fillStyle = config.textColor;
    ctx.textAlign = 'left';
    
    ctx.fillText(config.day, 10, 185);
    // 单位
    ctx.font = '12px sans-serif';
    ctx.fillStyle = config.textColor;
    ctx.textAlign = 'left';
    
    ctx.fillText(config.unit, 41, 185);

    // 副标题
    ctx.font = '20px sans-serif';
    
    ctx.fillText(config.subtitleText, 10, 241);
    // time
    ctx.font = '36px sans-serif';
    ctx.fillText(config.timeStr, 10, 284);
    // // 排名
    // ctx.font = '16px sans-serif';
    // ctx.fillText(config.rankText, 12,310);
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

function drawRoundImage(ctx, canvas, src, x, y, w, h, radius) {
  return new Promise((resolve) => {
    const img = canvas.createImage();
    img.onload = () => {
      ctx.save();
      // 绘制圆角路径
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + w - radius, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
      ctx.lineTo(x + w, y + h - radius);
      ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
      ctx.lineTo(x + radius, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
      ctx.clip();
      // 绘制图片
      ctx.drawImage(img, x, y, w, h);
      ctx.restore();
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