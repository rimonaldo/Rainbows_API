import { Palette, PaletteType } from './Palette'
import { PaletteColorType, PaletteColorRole } from './PaletteColor'
import { hsl } from './ColorUtilTypes'
import { Color } from './Color'
type PtsObj = { avgHue: number; pts: number[] }
/**
 * PaletteGenerator
 *
 * @param palette - palette object
 *
 */
export interface PaletteGeneratorType {
   // palette: PaletteType
   primary: PaletteColorType
   secondary: PaletteColorType
   tertiary: PaletteColorType
   neutral: PaletteColorType
   info: PaletteColorType
   warning: PaletteColorType
   danger: PaletteColorType
   success: PaletteColorType
   genBrandColors: (temp: number, fluidity: number) => PaletteType
   // genSemanticColors: (temp: number, fluidity: number) => PaletteType
   // genNeutralColors: (temp: number, fluidity: number) => PaletteType
   // _genPaletteColor: (temp: number, role: PaletteColorRole, style: 'neon' | 'pastel' | 'earth' | 'jewel') => PaletteType

   // setPaletteColor: (hsl: hsl, role: PaletteColorRole) => PaletteType
   // toggleColorLock: (colorRole: PaletteColorRole) => PaletteType

   // getPtsObj: () => PtsObj
}

export class PaletteGenerator implements PaletteGeneratorType {
   primary: PaletteColorType
   secondary: PaletteColorType
   tertiary: PaletteColorType
   neutral: PaletteColorType
   info: PaletteColorType
   warning: PaletteColorType
   danger: PaletteColorType
   success: PaletteColorType
   constructor({ palette }: { palette: PaletteType }) {
      this.primary = palette.primary
      this.secondary = palette.secondary
      this.tertiary = palette.tertiary
      this.neutral = palette.neutral
      this.info = palette.info
      this.warning = palette.warning
      this.danger = palette.danger
      this.success = palette.success
   }

   // palette: PaletteType
   genBrandColors(temp: number = 1, fluidity: number = 1, style: 'neon' | 'pastel' | 'earth' | 'jewel' = 'pastel') {
      // Extract color properties
      const { primary, secondary, tertiary } = this
      const brandColors = [primary, secondary, tertiary]

      // Filter unlocked and locked colors
      const unlockedColors = brandColors.filter(color => !color?.isLocked)
      const anchors = brandColors.filter(color => color?.isLocked)

      console.log(anchors)

      // calculate unlocked colors based on anchors:
      // 1. if there is only one anchor, generate two colors
      // 2. if there are two anchors, generate one color
      // 3. if there are no anchors, generate three colors

      // Generate random styles list
      const randStylesList = this._generateRandomStylesList(unlockedColors.length)
      console.log(randStylesList)

      // Calculate average hue and points
      const avgHue = this._calculateAvgHue(temp as 1 | 2 | 3)
      const randomHarmonyTitle = this.getRandHarmonyTitle()
      const overallDist = this.getAngleFromHarmonyTitle(randomHarmonyTitle)
      const distfromAvg = overallDist * fluidity
      let generatedHues = this._separateAvgHue(avgHue, distfromAvg, unlockedColors.length)
      generatedHues = [avgHue, generatedHues[0], generatedHues[1]]

      // Update unlocked colors with new HSL values
      // this._updateUnlockedColors(unlockedColors, randStylesList, generatedHues)

      // Return average hue and points
      // return { avgHue, pts: generatedHues }
      return new Palette({ primary: this.primary, secondary: this.secondary, tertiary: this.tertiary, neutral: this.neutral, info: this.info, warning: this.warning, danger: this.danger, success: this.success })
   }

   private _updateUnlockedColors(unlockedColors: PaletteColorType[], randStylesList: string[], pts: number[]) {
      unlockedColors.forEach((color, i) => {
         const randStyle = randStylesList[i]
         const hsl = this._calculateHSL(randStyle, pts[i])
         let colorRole = color.role as PaletteColorRole
         // this._updateColors(colorRole, hsl)
      })

      // this.palette.primary = this.colors.primary
      // this.palette.secondary = this.colors.secondary
      // this.palette.tertiary = this.colors.tertiary
      // console.log(this.tertiary)
   }
   // _updateColors(colorRole: PaletteColorRole, hsl: { h: number; s: number; l: number }) {
   //    this.colors[colorRole] = new PaletteColor({
   //       role: colorRole,
   //       color: new Color({ hsl }),
   //    })
   // }

   _calculateHSL(randStyle: string, h: number) {
      const { s, l } = this._randSatLumByPaletteStyle(randStyle)
      return { h, s, l }
   }
   private _randSatLumByPaletteStyle = (colorStyleKey: keyof typeof paletteStyle) => {
      const { sat, lum } = paletteStyle[colorStyleKey]
      const s = +(Math.random() * (sat.max - sat.min) + sat.min).toFixed(2)
      const l = +(Math.random() * (lum.max - lum.min) + lum.min).toFixed(2)
      return { s, l }
   }

   _calculateAvgHue(temp: 1 | 2 | 3) {
      return this._randHueInTempRange(temp)
   }

   private _randHueInTempRange = (temp: 1 | 2 | 3) => {
      const range1 = [180, 270]
      const range2 = [[60, 180]]
      const ranges3 = [
         [0, 60],
         [300, 360],
      ]

      const rand = (min: number, max: number) => +Math.random() * (max - min) + min

      if (temp === 1) {
         return +rand(range1[0], range1[1]).toFixed(0)
      } else if (temp === 2) {
         const range = range2[Math.floor(Math.random() * range2.length)]
         return +rand(range[0], range[1]).toFixed(0)
      } else if (temp === 3) {
         const range = ranges3[Math.floor(Math.random() * ranges3.length)]
         return +rand(range[0], range[1]).toFixed(0)
      }

      return 0
   }

   private getAngleFromHarmonyTitle(harmonyTitle: HarmonyTitle) {
      switch (harmonyTitle) {
         case 'complementary':
            return 180
         case 'analogous':
            return 30
         case 'triadic':
            return 120
         case 'monochromatic':
            return 0
         case 'tetradic':
            return 90
         case 'comp-split-left':
            return 150
         case 'comp-split-right':
            return 210

         default:
            return 0
      }
   }

   private _separateAvgHue(avgHue: number, distfromAvg: number, length: number) {
      return this._sepetareAvgToTwoPoints(avgHue, distfromAvg, length)
   }
   private _sepetareAvgToTwoPoints = (avg: number, distance: number, amount = 2) => {
      let ratio = [1, 1]

      if (amount === 3) {
         ratio = [1, 2]
      }

      const sum = ratio.reduce((a, b) => a + b)
      const ratio1 = ratio[0] / sum
      const ratio2 = ratio[1] / sum

      // if point is over 360, then substract 360

      let pt1 = avg - distance * ratio1
      let pt2 = avg + distance * ratio2

      if (pt1 < 0) {
         pt1 = 360 + pt1
      }

      if (pt2 > 360) {
         pt2 = pt2 - 360
      }

      return [+pt1.toFixed(0), +pt2.toFixed(0)]
   }

   private getRandHarmonyTitle() {
      const harmonyTitles = [
         'complementary',
         'analogous',
         'triadic',
         'monochromatic',
         'comp-split-left',
         'comp-split-right',
         'tetradic',
      ]
      const randIndex = Math.floor(Math.random() * harmonyTitles.length)
      return harmonyTitles[randIndex] as HarmonyTitle
   }

   _generateRandomStylesList(length: number) {
      const styles: string[] = ['neon', 'pastel', 'earth', 'jewel', 'jewel', 'jewel']
      const randStyles: string[] = []
      for (let i = 0; i < length; i++) {
         const randIndex = Math.floor(Math.random() * styles.length)
         randStyles.push(styles[randIndex])
      }
      return randStyles
   }
}

export enum HarmonyTitle {
   Monochromatic = 'monochromatic',
   Triadic = 'triadic',
   Complementary = 'complementary',
   Analogous = 'analogous',
   CompSplitLeft = 'comp-split-left',
   CompSplitRight = 'comp-split-right',
   Tetradic = 'tetradic',
}
const paletteStyle: { [key: string]: ColorStyleRangeType } = {
   pastel: { sat: { min: 0.3, max: 0.45 }, lum: { min: 0.8, max: 0.9 } },
   neutral: { sat: { min: 0.05, max: 0.15 }, lum: { min: 0.75, max: 0.9 } },
   neon: { sat: { min: 0.95, max: 1 }, lum: { min: 0.6, max: 0.7 } },
   earth: { sat: { min: 0.2, max: 0.35 }, lum: { min: 0.2, max: 0.4 } },
   jewel: { sat: { min: 0.5, max: 0.65 }, lum: { min: 0.5, max: 0.7 } },
}
type ColorStyleRangeType = {
   sat: { min: number; max: number }
   lum: { min: number; max: number }
}
