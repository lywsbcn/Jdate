var Jdate = /** @class */ (function () {
    function Jdate() {
        var _this = this;
        this.hidden = true;
        this.config = {
            format: "YYYY-MM-DD",
            closeOther: true,
            lang: 'cn',
            autoClose: true,
            showTime: false,
            style: {
                head: { class: 'head' },
                prevY: { at: "py", html: '«', show: true },
                prevM: { at: 'pm', html: '‹', show: true },
                nextM: { at: 'nm', html: '›', show: true },
                nextY: { at: 'ny', html: '»', show: true }
            }
        };
        /**当前时间*/
        this.current = { Y: 0, M: 0, D: 0, H: 0, m: 0, s: 0, a: 0 };
        this.selected = { Y: 0, M: 0, D: 0, H: 0, m: 0, s: 0, a: 0 };
        /**今天*/
        this.today = { Y: 0, M: 0, D: 0, H: 0, m: 0, s: 0, a: 0 };
        this.lang_value = {
            cn: {
                week: ["日", "一", "二", "三", "四", "五", "六"],
                month: ["", '一月', "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
                now: "现在",
                today: "今天",
                time: "选择时间",
                timeBack: '返回日期',
                clean: "清空",
                close: "关闭",
                confirm: "确定",
                hour: "时",
                minute: '分',
                second: '秒'
            },
            en: {
                week: ["S", "M", "T", "W", "T", "F", "S"],
                month: ["", 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                now: "now",
                today: "today",
                time: "select time",
                timeBack: 'back',
                clean: "clean",
                close: "close",
                confirm: "confirm",
                hour: "hour",
                minute: 'minute',
                second: 'second'
            }
        };
        this.action = {
            pm: function () {
                _this.current.M == 1 && _this.current.Y--;
                _this.current.M == 1 ? 12 : _this.current.M--;
                _this.renderDates();
            },
            py: function () {
                _this.current.Y--;
                _this.renderDates();
            },
            nm: function () {
                _this.current.M == 12 && _this.current.Y++;
                _this.current.M == 12 ? 1 : _this.current.M++;
                _this.renderDates();
            },
            ny: function () {
                _this.current.Y++;
                _this.renderDates();
            },
            dt: function (target) {
                var data = JSON.parse(target.getAttribute("data-date"));
                _this.setData(_this.current, data);
                _this.setData(_this.selected, data);
                _this.renderDates();
                _this.setDate();
                if (_this.config.autoClose) {
                    _this.hide();
                }
            },
            clean: function () {
                _this.target['value'] = '';
            },
            confirm: function () {
                _this.setDate();
                _this.hide();
            },
            time: function () {
                if (_this.timeLayer.style.display == 'none') {
                    _this.timeLayer.style.display = 'initial';
                    _this.renderTime();
                    _this.timeButton.innerHTML = _this.lang('timeBack');
                }
                else {
                    _this.timeLayer.style.display = 'none';
                    _this.timeButton.innerHTML = _this.lang('time');
                }
            },
            hour: function (target) {
                _this.current.H = parseInt(target.innerHTML);
                _this.renderTime();
            },
            minute: function (target) {
                _this.current.m = parseInt(target.innerHTML);
                _this.renderTime();
            },
            second: function (target) {
                _this.current.s = parseInt(target.innerHTML);
                _this.renderTime();
            },
        };
        this.listener = function (e) {
            e.stopPropagation();
            var target = (e.target || e.srcElement);
            var at = target.getAttribute('at');
            _this.action[at] && _this.action[at](target);
        };
    }
    /**初始化监听selecotor 点击
     * 如果该控件已经绑定过 onclick事件,则不执行
     * */
    Jdate.init = function () {
        var _this = this;
        window.addEventListener('click', function (e) {
            var target = (e.target || e.srcElement);
            target.matches(_this.selector) && !target.onclick && _this.listener(e);
            !target.matches("input[jdate]") && _this.hideAll();
        });
    };
    /**
     * 手动绑定控件
     * @param seletor
     */
    Jdate.render = function (seletor) {
        var _this = this;
        seletor = seletor || document.body;
        var nodes = seletor.querySelectorAll(this.selector);
        nodes.forEach(function (node) {
            !node.onclick && (node.onclick = _this.listener.bind(_this), node.setAttribute('render', ''));
        });
    };
    Jdate.hideAll = function () {
        for (var x in this.container) {
            var obj_1 = this.container[x];
            obj_1.hide();
        }
    };
    Jdate.recycle = function () {
        for (var x in this.container) {
            var obj_2 = this.container[x];
            if (!obj_2.target.parentElement) {
                delete this.container[x];
                obj_2.destory();
            }
        }
    };
    /**
     * 点击事件监听
     * @param event
     */
    Jdate.listener = function (event) {
        var target = (event.target || event.srcElement);
        var obj;
        if (target['JdateNo'] === void 0) {
            var no = target['JdateNo'] = this.JdateNo++;
            obj = this.container[no] = new Jdate();
            obj.target = target;
            obj.init();
            this.recycle();
        }
        else {
            obj = this.container[target['JdateNo']];
        }
        obj && obj.toggle();
    };
    /* ************************实例化***************************/
    /**初始化 */
    Jdate.prototype.init = function () {
        this.loadConfig();
        this.setToday();
        this.setCurrentDate(this.target['value']);
        this.initView();
        this.view.addEventListener('click', this.listener);
        return this;
    };
    /**显示或者隐藏空间 */
    Jdate.prototype.toggle = function () {
        if (this.hidden) {
            this.show();
            this.hidden = false;
        }
        else {
            this.hide();
        }
    };
    /**显示日期控件 */
    Jdate.prototype.show = function () {
        var _this = this;
        if (this.config.closeOther)
            Jdate.hideAll();
        this.target.parentElement.appendChild(this.view);
        setTimeout(function () { _this.view.style.opacity = "1"; }, 10);
        this.layer();
        this.setToday();
        this.setCurrentDate(this.target['value']);
        this.renderDates();
    };
    Jdate.prototype.hide = function () {
        var _this = this;
        if (this.hidden)
            return;
        this.hidden = true;
        this.view.style.opacity = "0";
        setTimeout(function () {
            if (_this.timeLayer.style.display != 'none') {
                _this.action.time();
            }
            _this.view.remove();
        }, 100);
    };
    Jdate.prototype.destory = function () {
        this.hide();
        this.view.removeEventListener('click', this.listener);
    };
    /**加载配置 */
    Jdate.prototype.loadConfig = function () {
        try {
            var config = JSON.parse(this.target.getAttribute("jdate"));
            this.setData(this.config, config);
        }
        catch (e) {
        }
        if (this.config.format.indexOf("H") != -1 ||
            this.config.format.indexOf("m") != -1 ||
            this.config.format.indexOf("s") != -1) {
            this.config.autoClose = false;
            this.config.showTime = true;
        }
        this.timeButton.hidden = !this.config.showTime;
    };
    /**
     * 从绑定的对象中获取当前时间
     * @param str
     */
    Jdate.prototype.setCurrentDate = function (str) {
        var tmp;
        if (str !== void 0 && this.isDate(str)) {
            tmp = new Date(str);
        }
        else {
            tmp = new Date();
        }
        this.selected.Y = this.current.Y = tmp.getFullYear();
        this.selected.M = this.current.M = tmp.getMonth() + 1;
        this.selected.D = this.current.D = tmp.getDate();
        this.selected.H = this.current.H = tmp.getHours();
        this.selected.m = this.current.m = tmp.getMinutes();
        this.selected.s = this.current.s = tmp.getSeconds();
        return this;
    };
    /**设置今天 */
    Jdate.prototype.setToday = function () {
        var tmp = new Date();
        this.today.Y = tmp.getFullYear();
        this.today.M = tmp.getMonth() + 1;
        this.today.D = tmp.getDate();
        this.today.H = tmp.getHours();
        this.today.m = tmp.getMinutes();
        this.today.s = tmp.getSeconds();
        return this;
    };
    /**控件定位 */
    Jdate.prototype.layer = function () {
        var top = this.target.offsetTop, left = this.target.offsetLeft, height = this.target.offsetHeight;
        this.view.style.left = left + "px";
        this.view.style.top = 1 + top + height + 'px';
        //if (top + height + this.view.clientHeight > window.innerHeight && window.innerHeight > this.view.clientHeight) {
        //    this.view.style.top = top - this.view.clientHeight-3 + "px";
        //} else {
        //}
        //console.log(top, left, height, window.innerHeight);
    };
    Jdate.prototype.initView = function () {
        this.initHead();
        this.initWeek();
        this.initDates();
        this.initTool();
        this.initTime();
    };
    Jdate.prototype.initHead = function () {
        this.head.appendChild(this.prevY);
        this.head.appendChild(this.prevM);
        this.head.appendChild(this.nextY);
        this.head.appendChild(this.nextM);
        this.head.appendChild(this.labelLayer);
        this.labelLayer.appendChild(this.labelYear);
        this.labelLayer.appendChild(this.labelMonth);
        this.view.appendChild(this.head);
    };
    Object.defineProperty(Jdate.prototype, "head", {
        get: function () {
            if (!this._head) {
                this._head = document.createElement('div');
                this._head.classList.add(this.config.style.head.class);
            }
            return this._head;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Jdate.prototype, "prevY", {
        get: function () {
            if (!this._prevY) {
                this._prevY = document.createElement('span');
                this._prevY.setAttribute('at', this.config.style.prevY.at);
                this._prevY.innerHTML = this.config.style.prevY.html;
            }
            return this._prevY;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Jdate.prototype, "prevM", {
        get: function () {
            if (!this._prevM) {
                this._prevM = document.createElement('span');
                this._prevM.setAttribute('at', this.config.style.prevM.at);
                this._prevM.innerHTML = this.config.style.prevM.html;
            }
            return this._prevM;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Jdate.prototype, "nextM", {
        get: function () {
            if (!this._nextM) {
                this._nextM = document.createElement('span');
                this._nextM.setAttribute('at', this.config.style.nextM.at);
                this._nextM.innerHTML = this.config.style.nextM.html;
            }
            return this._nextM;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Jdate.prototype, "nextY", {
        get: function () {
            if (!this._nextY) {
                this._nextY = document.createElement('span');
                this._nextY.setAttribute('at', this.config.style.nextY.at);
                this._nextY.innerHTML = this.config.style.nextY.html;
            }
            return this._nextY;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Jdate.prototype, "labelLayer", {
        get: function () {
            if (!this._lableLayer) {
                this._lableLayer = document.createElement('div');
            }
            return this._lableLayer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Jdate.prototype, "labelYear", {
        get: function () {
            if (!this._labelYear) {
                this._labelYear = document.createElement('span');
                this._labelYear.classList.add("label_year");
            }
            return this._labelYear;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Jdate.prototype, "labelMonth", {
        get: function () {
            if (!this._labelMonth) {
                this._labelMonth = document.createElement('span');
                this._labelMonth.classList.add('lable_month');
            }
            return this._labelMonth;
        },
        enumerable: true,
        configurable: true
    });
    Jdate.prototype.initWeek = function () {
        this.view.appendChild(this.weekLayer);
        var len = 7;
        for (var i = 0; i < len; i++) {
            var span = document.createElement('span');
            span.classList.add('week_item');
            span.innerHTML = this.lang('week')[i];
            this.weekLayer.appendChild(span);
        }
    };
    Object.defineProperty(Jdate.prototype, "weekLayer", {
        get: function () {
            if (!this._weekLayer) {
                this._weekLayer = document.createElement('div');
                this._weekLayer.classList.add("week_layer");
            }
            return this._weekLayer;
        },
        enumerable: true,
        configurable: true
    });
    Jdate.prototype.initDates = function () {
        this.view.appendChild(this.dateLayer);
        var len = 42;
        for (var i = 0; i < len; i++) {
            var span = document.createElement('span');
            this.dateLayer.appendChild(span);
        }
        this.renderDates();
    };
    Jdate.prototype.renderDates = function () {
        var Y = this.current.Y, M = this.current.M, D = this.current.D;
        var lastMonthModel = M == 1 ?
            { y: Y - 1, m: 12, d: 31 } :
            { y: Y, m: M - 1, d: this.getDates(Y, M - 1) };
        var thisMonthModel = { y: Y, m: M, d: this.getDates(Y, M) };
        var nextMonthModel = M == 12 ?
            { y: Y + 1, m: 1, d: 31 } :
            { y: Y, m: M + 1, d: 31 };
        this.setLabel(Y, M);
        //重新格式化 M,D (在某些浏览器上 月份,日期要 两位数)
        M = M < 10 ? "0" + M : M;
        var tmpDate = new Date(Y + "-" + M + "-01");
        var thisMonFirstDay = tmpDate.getDay(); //获取这个月 1号 星期几
        var lastMonStartDate = lastMonthModel.d - thisMonFirstDay + 1; //上个月开始日期
        var k = 0;
        //上个月
        for (var i = lastMonStartDate; i < lastMonthModel.d; i++) {
            var node = this.dateLayer.children.item(k);
            node.innerHTML = "<span class='dt before other'>" + i + "</span>";
            var cls = "dt before other ";
            if (lastMonthModel.y == this.today.Y && lastMonthModel.m == this.today.M && i == this.today.D) {
                cls += 'today';
            }
            if (lastMonthModel.y == this.selected.Y && lastMonthModel.m == this.selected.M && i == this.selected.D) {
                cls += 'now';
            }
            var dstr = " data-date='" + JSON.stringify({ Y: lastMonthModel.y, M: lastMonthModel.m, D: i }) + "' ";
            node.innerHTML = "<span class='" + cls + "' " + dstr + " at='dt'>" + i + "</span>";
            k++;
        }
        //这个月
        for (var i = 1; i <= thisMonthModel.d; i++) {
            var node = this.dateLayer.children.item(k);
            var cls = "dt thisMonth ";
            if (this.current.Y == this.today.Y && this.current.M == this.today.M && i == this.today.D) {
                cls += 'today ';
            }
            if (this.current.Y == this.selected.Y && this.current.M == this.selected.M && i == this.selected.D) {
                cls += 'now';
            }
            var dstr = " data-date='" + JSON.stringify({ Y: this.current.Y, M: this.current.M, D: i }) + "' ";
            node.innerHTML = "<span class='" + cls + "' " + dstr + " at='dt'>" + i + "</span>";
            k++;
        }
        //下个月
        for (var i = 1; k <= 41; i++) {
            var node = this.dateLayer.children.item(k);
            var cls = "dt after other ";
            if (nextMonthModel.y == this.today.Y && nextMonthModel.m == this.today.M && i == this.today.D) {
                cls += 'today';
            }
            if (nextMonthModel.y == this.selected.Y && nextMonthModel.m == this.selected.M && i == this.selected.D) {
                cls += 'now';
            }
            var dstr = " data-date='" + JSON.stringify({ Y: nextMonthModel.y, M: nextMonthModel.m, D: i }) + "' ";
            node.innerHTML = "<span class='" + cls + "' " + dstr + " at='dt'>" + i + "</span>";
            k++;
        }
    };
    Jdate.prototype.setLabel = function (Y, M) {
        this.labelYear.innerHTML = Y;
        this.labelMonth.innerHTML = this.lang("month")[M];
    };
    Object.defineProperty(Jdate.prototype, "dateLayer", {
        get: function () {
            if (!this._dateLayer) {
                this._dateLayer = document.createElement('div');
                this._dateLayer.classList.add('date_layer');
            }
            return this._dateLayer;
        },
        enumerable: true,
        configurable: true
    });
    Jdate.prototype.initTool = function () {
        this.view.appendChild(this.toolLayer);
        this.toolLayer.appendChild(this.confirm);
        this.toolLayer.appendChild(this.clean);
        this.toolLayer.appendChild(this.timeButton);
    };
    Object.defineProperty(Jdate.prototype, "toolLayer", {
        get: function () {
            if (!this._toolLayer) {
                this._toolLayer = document.createElement('div');
                this._toolLayer.classList.add('tool_layer');
            }
            return this._toolLayer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Jdate.prototype, "confirm", {
        get: function () {
            if (!this._confirm) {
                this._confirm = document.createElement('span');
                this._confirm.innerHTML = this.lang('confirm');
                this._confirm.setAttribute('at', 'confirm');
            }
            return this._confirm;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Jdate.prototype, "clean", {
        get: function () {
            if (!this._clean) {
                this._clean = document.createElement('span');
                this._clean.innerHTML = this.lang('clean');
                this._clean.setAttribute('at', 'clean');
            }
            return this._clean;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Jdate.prototype, "timeButton", {
        get: function () {
            if (!this._timeButton) {
                this._timeButton = document.createElement('span');
                this._timeButton.innerHTML = this.lang('time');
                this._timeButton.setAttribute('at', 'time');
            }
            return this._timeButton;
        },
        enumerable: true,
        configurable: true
    });
    Jdate.prototype.initTime = function () {
        this.view.appendChild(this.timeLayer);
        this.timeLayer.appendChild(this.timeHead);
        this.timeLayer.appendChild(this.timeTitle);
        this.timeLayer.appendChild(this.timeContent);
        this.timeContent.appendChild(this.hourLayer);
        this.timeContent.appendChild(this.minuteLayer);
        this.timeContent.appendChild(this.secondLayer);
        for (var i = 0; i < 24; i++) {
            var span = document.createElement('div');
            span.innerHTML = i < 10 ? "0" + i : i + "";
            span.setAttribute('at', 'hour');
            this.hourLayer.appendChild(span);
        }
        for (var i = 0; i < 60; i++) {
            var span = document.createElement('div');
            span.innerHTML = i < 10 ? "0" + i : i + "";
            span.setAttribute('at', 'minute');
            this.minuteLayer.appendChild(span);
        }
        for (var i = 0; i < 60; i++) {
            var span = document.createElement('div');
            span.innerHTML = i < 10 ? "0" + i : i + "";
            span.setAttribute('at', 'second');
            this.secondLayer.appendChild(span);
        }
        this.renderTime();
    };
    Jdate.prototype.renderTime = function () {
        var hlen = this.hourLayer.childElementCount;
        for (var i = 0; i < hlen; i++) {
            var node = this.hourLayer.children.item(i);
            if (i == this.current.H) {
                node.classList.add('active');
                this.hourLayer.scrollTo({ top: node.offsetTop, behavior: "smooth" });
            }
            else
                node.classList.remove('active');
        }
        var mlen = this.minuteLayer.childElementCount;
        for (var i = 0; i < mlen; i++) {
            var node = this.minuteLayer.children.item(i);
            if (i == this.current.m) {
                node.classList.add('active');
                this.minuteLayer.scrollTo({ top: node.offsetTop, behavior: "smooth" });
            }
            else
                node.classList.remove('active');
        }
        var slen = this.secondLayer.childElementCount;
        for (var i = 0; i < slen; i++) {
            var node = this.secondLayer.children.item(i);
            if (i == this.current.s) {
                node.classList.add('active');
                this.secondLayer.scrollTo({ top: node.offsetTop, behavior: "smooth" });
            }
            else
                node.classList.remove('active');
        }
    };
    Object.defineProperty(Jdate.prototype, "timeLayer", {
        get: function () {
            if (!this._timeLayer) {
                this._timeLayer = document.createElement('div');
                this._timeLayer.classList.add('time_layer');
                this._timeLayer.style.display = 'none';
            }
            return this._timeLayer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Jdate.prototype, "timeHead", {
        get: function () {
            if (!this._timeHead) {
                this._timeHead = document.createElement('div');
                this._timeHead.classList.add('time_head');
                this._timeHead.innerHTML = this.lang('time');
            }
            return this._timeHead;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Jdate.prototype, "timeTitle", {
        get: function () {
            if (!this._timeTitle) {
                this._timeTitle = document.createElement('div');
                this._timeTitle.classList.add('time_title');
                this._timeTitle.innerHTML = "<span>" + this.lang("hour") +
                    "</span><span>" + this.lang("minute") +
                    "</span><span>" + this.lang("second") + "</span>";
            }
            return this._timeTitle;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Jdate.prototype, "timeContent", {
        get: function () {
            if (!this._timeContent) {
                this._timeContent = document.createElement('div');
                this._timeContent.classList.add('time_content');
            }
            return this._timeContent;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Jdate.prototype, "hourLayer", {
        get: function () {
            if (!this._hourLayer) {
                this._hourLayer = document.createElement('div');
            }
            return this._hourLayer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Jdate.prototype, "minuteLayer", {
        get: function () {
            if (!this._minuteLayer) {
                this._minuteLayer = document.createElement('div');
            }
            return this._minuteLayer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Jdate.prototype, "secondLayer", {
        get: function () {
            if (!this._secondLayer) {
                this._secondLayer = document.createElement('div');
            }
            return this._secondLayer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Jdate.prototype, "view", {
        /**控件对象*/
        get: function () {
            if (!this._view) {
                this._view = document.createElement('j-date');
            }
            return this._view;
        },
        enumerable: true,
        configurable: true
    });
    Jdate.prototype.lang = function (key) {
        return this.lang_value[this.config.lang][key];
    };
    Jdate.prototype.setDate = function () {
        var _this = this;
        var format = this.config.format;
        format = format.replace("YYYY", this.current.Y + "");
        format = format.replace("YY", function () {
            var v = _this.current.Y % 100;
            if (v < 10)
                return "0" + v;
            return v + "";
        });
        format = format.replace("MM", function () {
            return _this.current.M < 10 ? "0" + _this.current.M : "" + _this.current.M;
        });
        format = format.replace("M", "" + this.current.M);
        format = format.replace("DD", function () {
            return _this.current.D < 10 ? "0" + _this.current.D : "" + _this.current.D;
        });
        format = format.replace("D", "" + this.current.D);
        format = format.replace("HH", function () {
            return _this.current.H < 10 ? "0" + _this.current.H : "" + _this.current.H;
        });
        format = format.replace("H", "" + this.current.H);
        format = format.replace("mm", function () {
            return _this.current.m < 10 ? "0" + _this.current.m : "" + _this.current.m;
        });
        format = format.replace("m", "" + this.current.m);
        format = format.replace("ss", function () {
            return _this.current.s < 10 ? "0" + _this.current.s : "" + _this.current.s;
        });
        format = format.replace("s", "" + this.current.s);
        this.target['value'] = format;
    };
    /* 根据年月,获取日期
     注意这里的月份 是实际的月份数
     返回的时候要 -1
     12 >= M >= 1
     * */
    Jdate.prototype.getDates = function (Y, M) {
        var feb = ((Y % 4 == 0 && Y % 100 != 0) || Y % 400 == 0) ? 29 : 28;
        var mons = [31, feb, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        return mons[M - 1];
    };
    /**
    * 更新对象的数据
    * @param {object} data  被更新的对象
    * @param {object} value
    */
    Jdate.prototype.setData = function (data, value) {
        if (!data || !value)
            return;
        for (var x in value) {
            var d = value[x];
            if (this.isArray(d)) {
                data[x] = d;
                continue;
            }
            if (typeof (d) === "object") {
                if (data[x] === void 0)
                    data[x] = {};
                this.setData(data[x], d);
                continue;
            }
            data[x] = d;
        }
    };
    /**
     * 判断是否为数据
     * @param a
     */
    Jdate.prototype.isArray = function (a) {
        return Object.prototype.toString.call(a) == '[object Array]';
    };
    /**
     * 日期正则
     * @param a
     */
    Jdate.prototype.isDate = function (a) {
        var ok = new RegExp("^[0-9]{4}([\-?\/?][0-9]{1,2}){2}([ ][0-9]{1,2}([:][0-9]{1,2}){2}){0,1}$").test(a);
        return ok ? !isNaN(Date.parse(a)) : false;
    };
    Jdate.JdateNo = 1;
    Jdate.container = {};
    Jdate.selector = 'input[jdate]:not([render])';
    return Jdate;
}());
Jdate.init();
//# sourceMappingURL=Jdate.js.map