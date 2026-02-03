// @ts-nocheck
// Do not edit above line - it must be first line of code
// Above line disables TypeScript (.ts) checker, which flags JavaScript automatic type conversions as errors.
// ESLint checker is used for all .js file checks. See file .eslintrc.js.
// Some eslint-disable-next-line comments are present

// ///////////////////////////////////////////////////////
// File Constants.js (Must load from Astron.html BEFORE Astron.js)
//
// Initialise constants that a specialist OFFLINE user might wish to change (within reasonable amounts!).
// No need to rebuild following changes. Just reload Astron.html.
// File Globals.js holds non-user constants and is included in Astron.js build.
// Note Settings page holds items that a normal user might wish to change.
//
// To edit booleans: change 'true' to 'false' or vv
//
// ///////////////////////////////////////////////////////

// ====== Temporary globals for research, debug, etc
// let DEBUG = false;

//  ======= Refraction
// Uncomment only one of below
const REFRACTION_METHOD = "BENNETT_REFINED";          // Default: Meeus' 16.3A.  Bennett's refined formula
    // const REFRACTION_METHOD = "BENNETT_ORIGINAL";   // Bennett's original formula
    // const REFRACTION_METHOD = "SOFA";               // Standards of Fundamental Astronomy method
                                                       // Don't use SOFA below 20° - astronomy only
    // const REFRACTION_METHOD = "NONE";               // Developer use only

//  ======= Dip
const RADIUS_FACTOR = 1.2;  // Default value of 1.2 gives same result as traditional dip formula
                            // Range 1.0 - 1.5
                            // Rf = 1.0 equivalent to no atmosphere

// ======= Moon only items
// Augmentation
const AUG_METHOD = "RIGOROUS";
    // const AUG_METHOD = "MEEUS";
// Parallax
    // Use coordinate transformation i/o parallax formula ONLY when Moon altitude within ..
    // .. this amount of calculated altitude for assumed position.
const CLOSE_TO_AP = 0.1;    // Degrees

// ====== Home Page
// Alitude corrections block
const MAX_HoE_METRES = 300;      // Entry limit
// Home Page - Sextant Arc block
const MIN_Hc_FOR_ARC = 0;        // Don't calc sextant arc if either body Hc below this.
// Home Page - Dip Short block
const DIP_SHORT_MAX_HoE = 15.3;  // Entry limit (15.3m = 50ft)

// SightLog page
const MAX_INTERCEPT = 200;       // SightLog button faded if intercept over this value
const MAX_PLOT_INTERCEPT = 500;  // Intercept not plotted if over this value - CoP still plotted

// Lunar page
const QI_WARNING_LEVEL = 40;      // Give warning & don't show UT or Long if below x
const QI_CAUTION_LEVEL = 60;      // Give caution if below x
const QI_MIN_CALC_LAT = 26;       // Don't show lat (nor long by calc lat cells) if below x
const QI_MIN_CALC_LONG = 40;      // Don't show long by Ass lat cells if below x
const QI_REDUCE_BELOW_ALT = 20;   // Further reduce QI if body altitude below this
const MIN_ARC = 1;                // WARNING if lunar arc less than x
const MAX_ARC = 135;              // WARNING if lunar arc greater than x
const MIN_SUN_ELONGATION = 15;    // Practical near limit on observing crescent moon
const MAX_ARC_DIFF = 5;           // WARNING if diff entered and calculated lunar arc exceeds x
const MAX_ALT_DIFF = 15;          // WARNING if Hs differs from Hc by more than x
const MAX_LATITUDE = 80;          // Don't process lunars above this
const LUNAR_LONG_MAX_ALT = 75;    // Don't calc long from lunar if alt above this
const LLoP_SEMI_BLOCK_SIZE = 10;  // Degrees. Search block A_LAT & A_LONG +/- this value
const CHART_WIDTH_IF_LLoP = 1000; // Initial sight plotter chart width if any LLoPs in sight log
const MIN_ALT_FOR_LLoP = 5;       // LLoP point not plotted if alt of Moon or body below this.
const DAYLIGHT_SUN_ALT = -3;      // Caution if Sun above this for stars & planets (ex Venus)
const MAX_TIME_DIFF = 0.1;        // Caution if diff between entered and calculated time exceeds x (hours!)
const ALIGNMENT_MULTIPLIER = 1.85;// Used to shape alignment QI calculation

// Mer Passage page
const MAX_MP_ALT_DIFF = 5;        // Caution if Max diff between Ho and Hc
const MER_PASS_RANGE = 10;        // Max LHA Degrees +/- of meridian to calc mer passage

// Day Almanac page .. lunars panel
const DA_LUNAR_LOG = false;         // Default false.
                                    // true outputs full data array to console. (Windows F12).
                                    // To explore, expand such array to deeper levels
                                    // First level shows all bodies, one per line
                                    // Second level shows data for selected body for each hour interval (1, 2 or 3)
                                    // Third level shows data for selected hour for selected body.
                                    //     'ThisHour' shows 'valid' if GLD displayed on main table.
                                    //     Otherwise, it shows FIRST filter's reason for inhibiting display of GLD.
                                    //     There may be others that would also inhibit!
                                    //     List of filters and settings follow.

const DA_FAINTEST_MAG = 2.0;        // Filter A. Inhibit if dimmer than this
const DA_MAX_MISALIGNMENT = 30;     // Filter B: Inhibit if alignment from Moon's motion more than this
                                    // Filter C: No constant. Sun between Moon and Body (except Sun & Venus lunars)
const DA_MIN_SUN_ELONGATION = 15;   // Filter D: Moon crescent too slim
                                        // Value not necessarily same as MIN_SUN_ELONGATION in Lunar page above
                                        // Covers when Sun below horizon else G: below dominates
const DA_MIN_SUN_BODY_ARC = 15;     // Filter E: Sun depression 3° (or more) plus min body altitude of 10°
                                        // (If Sun above -3, H3 dominates)
const DA_MIN_GLD = 1;               // Filter F1: Geocentric LD algorithm weak if bodies nearer than this
const DA_MAX_GLD = 125;             // Filter F2: Inhibit if GLD above this
const DA_MIN_DAYLIGHT_LD = 30;      // Filter G1: Moon not visible in daylight below this from Sun
const DA_MIN_DAYLIGHT_SD = 30;      // Filter G2: Venus not visible in daylight below this from Sun
const DA_BODY_MIN_Hc = 10;          // Filter H1: Inhibit if body below this
const DA_MOON_MIN_Hc = 10;          // Filter H2: Inhibit if Moon below this
const DA_DAYLIGHT_SUN_ALT = -3;     // Filter H3: Inhibit if daylight (except Sun or Venus)
                                        // Value may differ from DAYLIGHT_SUN_ALT in Lunar page above
const DA_DISCARD_ISOLATED = true;   // Filter I. Inhibit if no value in previous AND next hour interval.
                                        // (0000 and 2400 never inhibited for this reason)

// Day Almanac page .. SRT panel
const DA_SRT_LOG = false;           // Default false.
                                        // true outputs full data array to console. (Windows F12)
                                        // Debugging code: only of interest to the exceptionally curious!
