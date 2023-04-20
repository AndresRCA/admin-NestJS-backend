export interface IStyleRules {
  /**
   * usually a font awesome icon class (e.g. fa-globe, fa-refresh)
   */
  icon?: string;
  /**
   * refers to the space the form can occupy a screen
   */
  width?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  /**
   * a class name or hex color code
   */
  color: string;
}