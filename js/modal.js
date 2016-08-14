Array.prototype.contains = function (el) {
  return this.indexOf(el) > -1;
};
Node.prototype.removeClasses = function (arr) {
  this.className = this.className.split(/\s+/).filter(function (c) {
    return !arr.contains(c) && c.length;
  }).join(' ');
};
Node.prototype.addClass = function (c) {
  this.className += (/\s$/.test(this.className) || !this.className.length ? '' : ' ') + c;
};
var ModalJS = {
    version: '1.1'
    , modal: function (type) {
      var modal = {
        bg: '#modaljs-bg'
        , modals: '#modaljs-modals'
        , modal: '#modaljs-modal'
        , top: '#modaljs-top'
        , topCancel: '#modaljs-top-cancel'
        , middle: '#modaljs-middle'
        , bottom: '#modaljs-bottom'
        , bottomCancel: '#modaljs-bottom-cancel'
        , bottomConfirm: '#modaljs-bottom-confirm'
        , transitionType: '#modaljs-transitionType'
      };
      return ModalJS.sel(modal[type]);
    }
    , modalTypes: [
		'modal'
		, 'success'
		, 'alert'
		, 'warning'
		, 'error'
	]
    , sizeTypes: [
		'small'
		, 'medium'
		, 'big'
	]
    , monoTypes: [
		'mono'
		, 'colored'
	]
    , positionTypes: [
		'stickedToTop'
		, 'top'
		, 'middle'
		, 'bottom'
		, 'stickedToBottom'
	]
    , confirmFn: function () {}
    , isShown: function () {
      return modaljs.modal('modals').style.display != 'none';
    }
    , sel: function (s, b) {
      return b ? document.querySelectorAll(s) : document.querySelector(s);
    }
    , addEvent: function (el, name, func) {
      // addEvent
      var aE = function (el, name, func) {
          if (el.addEventListener) el.addEventListener(name, func, false);
          else if (el.attachEvent) el.attachEvent('on' + name, func);
          else el['on' + name] = func;
        }
        , i;
      switch (typeof el) {
      case 'object':
        if (el instanceof Node) {
          aE(el, name, func);
        }
        else if (el instanceof Array) {
          for (i = el.length - 1; i >= 0; i--) aE(el[i], name, func);
        }
        break;
      default:
        throw new Error('el must be object or instance of an array!');
      }
    }
    , init: function (props) {
      var modalHTML = '<div id="modaljs-modals" style="opacity:0;display:none"><div id="modaljs-bg"></div><div id="modaljs-modal" class="modaljs-normal"><div id="modaljs-top"></div><div id="modaljs-top-cancel"></div><div id="modaljs-middle"></div><div id="modaljs-bottom"><input type="button" id="modaljs-bottom-confirm" value="Ok"></div><input type="hidden" id="modaljs-transitionType"></div></div>';
      document.body.insertAdjacentHTML('beforeend', modalHTML);
      var that = this;
      this.addEvent([
			this.modal('topCancel')
			, this.modal('bg')
		], 'click', function () {
        that.hideModal();
      });
      this.addEvent(this.modal('bottomConfirm'), 'click', function () {
        that.hideModal();
        that.confirmFn();
      });
    }
    , show: function (props) {
      if (arguments.length < 1) throw new Error('ModalJS.show() needs at least one argument!');
      if (typeof props != 'object') throw new Error('Properties must be an object!');
      if (!props.hasOwnProperty('top') || !props.hasOwnProperty('middle')) throw new Error('Properties in ModalJS.show() must include at least "top" and "middle" properties!');
      if (!this.sel('#modaljs-modals', true).length) this.init(props);
      // setting up transitionType hidden input
      this.modal('transitionType').value = props.hasOwnProperty('transition') && ['fast', 'normal', 'slow'].indexOf(props.transition) > -1 ? props.transition : 'fast';
      var getProp = function (o, prop, def) {
        if (typeof def != 'boolean') def = false;
        if (!o.hasOwnProperty(prop)) return def;
        return o[prop];
      };
      var modals = this.modal('modals')
        , confirm = this.modal('bottomConfirm')
        , modalType = getProp(props, 'type', 'modal')
        , monoType = getProp(props, 'mono')
        , isBG = getProp(props, 'background', true)
        , sizeType = getProp(props, 'size', 'small')
        , positionType = getProp(props, 'position', 'middle');
      // setting 'type'
      if (!this.modalTypes.contains(modalType)) modalType = 'modal';
      modals.removeClasses(this.modalTypes);
      modals.addClass(modalType);
      monoType = monoType ? 'mono' : 'colored';
      if (!this.monoTypes.contains(monoType)) monoType = 'colored';
      this.modal('modal').removeClasses(this.monoTypes);
      this.modal('modal').addClass(monoType);
      // setting 'bg'
      this.modal('bg').style.display = this.modal('modal').style.boxShadow = isBG ? '' : 'none';
      // setting 'size'
      if (!this.sizeTypes.contains(sizeType)) sizeType = 'small';
      this.modal('modal').removeClasses(this.sizeTypes);
      this.modal('modal').addClass(sizeType);
      // setting 'position'
      if (!this.positionTypes.contains(positionType)) positionType = 'middle';
      this.modal('modal').removeClasses(this.positionTypes);
      this.modal('modal').addClass(positionType);
      // setting 'confirm'
      confirm.style.display = 'none';
      if (props.hasOwnProperty('confirm') && props.confirm.hasOwnProperty('text') && props.confirm.hasOwnProperty('click')) {
        var text = props.confirm.text
          , click = props.confirm.click
        if (typeof text == 'string' && typeof click == 'function') {
          confirm.style.display = 'inline-block';
          text = text || 'Ok';
          confirm.value = text;
          confirm.focus();
          this.confirmFn = click;
        }
      }
      this.showModal(modals, this.modal('transitionType'));
      var w = window;
      // setting 'background'
      this.modal('top').innerHTML = props.top;
      this.modal('middle').innerHTML = props.middle;
      // setting up modal top position
      this.modal('modal').style.margin = (positionType == 'middle' ? (-(this.modal('modal').offsetHeight / 2) - (props.hasOwnProperty('offsetTop') && typeof props.offsetTop == 'number' ? props.offsetTop : 0)) : '0') + 'px 0 0 ' + (-(this.modal('modal').offsetWidth / 2)) + 'px';
    }
    , showModal: function () {
      if (modaljs.isShown()) throw new Error('You can\'t show an actual shown modal!');
      var modals = this.modal('modals')
        , transitionType = this.modal('transitionType')
        , transitions = {
          fast: 0
          , normal: 300
          , slow: 600
        };
      var transitionsKeys = Object.keys(transitions);
      modals.removeClasses(transitionsKeys);
      modals.addClass(transitionType.value);
      modals.style.display = '';
      setTimeout(function () {
        modals.style.opacity = '1';
      }, transitions[transitionType.value]);
    }
    , hideModal: function () {
      if (!modaljs.isShown()) throw new Error('You can\'t hide an actual hidden modal!');
      var modals = this.modal('modals')
        , transitionType = this.modal('transitionType')
        , transitions = {
          fast: 0
          , normal: 300
          , slow: 600
        };
      modals.style.opacity = '0';
      setTimeout(function () {
        modals.style.display = 'none';
      }, transitions[transitionType.value]);
    }
  }
  , modaljs = ModalJS;

module.exports.modal = modaljs;
