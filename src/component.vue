<template lang="html">
  <input type="tel"
         :value="formattedValue"
         @accept="accept"
         v-money="{precision, decimal, thousands, prefix, suffix}"
         class="v-money" />
</template>

<script>
import money from './directive'
import defaults from './options'
import {format} from './utils'

export default {
  name: 'Money',
  props: {
    value: {
      required: true,
      type: [Number, String],
      default: 0
    },
    masked: {
      type: Boolean,
      default: false
    },
    precision: {
      type: Number,
      default: () => defaults.precision
    },
    decimal: {
      type: String,
      default: () => defaults.decimal
    },
    thousands: {
      type: String,
      default: () => defaults.thousands
    },
    prefix: {
      type: String,
      default: () => defaults.prefix
    },
    suffix: {
      type: String,
      default: () => defaults.suffix
    }
  },

  directives: {money},

  data () {
    return {
      formattedValue: ''
    }
  },

  watch: {
    value: {
      immediate: true,
      handler (newValue, oldValue) {
        var formatted = format(newValue, this.$props)
        if (formatted !== this.formattedValue) {
          this.formattedValue = formatted
        }
      }
    }
  },

  methods: {
    accept (evt) {
      this.$emit('input', this.masked ? evt.target.value : evt.detail.unmaskedValue)
    }
  }
}
</script>
