import { ColorType, Color } from './Color'
import { ColorShadeType, ColorShader } from './ColorShader'
import { hex } from './ColorUtilTypes'

export type PaletteColorRole =
   | 'primary'
   | 'secondary'
   | 'tertiary'
   | 'warning'
   | 'success'
   | 'info'
   | 'danger'
   | 'neutral'

export interface PaletteColorType {
   role: string
   name: string
   shade: ColorShadeType
   isLocked: boolean
   color: ColorType

   toggleLock: (lock: boolean) => PaletteColorType
   setColor: (hex: hex) => PaletteColorType
}

export class PaletteColor implements PaletteColorType {
   role: string
   name: string
   shade: ColorShadeType
   isLocked: boolean
   color: ColorType

   constructor({ role, name, hex }: { role: string; name: string; hex: hex }) {
      this.role = role
      this.name = name // here should be colors name 
      this.isLocked = false
      this.color = new Color({ hex })
      this.shade = new ColorShader({ color: this.color })
   }

   toggleLock(lock: boolean) {
      this.isLocked = lock
      return this
   }

   setColor(hex: hex) {
      this.color = new Color({ hex })
      return this
   }
}
