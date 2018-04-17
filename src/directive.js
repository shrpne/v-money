import {format, unformat, setCursor, event} from './utils'
import assign from './assign'
import defaults from './options'

export default {
  bind(el, binding) {
    if (!binding.value) return

    el = getInput(el)
    el.dataset.vMoneyOptions = JSON.stringify(assign(defaults, binding.value))

    el.onkeydown = function (e) {
      var backspacePressed = e.which == 8 || e.which == 46
      var atEndPosition = (el.value.length - el.selectionEnd) === 0
      if (opt.allowBlank && backspacePressed && atEndPosition && (unformat(el.value, 0) === 0)) {
        el.value = ''
        el.dispatchEvent(event('accept', {
          detail: {
            value: el.value,
            unmaskedValue: unformat(el.value, opt.precision),
          }
        }))
      }
    }

    el.oninput = function () {
      var opt = getOptions(el)
      var positionFromEnd = el.value.length - el.selectionEnd
      el.value = format(el.value, opt)
      positionFromEnd = Math.max(positionFromEnd, opt.suffix.length) // right
      positionFromEnd = el.value.length - positionFromEnd
      positionFromEnd = Math.max(positionFromEnd, opt.prefix.length + 1) // left
      setCursor(el, positionFromEnd)
      el.dispatchEvent(event('accept', {
        detail: {
          value: el.value,
          unmaskedValue: unformat(el.value, opt.precision),
        }
      }))
    }

    el.addEventListener('updateFormat', function(e) {
      var opt = getOptions(el)
      el.value = format(el.value, opt)
    })

    el.onfocus = function () {
      var opt = getOptions(el)
      setCursor(el, el.value.length - opt.suffix.length)
    }

    el.dispatchEvent(event('input')) // force format after initialization
  },
  update(el, binding) {
    if (!binding.value) return

    el = getInput(el)
    el.dataset.vMoneyOptions = JSON.stringify(assign(defaults, binding.value))

    el.dispatchEvent(event('updateFormat')) // force format after update
  }
}

function getInput(el) {
  // v-money used on a component that's not a input
  if (el.tagName.toLocaleUpperCase() !== 'INPUT') {
    var els = el.getElementsByTagName('input')
    if (els.length !== 1) {
      // throw new Error("v-money requires 1 input, found " + els.length)
    } else {
      el = els[0]
    }
  }
  return el
}

function getOptions(el) {
  return JSON.parse(el.dataset.vMoneyOptions)
}
