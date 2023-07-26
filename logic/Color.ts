import { hex, rgb, hsl, hsv } from './ColorUtilTypes'
export interface ColorType {
   hex: hex
   rgb: rgb
   hsl: hsl
   hsv: hsv
   _normalize(rgb: rgb): rgb
   _hueToRgbVal(p: number, q: number, t: number): number
}

export class Color implements ColorType {
   hex: string
   rgb: rgb
   hsl: hsl
   hsv: hsv

   public constructor({ hex, rgb, hsl, hsv }: { hex?: hex; rgb?: rgb; hsl?: hsl; hsv?: hsv }) {
      // initialize the color

      if (hex) {
         this.hex = hex
         this.rgb = this.hexToRgb(hex)
         this.hsl = this.rgbToHsl(this.rgb)
         this.hsv = this.rgbToHsv(this.rgb)
      } else if (rgb) {
         this.rgb = rgb
         this.hex = this.rgbToHex(rgb)
         this.hsl = this.rgbToHsl(rgb)
         this.hsv = this.rgbToHsv(rgb)
      } else if (hsl) {
         this.hsl = hsl
         this.rgb = this.hslToRgb(hsl)
         this.hex = this.rgbToHex(this.rgb)
         this.hsv = this.rgbToHsv(this.rgb)
      } else if (hsv) {
         this.hsv = hsv
         this.rgb = this.hsvToRgb(hsv)
         this.hsl = this.rgbToHsl(this.rgb)
         this.hex = this.rgbToHex(this.rgb)
      } else {
         this.hex = '#ffffff'
         this.rgb = { r: 255, g: 255, b: 255 }
         this.hsl = { h: 0, s: 0, l: 1 }
         this.hsv = { h: 0, s: 0, v: 1 }
      }
   }

   hexToRgb(hex: hex): rgb {
      // Parse the hex string into its individual parts
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
      // If the hex string is invalid, return an empty object
      if (!result) {
         return { r: 0, g: 0, b: 0 }
      }

      // Convert the hex parts to decimal values and
      // return an RGB object
      return {
         r: parseInt(result[1], 16),
         g: parseInt(result[2], 16),
         b: parseInt(result[3], 16),
      }
   }

   rgbToHsl(rgb: rgb): hsl {
      let { r, g, b } = rgb
      ;(r /= 255), (g /= 255), (b /= 255)

      var max = Math.max(r, g, b),
         min = Math.min(r, g, b)
      var h,
         s,
         l = (max + min) / 2

      if (max == min) {
         h = s = 0 // achromatic
      } else {
         var d = max - min
         s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

         switch (max) {
            case r:
               h = (g - b) / d + (g < b ? 6 : 0)
               break
            case g:
               h = (b - r) / d + 2
               break
            case b:
               h = (r - g) / d + 4
               break
         }
         if (!h) return { h: 0, s: +s.toFixed(2), l: +l.toFixed(2) }
         // h /= 6
      }
      // Scale the hue value to the range [0, 360] and return an
      // HSL object
      return {
         h: Math.round(h * 60),
         s: s,
         l: l,
      }
   }

   rgbToHsv(rgb: rgb): hsv {
      const { r, g, b } = rgb
      const rabs = r / 255
      const gabs = g / 255
      const babs = b / 255
      const v = Math.max(rabs, gabs, babs)
      const diff = v - Math.min(rabs, gabs, babs)
      const diffc = (c: number) => (v - c) / 6 / diff + 1 / 2
      const percentRoundFn = (num: number) => Math.round(num * 100) / 100

      let h = 0
      let s = 0

      if (diff !== 0) {
         s = diff / v
         const rr = diffc(rabs)
         const gg = diffc(gabs)
         const bb = diffc(babs)

         if (rabs === v) {
            h = bb - gg
         } else if (gabs === v) {
            h = 1 / 3 + rr - bb
         } else if (babs === v) {
            h = 2 / 3 + gg - rr
         }
         if (h < 0) {
            h += 1
         } else if (h > 1) {
            h -= 1
         }
      }
      return {
         h: Math.round(h * 360),
         s: percentRoundFn(s),
         v: percentRoundFn(v),
      }
   }

   hslToRgb(hsl: hsl): rgb {
      const { h, s, l } = hsl
      const k: (n: any) => number = n => (n + h / 30) % 12
      const a = s * Math.min(l, 1 - l)
      const f: (n: any) => number = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))

      return {
         r: +(255 * f(0)).toFixed(0),
         g: +(255 * f(8)).toFixed(0),
         b: +(255 * f(4)).toFixed(0),
      }
   }

   hsvToRgb({ h, s, v }: hsv): rgb {
      // Initialize the red, green, and blue values to zero
      let r = 0
      let g = 0
      let b = 0

      // Calculate the temporary values for the red, green, and blue channels
      const i = Math.floor(h * 6)
      const f = h * 6 - i
      const p = v * (1 - s)
      const q = v * (1 - f * s)
      const t = v * (1 - (1 - f) * s)

      // Calculate the red, green, and blue values using the hue value
      switch (i % 6) {
         case 0:
            r = v
            g = t
            b = p
            break
         case 1:
            r = q
            g = v
            b = p
            break
         case 2:
            r = p
            g = v
            b = t
            break
         case 3:
            r = p
            g = q
            b = v
            break
         case 4:
            r = t
            g = p
            b = v
            break
         case 5:
            r = v
            g = p
            b = q
            break
      }

      // Scale the red, green, and blue values to the range [0, 255] and return an RGB object
      return {
         r: r * 255,
         g: g * 255,
         b: b * 255,
      }
   }

   rgbToHex({ r, g, b }: rgb): hex {
      return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)
   }

   // Helper functions
   _normalize({ r, g, b }: rgb): rgb {
      return {
         r: (r /= 255),
         g: (g /= 255),
         b: (b /= 255),
      }
   }

   _hueToRgbVal(p: number, q: number, t: number): number {
      // A helper function to calculate the
      // red, green, or blue value from the hue
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
   }
}
