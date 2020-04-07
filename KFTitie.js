//	Draw kf-styled title, canvas free!
//
//	Copyright 2020 XuChe <chrisxuche@gmail.com>
//	This program is free software: you can redistribute it and/or modify
//	it under the terms of the GNU General Public License as published by
//	the Free Software Foundation, either version 3 of the License, or
//	(at your option) any later version.
//
//	This program is distributed in the hope that it will be useful,
//	but WITHOUT ANY WARRANTY; without even the implied warranty of
//	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//	GNU General Public License for more details.
//
//	You should have received a copy of the GNU General Public License
//	along with this program.  If not, see <https://www.gnu.org/licenses/>.

"use strict";

let colorTuples = shuffle([
    ["#16ae67", "#90c31f"], ["#ea5421", "#f39800"],
    ["#00ac8e", "#e4007f"], ["#227fc4", "#00a1e9"],
    ["#9fa0a0", "#c9caca"], ["#e60013", "#f39800"],
    ["#c3d600", "#a42e8c"]
]);

let topColors = shuffle(
    ["#04ad8f", "#a6ce48", "#f3a118", "#ea6435",
        "#17b297", "#e30983", "#2782c4", "#1aa6e7",
        "#b5b5b5", "#f29905", "#e50011", "#ccdc26",
        "#a5328d", "#0aaa60", "#91c423", "#f29300",
        "#ec5f69", "#22b69e", "#e63e9b", "#917220"]);

let str2List = function (str_) {
    let _tmp = [];
    for (let ch of str_) {
        _tmp.push(ch);
    }
    return _tmp;
};

let callbackDrawShadow = function (dom, index, ch, params) {
    let shadow = params["shadow"];
    if (shadow["enable"]) {
        var shadow_weight = shadow["weight"];
        var shadow_color = shadow["color"];
        dom.style.textShadow =
            "0em 0em " + String(shadow_weight) + "em " + shadow_color;
        return;
    }
    return;
};

let drawText = function (parent_dom, text_list, text_color_list, stroke, weight = -1, text_font, text_size, callback_, callback_param, line_height = 1.33) {
    let dom;
    if (text_color_list.length === 0)
        text_color_list = ["black"];
    for (let [index, ch] of text_list.entries()) {
        dom = document.createElement('span');
        dom.innerText = ch;
        dom.style.display = "inline-block";
        // 粗细
        dom.style.webkitTextStroke = stroke;
        if (weight !== -1) {
            dom.style.fontWeight = String(weight);
        }
        // 转角和线末端使用圆角
        dom.style.strokeLinejoin = "round";
        dom.style.strokeLinecap = "round";
        // 显示溢出部分
        dom.style.overflow = "visible";
        // 其他设置
        dom.style.fontFamily = text_font;
        dom.style.fontSize = text_size;
        dom.style.whiteSpace = "pre-wrap";
        dom.style.lineHeight = String(line_height) + "em";
        // 显示文字
        parent_dom.appendChild(dom);
        // 文字颜色
        if (text_color_list[0] instanceof Array) {
            DualColorize(dom, index, ch, colorTuples)
        } else {
            dom.style.color = text_color_list[index % text_color_list.length];
        }
        callback_(dom, index, ch, callback_param);
    }
    return;
};

let callbackNothing = function (dom, index, ch, params) {
    return;
};

let DualColorize = function (dom, index, ch, params) {
    let colors = params;
    let alpha = Math.random() * 360;
    let percent = 42.5 + Math.random() * 15;
    let color = colors[index % colors.length];
    dom.style.background =
        "linear-gradient(" + String(alpha) + "deg,rgba(0,0,0,0) " + String(percent) + "% ,rgba(0,0,0,0.4) " + String(percent + 0.07) + "%, rgba(0,0,0,0) " + String(percent + 2.5) + "%)," +
        "linear-gradient(" + String(alpha) + "deg," + color[0] + " " + String(percent + 0.1) + "%, " + color[1] + " " + String(percent) + "%)";
    dom.style.color = "transparent";
    dom.style.backgroundClip = "text"; //TODO: 在这里使用background clip会导致超出文本和的部分不显示,设置overflow也没用.
    dom.style.webkitBackgroundClip = "text"; //TODO: 应当减少私有前缀的使用,但不用又不兼容chromium系浏览器. 解决方法:消灭谷歌暴政,世界属于Mozilla!世界属于开放标准!
    return;
};
let drawTitleWithBackground = function (title_font, title_size, shadow_offset, shadow_weight, shadow_color, background_stroke, dom_id, text_list, color_list, line_height) {
    line_height = line_height === undefined ? 1.45 : line_height;
    let title_container = document.getElementById(dom_id);
    let dom;
    { // 绘制背景白边
        //
        let bg_container = document.createElement('span');
        bg_container.id = "title_bg";
        bg_container.style.display = "block";
        bg_container.style.position = "relative";
        title_container.appendChild(bg_container);
        { // 绘制带阴影的第一层白色描边
            //
            let char_container = document.createElement('span');
            char_container.id = "bg_l1";
            char_container.style.display = "block";
            char_container.style.position = "absolute";
            bg_container.appendChild(char_container);
            let params = {
                "shadow": {
                    "enable": true,
                    "color": shadow_color,
                    "offset": shadow_offset,
                    "weight": shadow_weight
                }
            };
            drawText(char_container, text_list, ["white"], background_stroke, -1, title_font, title_size, callbackDrawShadow, params, line_height);

        }
        { // 绘制第二层描边,解决阴影遮挡
            let char_container = document.createElement('span');
            char_container.id = "bg_l2";
            char_container.style.display = "block";
            char_container.style.position = "absolute";
            bg_container.appendChild(char_container);
            let params = {
                "shadow": {
                    "enable": false
                }
            };
            drawText(char_container, text_list, ["white"], background_stroke, -1, title_font, title_size, callbackDrawShadow, params, line_height);
        }
    }
    { // 绘制文字
        let titletext_container = document.createElement('span');
        titletext_container.id = "title_text";
        titletext_container.style.display = "block";
        titletext_container.style.position = "relative";
        title_container.appendChild(titletext_container);
        drawText(titletext_container, text_list, color_list, "0px", -1, title_font, title_size, callbackNothing, {}, line_height);
    }
};

let callbackRotate = function (dom, index, ch, params) {
    dom.style.transform = "rotate(" + String(random(params) * 0.2 / Math.PI * 180) + "deg)";
    dom.style.color = topColors[index % topColors.length];
};

let drawAll = function () {
    // 第一行
    let firstline_container = document.getElementById('firstline');
    firstline = str2List(firstline);
    drawText(firstline_container, firstline, "transparent", "1px", 500, "", "2.5em", callbackRotate, xors);
    //
    main_title = str2List(main_title);
    drawTitleWithBackground("JapariTitle, JapariFallbackTitle", "10rem", 0.015, 0.2, "rgba(0, 0, 0, 1)", "0.163em", 'main_title', main_title, colorTuples);
    //
    title_comment = str2List(title_comment);
    for (let i = title_comment.length - 1; i > 0; i--) {
        title_comment.splice(i, 0, "  ");
    }
    drawTitleWithBackground("TitleComment,TitleCommentFallback", "2.5rem", 0.06, 0.2, "rgba(0, 0, 0, 1)", "0.295em", 'title_comment', title_comment, ["#977a2d"], 1.05);
};

let updateOnChange = function () {
    let firstline_container = document.getElementById('firstline');
    while (firstline_container.childNodes.length > 0) {
        firstline_container.childNodes[0].remove();
    }
    let main_title_container = document.getElementById('main_title');
    while (main_title_container.childNodes.length > 0) {
        main_title_container.childNodes[0].remove();
    }
    let title_comment_container = document.getElementById('title_comment');
    while (title_comment_container.childNodes.length > 0) {
        title_comment_container.childNodes[0].remove();
    }
    firstline = fl.value;
    main_title = mt.value;
    title_comment = tc.value;
    drawAll();
};
//
let firstline = "女の子の姿になった動物たちが繰り広げる大冒険！";
let main_title = "けものフレンズ";
let title_comment = "KEMONO FRIENDS";
window.onload = function () {
    let fl = document.getElementById('fl');
    let mt = document.getElementById('mt');
    let tc = document.getElementById('tc');
    fl.value = firstline;
    mt.value = main_title;
    tc.value = title_comment;
    drawAll();
    fl.addEventListener("change", updateOnChange);
    mt.addEventListener("change", updateOnChange);
    tc.addEventListener("change", updateOnChange);
};