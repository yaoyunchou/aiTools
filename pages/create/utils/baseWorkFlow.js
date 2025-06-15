import request from '~/api/request';
// 调用工作流的接口
/**
 * 1. 调用工作流的接口，传入workflowId, parameters,  imageConfig是文件参数， 需要中间调用文件上传接口拿到值后才能给parameters
 * 2.  imageConfig 是一个配置list, 每个item里面有url, key, 
 * 3.  通过item的url调用coze的上传接口， 返回对应的文件id, 让后parameters[key]:id 把参数组装给parameters
 * 4. 上传图片的接口是
 * @param {*} character 
 * @param {*} text 
 */
async function runWorkFlow(workflowId, parameters, imageConfig) {
    try {
        // 参数校验
        if (!workflowId) {
            throw new Error('workflowId 不能为空');
        }
        if (typeof parameters !== 'object') {
            throw new Error('parameters 必须为对象');
        }


        // 组装参数, 判断imageConfig是否为空
        if (imageConfig.length > 0) {
            const promiseList = []
            // 循环imageConfig, 调用上传接口, 返回对应的文件id, 让后parameters[key]:id 把参数组装给parameters
            for (const item of imageConfig) {
                promiseList.push(new Promise((resolve, reject) => {
                    wx.uploadFile({
                        url: 'https://nestapi.xfysj.top/xcx/api/v1/creations/coze/upload-file', //仅为示例，非真实的接口地址
                        filePath:item.url,
                        name: 'file',
                        success (res){
                          const data = JSON.parse(res.data)
                  
                          console.log( data)
                          if(data.code === 0 && data.data.code ===0) {
                            resolve({[item.key]:{"file_id":data.data.data.id}})
                          }else{
                            reject(data.data.msg)
                          }
                  
                        }
                      })
                })) 
              
            }
            const fileIdList = await Promise.all(promiseList)
            if(fileIdList.length > 0) {
                for(let i = 0; i < fileIdList.length; i++) {
                    parameters = {
                        ...parameters,
                        ...fileIdList[i]
                    }
                }
            }
        }

        const runWork = await request("/api/v1/creations/coze/run-workflow", "POST", {
            workflowId: workflowId,
            parameters: parameters,
            isAsync: true,
          });
          console.log("------------", runWork);
          if (runWork.code == 0 && runWork.data.code ===0) {
            // 循环接口找图片的返回
            let isRunning = true;
            while (isRunning) {
              const res = await request(
                `/api/v1/creations/coze/workflow-status/${runWork.data.execute_id}?workflow_id=${workflowId}`
              );
              if (res.data.execute_status === "Success") {
                isRunning = false;
        
                console.log(res.data.images);
                // 调用接口创建作品
                const result = JSON.parse(res.data.output)
                if(result?.Output){
                    return JSON.parse(result.Output)
                }
                return res.data
             
              } else if (res.data.execute_status === "Running") {
                await new Promise((resolve) => setTimeout(resolve, 1000));
              } else {
                isRunning = false;
                // 出错了
                Message.error(res.data.msg);
              }
            }
          }else{
            console.error(runWork?.data?.msg || runWork?.data.msg|| '工作流出问题了')
          }
    } catch (error) {
        console.log(error)
    }

}

export default runWorkFlow;
