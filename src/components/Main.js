require('normalize.css/normalize.css');
require('styles/App.less');

import React from "react";
import ReactDOM from 'react-dom'
// let yeomanImage = require('../images/yeoman.png');
// 获取图片相关的数据
// let imageDatas = require('../data/imageDatas.json');
import datas from '../data/imageDatas.js';
let imageDatas = [...datas];
// console.log(imageDatas);
/** [imageDatas 利用自执行函数，将图片信息转成图片URL路径信息] */
imageDatas = ((imageDataArr) => {
    let arr = [];
    imageDataArr.forEach(item => {
        let singleImageData = item;
        singleImageData.imageURL = require("../images/" + singleImageData.fileName);
        arr.push(singleImageData);
    })
    return arr;
})(imageDatas)
// console.log(imageDatas)
class ImgFigure extends React.Component {
    /**
     * [handleClick imgFigure的点击处理函数]
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    handleClick(e) {
        // console.log(e)
        if(this.props.arrange.isCenter) {
            this.props.inverse()
        } else {
            this.props.center()
        }
        e.stopPropagation()
        e.preventDefault()
    }

    render() {
        let styleObj = {};
        // 如果props属性中制定了这张图片的位置，则使用
        // console.log(this.props.arrange)
        if(this.props.arrange.pos) {
            styleObj = this.props.arrange.pos;
        }
        /*
         * 居中图片z-index高于旁边的图片，低于controller-nav的。取11的一次方
         */
        if(this.props.arrange.isCenter) {
            styleObj.zIndex = 11
        }

        // 如果图片的旋转角度有值并且不为0，添加旋转角度
        if(this.props.arrange.rotate) {
            (['MozTransform', 'msTransform', 'WebkitTransform', 'transform']).forEach( value => {
                styleObj[value] = `rotate(${this.props.arrange.rotate}deg)`
            })
        }
        let imgFigureClassName = 'img-figure'
        // console.log(this.props.arrange.isInverse)
        imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : ''
        return (
            <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick.bind(this)}>
                <img src={this.props.data.imageURL} alt={this.props.data.title}/>
                <figcaption>
                    <h2 className="img-title">{this.props.data.title}</h2>
                    <div className="img-back" onClick={this.handleClick.bind(this)}>
                        <p>{this.props.data.desc}</p>
                    </div>
                </figcaption>
            </figure>
        )
    }
}


class ControllerUnit extends React.Component {
    handleClick(e) {
        // 如果点击的是当前选中态的按钮，则翻转图片，否则将对应的图片居中
        if(this.props.arrange.isCenter) {
            this.props.inverse()
        } else {
            this.props.center()
        }
        e.preventDefault()
        e.stopPropagation()
    }
    render() {
        let controllerUnitClassName = 'controller-unit'
        // 如果对应的是居中的图片，显示控制按钮的居中态
        if(this.props.arrange.isCenter) {
            controllerUnitClassName += ' is-center'

            // 如果同时对应的是翻转图片，显示控制按钮的翻转态
            if(this.props.arrange.isInverse) {
                controllerUnitClassName += ' is-inverse'
            }
        }


        return (
            <span className={controllerUnitClassName} onClick={this.handleClick.bind(this)}></span>
        )
    }
}


class AppComponent extends React.Component {
    Constant = {
        centerPos: {
            left: 0,
            right: 0
        },
        hPosRange: {  // 水平方向的取值范围
            leftSecX: [0, 0],
            rightSecX: [0, 0],
            y: [0, 0]
        },
        vPosRange: { // 垂直方向的取值范围
            x: [0, 0],
            topY: [0 , 0]
        }
    }

    state = {
        // imgsArrangeArr: this.getImgsArrangeArr(imageDatas)
        imgsArrangeArr: [
            /*{
                pos: {
                    left: 0,
                    top: 0
                },
                rotate: 0,  // 旋转角度
                isInverse: false  // 图片正反面
                isCenter: false  // 图片是否居中
            }*/
        ]
    }

    /**
     * [inverse 翻转图片]
     * @param  {[number]} index [输入当前被执行inverse操作的图片对应的图片信息数组的index值]
     * @return {[Function]}       [闭包函数，其内return一个真正待被执行的函数, 将在子组件中执行]
     */
    inverse(index) {
        return _ => {
            let imgsArrangeArr = this.state.imgsArrangeArr
            imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse

            this.setState({
                imgsArrangeArr: imgsArrangeArr
            })
        }
    }

    /**
     * [center 利用 reararnge函数，居中对应index的图片]
     * @param  {[type]} index [需要被居中的图片对应的图片信息数组的index的值]
     * @return {[Function]}       [description]
     */
    center(index) {
        return _ => {
            this.rearrange(index)
        }
    }

    // 组件加载以后，为每张图片计算其位置的范围
    componentDidMount() {
        // 首先拿到舞台的大小
        // console.log(this.refs.stage);
        let stageDOM = this.refs.stage,
            stageW = stageDOM.scrollWidth,
            stageH = stageDOM.scrollHeight,
            halfStageW = Math.ceil(stageW / 2),
            halfStageH = Math.ceil(stageH / 2);
        // 拿到一个imageFigure的大小
        // console.log(stageW, stageH, 'sfasdfasfasfasfasdfas', this.refs.stage, this.imgFigure0, ReactDOM.findDOMNode(this.imgFigure0))
        // let imgFigureDOM = this.refs.imgFigure0,
        let imgFigureDOM = ReactDOM.findDOMNode(this.imgFigure0),
            imgW = imgFigureDOM.scrollWidth,
            imgH = imgFigureDOM.scrollHeight,
            halfImgW = Math.ceil(imgW / 2),
            halfImgH = Math.ceil(imgH / 2);
        // console.log( this.refs.imgFigure0, stageW, stageH, 'sfasdfasfasfasfasdfas', halfImgW, imgH, halfImgH)
        // 计算中心图片的位置点
        // console.log(this.Constant)
        this.Constant.centerPos = {
            left: halfStageW - halfImgW,
            top: halfStageH - halfImgH
        };

        // 计算左侧右侧区域图片排布位置的取值范围
        this.Constant.hPosRange.leftSecX[0] = -halfImgW; // 最小值
        this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3; // 最大值
        this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
        this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
        this.Constant.hPosRange.y[0] = -halfImgH;
        this.Constant.hPosRange.y[1] = stageH - halfImgH;

        // 计算上侧区域图片排布位置的取值范围
        this.Constant.vPosRange.topY[0] = -halfImgH;
        this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
        this.Constant.vPosRange.x[0] = halfStageW - imgW;
        this.Constant.vPosRange.x[1] = halfStageW;

        this.rearrange(0);
    }

    /**
     * [rearrange 重新布局所有的图片]
     * @param  {[number]} centerIndex [指定居中排布哪个图片]
     * @return {[type]}             [description]
     */
    rearrange(centerIndex) {
        let imgsArrangeArr = this.state.imgsArrangeArr,
            Constant = this.Constant,
            centerPos = Constant.centerPos,
            hPosRange = Constant.hPosRange,
            vPosRange = Constant.vPosRange,
            hPosRangeLeftSecX = hPosRange.leftSecX,
            hPosRangeRightSecX = hPosRange.rightSecX,
            hPosRangeY = hPosRange.y,
            vPosRangeTopY = vPosRange.topY,
            vPosRangeX = vPosRange.x,

            imgsArrangeTopArr = [],
            topImgNum = Math.floor(Math.random() * 2),// 取一个或者不取
            topImgSpliceIndex = 0,
            imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);
        console.log(imgsArrangeArr, imgsArrangeCenterArr)
        // 首先居中centerIndex 的图片,居中的centerIndex的图片不需要旋转
        imgsArrangeCenterArr[0] = {
            pos: centerPos,
            rotate: 0,
            isCenter: true
        };

        // 取出要布局上侧的图片的状态信息
        topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
        imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

        // 布局位于上侧的图片
        imgsArrangeTopArr.forEach( (value, index) => {
            imgsArrangeTopArr[index] = {
                pos: {
                    top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
                    left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
                },
                rotate: get30DegRandom(),
                isCenter: false,
            }
        })

        // 布局左右两侧的图片
        for(let i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
            let hPosRangeLORX = null

            // 前半部分布局左边，右版部分布局右边
            if( i < k ) {
                hPosRangeLORX = hPosRangeLeftSecX
            } else {
                hPosRangeLORX = hPosRangeRightSecX
            }

            imgsArrangeArr[i] = {
                pos: {
                    top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
                    left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
                },
                rotate: get30DegRandom(),
                isCenter: false,
            }
        }
        // debugger;
        if(imgsArrangeTopArr && imgsArrangeTopArr[0]) {
            imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0])
        }
        imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0])

        this.setState({
            imgsArrangeArr: imgsArrangeArr
        })
        console.log(imgsArrangeArr)
    }

    render() {
        let ImgFigures = []
        let controllerUnits = []

        imageDatas.forEach( (value, index) => {
            if(!this.state.imgsArrangeArr[index]) {
                this.state.imgsArrangeArr[index] = {
                    pos: {
                        left: 0,
                        top: 0
                    },
                    rotate: 0,  // 旋转角度
                    isInverse: false,  // 图片正反面
                    isCenter: false
                }
                console.log(this.state.imgsArrangeArr[index])
            }
            ImgFigures.push(
                // <ImgFigure data={value} key={value.fileName} ref={'imgFigure' + index} arrange={this.state.imgsArrangeArr[index]}></ImgFigure>
                <ImgFigure data={value} key={value.fileName}
                    ref={el => this['imgFigure' + index] = el}
                    arrange={this.state.imgsArrangeArr[index]}
                    inverse={this.inverse(index)}
                    center={this.center(index)}
                ></ImgFigure>
            )
            controllerUnits.push(
                <ControllerUnit arrange={this.state.imgsArrangeArr[index]}
                    key={value.fileName}
                    inverse={this.inverse(index)}
                    center={this.center(index)}/>
            )
        })
        console.log(this.state)
        console.log(this.state.imgsArrangeArr, 'render')
        return (
            <section className="stage" ref="stage">
                <section className="img-sec">
                    {ImgFigures}
                </section>
                <nav className="controller-nav">
                    {controllerUnits}
                </nav>
            </section>
        );
    }
}
/**
 * [getRangeRandom 获取区间内的一个随机值]
 * @param  {[number]} low  [小值]
 * @param  {[number]} high [大值]
 * @return {[number]}      [返回区间内的随机值]
 */
function getRangeRandom(low, high) {
    return Math.ceil( Math.random() * (high - low) + low );
}

/**
 * [get30DegRandom 获取0-30° 之间的一个任意正负值 ]
 * @return {[type]} [description]
 */
function get30DegRandom() {
    return (Math.random() > 0.5 ? '' : '-' ) + Math.ceil( Math.random() * 30)
}


AppComponent.defaultProps = {};

export default AppComponent;
