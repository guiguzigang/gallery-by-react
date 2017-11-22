require('normalize.css/normalize.css');
require('styles/App.less');

import React from 'react';

// let yeomanImage = require('../images/yeoman.png');
// 获取图片相关的数据
// let imageDatas = require('../data/imageDatas.json');
/** [imageDatas 利用自执行函数，将图片信息转成图片URL路径信息] */
/*imageDatas = ((imageDataArr) => {
    imageDataArr.forEach(item => {
        let singleImageData = item
        singleImageData.imageURL = require('../images/' + singleImageData.fileName)
        item = singleImageData
    })
    return imageDataArr
})(imageDatas)
console.log(imageDatas)*/

class AppComponent extends React.Component {
    render() {
        return (
            <section className="stage">
                <section className="img-sec">

                </section>
                <nav className="controller-nav">

                </nav>
            </section>
        );
    }
}

AppComponent.defaultProps = {};

export default AppComponent;
