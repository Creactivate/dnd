    function elips() {
        if (document.querySelector('.elip').innerHTML === '...'){
            document.querySelector('.elip').innerHTML = ''; 
        } else if (document.querySelector('.elip').innerHTML === '') {
            document.querySelector('.elip').innerHTML = '.';
        } else if (document.querySelector('.elip').innerHTML === '.') {
            document.querySelector('.elip').innerHTML = '..';
        } else if (document.querySelector('.elip').innerHTML === '..') {
            document.querySelector('.elip').innerHTML = '...'
        }
    }
    
    async function loadImgCropRotate(url, rotation) { // function to load image into a canvas, crop to a desired aspect and rotate eith 90 or 270 degrees

        function createCanvas(imgSrc){
            return new Promise((resolve, reject)=>{
                    let img = document.createElement('img'); //create image
                    let canvas = document.createElement('canvas'); //create canvas
                    img.onload = () => { //when image loads do this -->
                        
                        let aspectRatio = 0.707 // desired aspect ratio input
                        let aspectRatioInput = img.naturalWidth /  img.naturalHeight //original input photo aspect ratio

                        if (aspectRatioInput > aspectRatio) { //if input aspect is bigger than desired, set canvas size
                            canvas.width = img.naturalHeight * aspectRatio;
                            canvas.height = img.naturalHeight;
                        } else if (aspectRatioInput < aspectRatio) { // if input aspect is smaller than desired, set canvas size
                            canvas.height = img.naturalWidth / aspectRatio;
                            canvas.width = img.naturalWidth;
                        }

                        
                        ctx = canvas.getContext('2d'); // get context and store coordinates of middle of shape
                        let halfWidth = canvas.width/2;
                        let halfHeight = canvas.height/2;
                        if (rotation !== 0){
                            h = canvas.height // for 90 degree and 270 degree rotation swap the width and height of the canvas 
                        canvas.height = canvas.width // for 180 degree would need to change this code section
                        canvas.width = h
                        } else if (rotation === 0) {
                            halfHeight = 0
                            halfWidth = 0
                        }
                        

                        ctx.translate(halfHeight,halfWidth) // translate to middle of canvas
                        ctx.rotate(rotation * Math.PI/180) // rotate by given angle
                        ctx.drawImage(img, -halfWidth, -halfHeight); // draw image at original corner coordinates
                        
                        let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                        let pixels  = imgData.data;
                        for (let i = 0, n = pixels.length; i < n; i += 4) {
                            let grayscale = pixels[i] * .3 + pixels[i+1] * .59 + pixels[i+2] * .11;
                            pixels[i  ] = grayscale;        // red
                            pixels[i+1] = grayscale;        // green
                            pixels[i+2] = grayscale;        // blue
                            //pixels[i+3]              is alpha
                            }
                            //redraw the image in black & white
                            ctx.putImageData(imgData, 0, 0);
                        resolve(canvas); // return result
                    }
                    img.crossOrigin = 'Anonymous';
                    img.src = imgSrc; // start image load
                }
            )
        }
      
        let output = await createCanvas(url).then((resolve) => {return resolve;})
        return output;
    };

// creates first page (title page) A4, text white, black background rect, times font, 110pt size, hard coded title, wraps text
    function autozineFirstPage() {
        var doc = new jsPDF({orientation: 'p'}); // create new pdf object
        doc.setTextColor('white');
        doc.setFillColor(0,0,0); //set fill color to black
        doc.rect(0, 0, 210, 297, "F"); //create background rectangle
        doc.setFont('Times', 'italic');
        doc.setFontSize(110); // font size in pt
        doc.setLineHeightFactor(2);
        const pdfWidth = doc.internal.pageSize.getWidth(); //get width of current page
        const title = "MADE ON AUTOZINE"
        let wrap = doc.splitTextToSize(title, (pdfWidth - 10)); //text wrap set to width of page
        doc.text(wrap , 12, 60); //output text
        return doc;
    };

    function autozineFirstPageLandscape() {
    
        var doc = new jsPDF({orientation: 'l'}); // create new pdf object
        doc.setTextColor('white');
        doc.setFillColor(0,0,0); //set fill color to black
        doc.rect(0, 0, 297, 210, "F"); //create background rectangle
        doc.setFont('Times', 'italic');
        doc.setFontSize(75); // font size in pt
        doc.setLineHeightFactor(2);
        let pdfWidth = doc.internal.pageSize.getWidth(); //get width of current page
        pdfWidth = pdfWidth/2;
        const title = "MADE ON AUTOZINE"
        let wrap = doc.splitTextToSize(title, (pdfWidth - 5)); //text wrap set to width of page
        doc.text(wrap , 12, 60); //output text
        return doc;
        };

    //testTESTtest
    function testytesty(imageArrayObject, doc) {
        let imgTester = getImgFromUrl(imageArrayObject[1].localUrl);
        doc.addPage();
        doc.addImage(imgTester, 'jpg', 0, 0, 50,50);
        return doc;
    };

// pdf template 1
// loops through array of saved image urls, create image dom objects, tests how to crop images for full page fill, outputs one on each page
    function autozineOutput(imageArrayObject, doc) {
        let imageDataArray = [];
        if (imageArrayObject) { // section to test if local urls are available, this should always be the case in future so not needed
        imageDataArray = imageArrayObject.map((item)=>getImgFromUrl(item))
        //camanGreyscaleAll(imageDataArray); caman test
        imageDataArray.forEach((item) => {
            doc.addPage(); //next page
            const imgProps = doc.getImageProperties(item); //image needs to be a dataURI or htmlElement
            const pdfWidth = doc.internal.pageSize.getWidth(); //get width of current page
            const pdfHeight = doc.internal.pageSize.getHeight(); //get height of current page
            const imgWidth = (imgProps.width * pdfHeight) / imgProps.height; //get image width if height is 100% of doc (for landscape images)
            const imgHeight = (imgProps.height * pdfWidth) / imgProps.width; //get image height if width is 100% of doc (for portrait images)
            if (imgProps.width<imgProps.height){ //if portrait, fit by height
                doc.addImage(item, 'JPEG', 0, 0, imgWidth, pdfHeight);// can randomise crop by changing x and y
            } else if (imgProps.width === imgProps.height) { //if square fit by height
                doc.addImage(item, 'JPEG', 0, 0, imgWidth, pdfHeight);
            } else { //if landscape, fit by width
                doc.addImage(item, 'JPEG', 0, 0, pdfWidth, imgHeight);
            }
        });
        return doc; // export changed doc object
    };}

    async function outputSpreads(imageArrayObject, doc){
        if (imageArrayObject) {
        
        //imageArrayObject = imageArrayObject.slice(8)

        let i;
        for (i = 0; i < imageArrayObject.length; i++) {
            if(i % 2 === 0 && i < imageArrayObject.length - 1){//if even number
                doc.addPage()
                //left image
                doc.addImage(await loadImgCropRotate(imageArrayObject[i],0), 'JPEG', 0, 0, 148.5, 210, undefined, undefined, 0);
                //right image
                doc.addImage(await loadImgCropRotate(imageArrayObject[i+1],0), 'JPEG', 148.5, 0, 148.5, 210, undefined, undefined, 0);
            }
        }

        
        return doc; // export changed doc object
    };
}

async function outputOnePageZine(imageArrayObject, doc){
    let imageDataArray = [];
    if (imageArrayObject) { // section to test if local urls are available, this should always be the case in future so not needed
    //imageDataArray = imageArrayObject.map((item)=> loadImgCropRotate(item))
    
    // imageArrayObject = imageArrayObject.slice(0,8)
    doc.addPage()
    //portrait one page zine
        //left row
        doc.addImage(await loadImgCropRotate(imageArrayObject[6], 90), 'JPEG', 0, 0, 105, 74.25, undefined, undefined, 0);
        doc.addImage(await loadImgCropRotate(imageArrayObject[5], 90), 'JPEG', 0, 74.25, 105, 74.25, undefined, undefined, 0);
        doc.addImage(await loadImgCropRotate(imageArrayObject[4], 90), 'JPEG', 0, 148.5, 105, 74.25, undefined, undefined, 0);
        doc.addImage(await loadImgCropRotate(imageArrayObject[3], 90), 'JPEG', 0, 222.75, 105, 74.25, undefined, undefined, 0);
        // data, format, x, y, width, height, alias, compression, rotation
        //right row
        doc.addImage(await loadImgCropRotate(imageArrayObject[7], 270), 'JPEG', 105, 0, 105, 74.25, undefined, undefined, 0);
        doc.addImage(await loadImgCropRotate(imageArrayObject[0], 270), 'JPEG', 105, 74.25, 105, 74.25, undefined, undefined, 0);
        doc.addImage(await loadImgCropRotate(imageArrayObject[1], 270), 'JPEG', 105, 148.5, 105, 74.25, undefined, undefined, 0);
        doc.addImage(await loadImgCropRotate(imageArrayObject[2], 270), 'JPEG', 105, 222.75, 105, 74.25, undefined, undefined, 0);
    return doc; // export changed doc object
};
}
