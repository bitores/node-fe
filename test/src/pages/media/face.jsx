import React,{useEffect} from 'react';



export default ()=>{

  useEffect(()=>{

    try {
      // const aa = require('./opencv.js/opencv/opencv.js');
      // Your OpenCV code
      let video = document.getElementById("video");
      let outputCanvas = document.getElementById("outputCanvas");
      let myImg = document.getElementById('myImg');
      let cap = null;
      let faceCascade = null;
      let src = null;
      let gray = null;
      let blur = null;
      let edge = null;
      let dst = null;
      let videoHeight = 480
      let videoWidth = 640

      // console.log(att)

      async function init(params) {
          console.log('...init')
         cv = await cv;
    
        // cv.then(res=>{
        //   console.log(res)
        // })
        console.log(cv)
        // return;
        // faceCascade = new cv.cuda.CascadeClassifier();
        // // faceCascade.load("face.xml")
        // faceCascade.load("./opencv.js/model/haarcascade_frontalface_default.xml")
        let faceCascade = new cv.CascadeClassifier();
        cap = new cv.VideoCapture(video)
        src = new cv.Mat(videoHeight, videoWidth, cv.CV_8UC4);
        // src = new cv.imread(myImg);
        gray = new cv.Mat(videoHeight, videoWidth, cv.CV_8UC1);
        blur = new cv.Mat(videoHeight, videoWidth, cv.CV_8UC1);
        edge = new cv.Mat(videoHeight, videoWidth, cv.CV_8UC1);
        dst = new cv.Mat(videoHeight, videoWidth, cv.CV_8UC4);


        // let stream = await navigator.mediaDevices.getUserMedia({
        //   video: {
        //       width: {
        //           exact: videoWidth
        //       },
        //       height: {
        //           exact: videoHeight
        //       }
        //   },
        //   audio: false
        // })

        // video.srcObject = stream;
        // video.play();

    function detectFace() {
        // Capture a frame
        // cap.read(src)
        // src = cv.imread(myImg)

        // Convert to greyscale
        cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
        //3*3降噪 （2*3+1)
        // cv.blur(src, blur, new cv.Size(7,7));
        //边缘显示
        // cv.Canny(src,edge,0,30,3);
        // 双边过滤
        let kSize = 15;
        // let mat = cv.Mat.ones(new cv.Size(kSize, kSize), cv.CV_32F);
        // let kernel = mat.mul(mat, 1.0/(kSize*kSize));

        // cv.filter2D(src, blur, src.depth(), kernel);
        integral_blur(src,dst, kSize, 0)

        //加入人脸检测人脸融合代码
        let skin_mat = cv.Mat.zeros(blur.size(), cv.CV_8UC1);
        findSkin(blur, skin_mat);

        // let dst;
        fuseSkin(src, blur, dst, skin_mat);
        //亮度提升
        cv.add(dst, new cv.Mat(dst.rows,dst.cols, dst.type(), new cv.Scalar(10, 10)), dst);
        //提高对比度
        let mats=new cv.MatVector();
        let b_mat = cv.Mat.zeros(blur.size(), cv.CV_8UC1), 
            g_mat = cv.Mat.zeros(blur.size(), cv.CV_8UC1), 
            r_mat = cv.Mat.zeros(blur.size(), cv.CV_8UC1);
        cv.split(dst, mats);
        cv.equalizeHist(mats.get(0), b_mat);
        cv.equalizeHist(mats.get(1), g_mat);
        cv.equalizeHist(mats.get(2), r_mat);
        cv.merge(mats, dst);


        // // Downsample
        // let downSampled = new cv.Mat();
        // cv.pyrDown(gray, downSampled);
        // cv.pyrDown(downSampled, downSampled);

        // // Detect faces
        // let faces = new cv.RectVector();
        // // faceCascade.detectMultiScale(downSampled, faces)

        // // Draw boxes
        // let size = downSampled.size();
        // let xRatio = videoWidth / size.width;
        // let yRatio = videoHeight / size.height;
        // for (let i = 0; i < faces.size(); ++i) {
        //     let face = faces.get(i);
        //     let point1 = new cv.Point(face.x * xRatio, face.y * yRatio);
        //     let point2 = new cv.Point((face.x + face.width) * xRatio, (face.y + face.height) * xRatio);
        //     cv.rectangle(src, point1, point2, [255, 0, 0, 255])
        // }
        // // Free memory
        // downSampled.delete()
        // faces.delete()

        // Show image
        cv.imshow(outputCanvas, dst)

        // requestAnimationFrame(detectFace)
    }



    function getSqsum(sqsum, y0, x0, y1, x1, channel) {
        let lt = sqsum.ucharPtr(y0, x0)[channel];
        let lb = sqsum.ucharPtr(y1, x0)[channel];
        let rt = sqsum.ucharPtr(y0, x1)[channel];
        let rb = sqsum.ucharPtr(y1, x1)[channel];

        return rb - rt - lb + lt;
    }

    function getSum(sum_mat, y0, x0, y1, x1, channel) {
        let left_t = sum_mat.ucharPtr(y0, x0)[channel];
        let left_b = sum_mat.ucharPtr(y1, x0)[channel];
        let right_t = sum_mat.ucharPtr(y0, x1)[channel];
        let right_b = sum_mat.ucharPtr(y1, x1)[channel];

        return  right_b - right_t - left_b + left_t;
    }


    /*
    利用积分图运算 实现快速模糊
    */
    function integral_blur(src, dst, size, sigma) {
        if (size%2 == 0) {
          //   cout << "size 必须是奇数" << endl;
            console.log("size 必须是奇数")
            return 0;
        }

        let src_w = src.cols;
        let src_h = src.rows;
        let channels = src.channels();
        // cout <<"通道数"<< channels << endl;
        console.log("通道数", channels)
        dst.create(src.size(), src.type());

        //把原图像进行边缘填充
        let makeBorder = new cv.Mat();
        let borderW = size / 2;
        cv.copyMakeBorder(src, makeBorder, borderW, borderW, borderW, borderW,cv.BORDER_DEFAULT);

        //积分图运算
        let sum_mat = new cv.Mat(), sqsum_mat = new cv.Mat();
        cv.integral(makeBorder, sum_mat, sqsum_mat, cv.CV_32S, cv.CV_32F);

        let left_t = 0, left_b = 0, right_t = 0, right_b = 0;
        let y0 = 0, x0 = 0, y1 = 0, x1 = 0;
        for (let row = 0; row < src_h; row++)
        {
            y0 = row;
            y1 = y0 + size;
            for (let col = 0; col < src_w; col++)
            {
                x0 = col;
                x1 = x0 + size;
                const pDst = dst.ucharPtr(row, col);
                const pSrc = src.ucharPtr(row, col);
                for (let channel = 0; channel < channels; channel++)
                {   
                    //求去makeBorder图像size区块大小的和
                    let sum_value = getSum(sum_mat, y0, x0, y1, x1, channel);
                    let sqsum_value = getSqsum(sqsum_mat, y0, x0, y1, x1, channel);
                    
                    let diff = (sqsum_value - (sum_value*sum_value / (size*size))) / (size*size);
                    let k = diff / (diff + sigma);

                    // const pSrc = src.ucharPtr(row, col)[channel];
                    pDst[channel] = (1 - k)*(sum_value / (size*size)) + k*pSrc[channel];
                }

            }
        }
        return 1;
    }

    // 皮肤检测融合
    function findSkin(src, dst) {
      //   dst= cv.Mat.zeros(src.size(), cv.CV_8UC1);
        let ycrcbMat = new cv.Mat(src.size(), src.type());
        cv.cvtColor(src, ycrcbMat,cv.COLOR_BGR2YCrCb);

        for (let row = 0; row <src.rows; row++)
        {
            for (let col = 0; col < src.cols; col++)
            {
                let pixels = ycrcbMat.ucharPtr(row, col);
                let y = pixels[0];
                let cr = pixels[1];
                let cb = pixels[2];

                const pDst = dst.ucharPtr(row, col);
                if (y>80 && 85<cb<135 && 135<cr<180){
                    
                    pDst[0] = 1;
                    pDst[1] = 1;
                    pDst[2] = 1;
                    pDst[3] = 1;
                } else {
                    pDst[0] = 0;
                    pDst[1] = 0;
                    pDst[2] = 0;
                    pDst[3] = 0;
                }
            }
        }

    }

    function fuseSkin(src, blur, dst, skin){
        dst = dst.create(src.size(), src.type());

        for (let row = 0; row < src.rows; row++)
        {
            for (let col = 0; col < src.cols; col++)
            {

                let skin_pix = skin.ucharPtr(row, col);
                const pDst = dst.ucharPtr(row, col);
                // debugger
                // if (skin_pix[0] === 0 && skin_pix[1] === 0 && skin_pix[2] === 0 && skin_pix[3] === 0 ) {
                if (skin_pix == 0 ) {
                  //非皮肤区域
                  const pSrc = src.ucharPtr(row, col);
                  pDst[0] = pSrc[0];
                  pDst[1] = pSrc[1];
                  pDst[2] = pSrc[2];
                  pDst[3] = pSrc[3];
                }
                else{
                    //皮肤区域
                    // dst.ucharPtr(row, col) = blur.ucharPtr(row, col);
                    const pBlur = blur.ucharPtr(row, col);
                    pDst[0] = pBlur[0];
                    pDst[1] = pBlur[1];
                    pDst[2] = pBlur[2];
                    pDst[3] = pBlur[3];
                }

            }
        }
    }
    // 面部磨皮
    function pretty(image, value1, value2) {
 
        let dst = new cv.Mat();
        if (value1 == null || value1 == undefined) value1 = 3;//磨皮系数
        if (value2 == null || value2 == undefined) value2 = 1;//细节系数 0.5 - 2

        var dx = value1 * 5;//双边滤波参数
        var fc = value1 * 12.5;//参数
        var p = 0.1;//透明度

        let temp1 = new cv.Mat(), temp2 = new cv.Mat(), temp3 = new cv.Mat(), temp4 = new cv.Mat();

        cv.cvtColor(image, image, cv.COLOR_RGBA2RGB, 0);
        

        cv.bilateralFilter(image, temp1, dx, fc, fc);//bilateralFilter(Src)

        let temp22 = new cv.Mat();
        cv.subtract(temp1, image, temp22);//bilateralFilter(Src) - Src

        cv.add(temp22, new cv.Mat(image.rows, image.cols, image.type(), new cv.Scalar(128, 128, 128, 128)), temp2);//bilateralFilter(Src) - Src + 128

        cv.GaussianBlur(temp2, temp3, new cv.Size(2 * value2 - 1, 2 * value2 - 1), 0, 0);
        //2 * GuassBlur(bilateralFilter(Src) - Src + 128) - 1

        let temp44 = new cv.Mat();
        temp3.convertTo(temp44, temp3.type(), 2, -255);
        //2 * GuassBlur(bilateralFilter(Src) - Src + 128) - 256

        cv.add(image, temp44, temp4);
        cv.addWeighted(image, p, temp4, 1 - p, 0.0, dst);
        //Src * (100 - Opacity)

        cv.add(dst, new cv.Mat(image.rows, image.cols, image.type(), new cv.Scalar(10, 10, 10, 0)), dst);
        //(Src * (100 - Opacity) + (Src + 2 * GuassBlur(bilateralFilter(Src) - Src + 128) - 256) * Opacity) /100
        // return temp44
        return dst;
    }
    // 反相
    function reverse2(srcImage){
        let dst = new cv.Mat(srcImage.size(), srcImage.type());
        let heigth = srcImage.rows;
        let width = srcImage.cols;
        let nc = srcImage.channels();

        for (let row = 0; row < heigth; row++) {
            for (let col = 0; col < width; col++) {
                const pSrc = srcImage.ucharPtr(row, col);
                const pDst = dst.ucharPtr(row, col);
                // console.log(nc)
                if(nc===1){
                    let gray = pSrc[0];    //获取像素值
                    pDst[0] = 255 - gray; //像素值取反赋值
                    
                } else{
                    let b = pSrc[0];  //获取像素值b 
                    let g = pSrc[1];  //获取像素值g
                    let r = pSrc[2];  //获取像素值r
                    pDst[0] = 255 - b;
                    pDst[1] = 255 - g;
                    pDst[2] = 255 - r;
                    pDst[3] = pSrc[3];
                }
            }
        }

        return dst;
    }
    // 让你的照片变旧
    function toOld(srcImage){
        let dst = new cv.Mat(srcImage.size(), srcImage.type());
        let heigth = srcImage.rows;
        let width = srcImage.cols;
        let nc = srcImage.channels();

        for (let row = 0; row < heigth; row++) {
            for (let col = 0; col < width; col++) {
                const pSrc = srcImage.ucharPtr(row, col);
                const pDst = dst.ucharPtr(row, col);
                // console.log(nc)
                if(nc===1){
                    let gray = pSrc[0];    //获取像素值
                    pDst[0] = 255 - gray; //像素值取反赋值
                    
                } else{
                    let r = pSrc[0];  //获取像素值b 
                    let g = pSrc[1];  //获取像素值g
                    let b = pSrc[2];  //获取像素值r
                    let R = parseInt(0.273 * r + 0.535 * g + 0.131 * b)
                    let G = parseInt(0.347 * r + 0.683 * g + 0.167 * b)
                    let B = parseInt(0.395 * r + 0.763 * g + 0.188 * b)
                    pDst[0] = Math.max(0, Math.min(R, 255));
                    pDst[1] = Math.max(0, Math.min(G, 255));
                    pDst[2] = Math.max(0, Math.min(B, 255));
                    pDst[3] = pSrc[3];
                }
            }
        }

        return dst;
    }

    function xxx(img){
        const thres_min=220;  //二值化最小阈值
        //二值化
        cv.threshold(img, img, thres_min, 255, cv.THRESH_BINARY);
        cv.imshow("img_thres",img);
        //img备份
        let copy=img.clone();//拷贝原图，且不会随着原图改变
        cv.cvtColor(copy,copy,cv.COLOR_BGR2GRAY);//彩色图转灰度图
        cv.threshold(copy, copy, thres_min, 255, cv.THRESH_BINARY_INV);//反转：白色变黑色，黑色变白色
        cv.imshow("copy", copy);
        //查找copy的轮廓
        // vector<vector<Point>>contours;
        let contours = new cv.MatVector()
        cv.findContours(copy, contours, new cv.Mat(), cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
        //将轮廓画在全黑图像上
        let draw = new cv.Mat();
        draw = cv.Mat.zeros(img.size(), cv.CV_32FC1);//定义一个img大小的全黑图像
        cv.drawContours(draw, contours, 0, new cv.Scalar(255), -2);
        cv.imshow("img2", draw);
        //进行膨胀腐蚀操作
        let dilated = new cv.Mat(), eroded = new cv.Mat();
        let kernel=cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(19,19));//定义结构元素
        cv.dilate(draw, dilated, kernel, new cv.Point(-1,-1), 2);//膨胀两次
        cv.imshow("dilate", dilated);
        cv.erode(dilated, eroded,  kernel, new cv.Point(-1,-1), 2);
        cv.imshow("erode", eroded);
        //膨胀腐蚀相减
        let diff = new cv.Mat();
        cv.absdiff(dilated, eroded, diff);
        diff.convertTo(diff, cv.CV_8UC1);//转换为单通道图（即灰度图）
        cv.imshow("diff", diff);
        //在差异图diff中查找轮廓,然后在原图中绘制轮廓
        // vector<vector<Point>>contours2;
        let contours2 = new cv.MatVector();
        cv.findContours(diff, contours2, new cv.Mat(), cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
        cv.drawContours(img, contours2, 0, new cv.Scalar(0,255,0),-1);//-1表示绘制轮廓内部，正数表示轮廓线条粗细
        cv.imshow("result", img);

        return  img;
    }

    function cartoonify(src,typeName = 'Scharr'){

        let gray = new cv.Mat();
        cv.cvtColor(src,gray,cv.COLOR_RGB2GRAY);
        cv.medianBlur(gray,gray,5); //去噪

        if(typeName == "Scharr"){
            let edge1=new cv.Mat(gray.size(),cv.CV_8U);
            let edge2 = new cv.Mat();
            cv.Scharr(gray,edge1,cv.CV_8U,1,0,1,0,cv.BORDER_DEFAULT); //X方向差分运算 
            cv.Scharr(gray,edge2,cv.CV_8U,0,1,1,0,cv.BORDER_DEFAULT); //Y方向差分运算 

            let dst1 = new cv.Mat();
            let mask = new cv.Mat();
            let dtype = -1;
            cv.add(edge1, edge2, dst1, mask, dtype);//整体Scharr!!!!edge1 += edge2; 
            
            dst1.copyTo(gray);
            edge1.delete();edge2.delete();dst1.delete();mask.delete();
        }
        else if(typeName == "Canny"){
            cv.Canny(gray,gray,80,160,3); 
        }
        else{
            cv.Laplacian(gray, gray, cv.CV_8U, 5);
        }
        
        let mask = new cv.Mat(src.size(),cv.CV_8U);
        cv.threshold(gray,mask,120,255,cv.THRESH_BINARY_INV);
        //medianBlur(mask,mask,3); 
        // cv.imshow("mask",mask);

        //对原始图像双边滤波
        let smallSzie = new cv.Size(src.cols/2,src.rows/2);
        let s_src=new cv.Mat(smallSzie,src.type());
        let tmp=new cv.Mat(smallSzie,cv.CV_8UC3);
        cv.resize(src,s_src,smallSzie,0,0,cv.INTER_LINEAR);
        
        const iterator=7;
        for(let i=0;i<iterator;i++){
            const ksize=9;
            const sigmaColor=9;
            const sigmaSpace=7;
            try {
                cv.bilateralFilter(s_src,tmp,ksize,sigmaColor,sigmaSpace)
                cv.bilateralFilter(tmp,s_src,ksize,sigmaColor,sigmaSpace);
            } catch (error) {
                
            }
        }
        let b_src = new cv.Mat();
        cv.resize(s_src,b_src,src.size(),0,0,cv.INTER_LINEAR);

        //掩膜叠加
        let dst2=new cv.Mat();// new cv.Mat(src.size(),src.type(),new cv.Scalar.all(0)); //初始化
        //dst.setTo(0);
        b_src.copyTo(dst2,mask);

        return dst2;
    }




    function detectFace2() {
        // console.log()
        cap.read(src)
        dst = pretty(src.clone())
        // src = pretty(src, dst);
        cv.imshow(outputCanvas, dst);
        requestAnimationFrame(detectFace2)
    }

    function detectFace3(){
        
        // console.log(faceCascade)
        try{
            let src = new cv.Mat(videoHeight, videoWidth, cv.CV_8UC4)
            cap.read(src)
             let gray = new cv.Mat(videoHeight, videoWidth, cv.CV_8UC1);
            // Convert to greyscale
            cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
            

            // Downsample
            let downSampled = new cv.Mat(gray.size(), gray.type());
            cv.pyrDown(gray, downSampled);
            cv.pyrDown(downSampled, downSampled);
            
            // Detect faces
            let faces = new cv.RectVector();
            // try {
                
                faceCascade.load("/face.xml")
                faceCascade.detectMultiScale(downSampled, faces)
            // } catch (error) {
            //     console.log(error)
            // }
            // 
            // faceCascade.detectMultiScale(new cv.Mat(), faces)

            

            // Draw boxes
            let size = downSampled.size();
            let xRatio = videoWidth / size.width;
            let yRatio = videoHeight / size.height;
            for (let i = 0; i < faces.size(); ++i) {
                let face = faces.get(i);
                let point1 = new cv.Point(face.x * xRatio, face.y * yRatio);
                let point2 = new cv.Point((face.x + face.width) * xRatio, (face.y + face.height) * xRatio);
                cv.rectangle(src, point1, point2, [255, 0, 0, 255])
            }
            // Free memory
            downSampled.delete()
            faces.delete()
            cv.imshow(outputCanvas, src);
            point1.delete();
            point2.delete();
            src.delete()
            gray.delete();
        }catch(e){

        }
        
       
        requestAnimationFrame(detectFace3)
        // return src
    }
    
    function detectFace4(src){
        let gray = new cv.Mat(videoHeight, videoWidth, cv.CV_8UC1);
        cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
        let faces = new cv.RectVector();
        let eyes = new cv.RectVector();
        let faceCascade = new cv.CascadeClassifier();
        let eyeCascade = new cv.CascadeClassifier();
        // load pre-trained classifiers
        faceCascade.load('haarcascade_frontalface_default.xml');
        eyeCascade.load('haarcascade_eye.xml');
        // detect faces
        let msize = new cv.Size(0, 0);
        faceCascade.detectMultiScale(gray, faces, 1.1, 3, 0, msize, msize);
        for (let i = 0; i < faces.size(); ++i) {
            let roiGray = gray.roi(faces.get(i));
            let roiSrc = src.roi(faces.get(i));
            let point1 = new cv.Point(faces.get(i).x, faces.get(i).y);
            let point2 = new cv.Point(faces.get(i).x + faces.get(i).width,
                                    faces.get(i).y + faces.get(i).height);
            cv.rectangle(src, point1, point2, [255, 0, 0, 255]);
            // detect eyes in face ROI
            eyeCascade.detectMultiScale(roiGray, eyes);
            for (let j = 0; j < eyes.size(); ++j) {
                let point1 = new cv.Point(eyes.get(j).x, eyes.get(j).y);
                let point2 = new cv.Point(eyes.get(j).x + eyes.get(j).width,
                                        eyes.get(j).y + eyes.get(i).height);
                cv.rectangle(roiSrc, point1, point2, [0, 0, 255, 255]);
            }
            roiGray.delete(); roiSrc.delete();
        }
        return src;
    }

        // requestAnimationFrame(detectFace3)
        // src = cv.imread(myImg);
        // // cap.read(src)
        // dst = pretty(src, 4, 3);
        // // dst = reverse2(src)
        // // dst = toOld(src)
        // cv.imshow(outputCanvas, dst);

        

        // src = cv.imread(myImg)
        // dst = detectFace3(src)
        // cv.imshow(outputCanvas, dst)

        }
        myImg.onload = init;
        // init();

        

        


    } catch (err) {
        // console.log(cvTranslateError(cv, err));
    }

  },[])



  return (<div>
    {/* <img id="myImg" src={require("./20180427211020_722.png")} alt="娜" style={{display:'none'}}/> */}
    <img id="myImg" src={require('./4823793-9888d0be40902a7f.jpg')} alt="娜" style={{display:'none'}}/>
    {/* <img id="myImg" src={require('./4823793-573e4480238764e8.jpg')} alt="" style={{display:'none'}}/> */}
    {/* <img id="myImg" src={require('./20170802192914115.png')} alt="" style={{display:'none'}}/> */}
    {/* <img id="myImg" src={require('./20170802193505694.png')} alt="" style={{display:'none'}}/> */}
    <video id="video" width="640" height="480" style={{display:'none'}}></video>
    <canvas id="outputCanvas" width="640" height="480"></canvas>
    <canvas id="img_thres" width="640" height="480"></canvas>
    <canvas id="copy" width="640" height="480"></canvas>
    <canvas id="img2" width="640" height="480"></canvas>
    <canvas id="dilate" width="640" height="480"></canvas>
    <canvas id="erode" width="640" height="480"></canvas>
    <canvas id="diff" width="640" height="480"></canvas>
    <canvas id="result" width="640" height="480"></canvas>
  </div>)
}