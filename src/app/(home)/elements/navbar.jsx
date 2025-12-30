const WIDTH = 320
const HEIGHT = 48
const CORNER_RADIUS = 12
const CUTOUT_RADIUS = 30
const CUTOUT_LEFT_X = WIDTH / 2 - CUTOUT_RADIUS
const CUTOUT_RIGHT_X = WIDTH / 2 + CUTOUT_RADIUS

/**
 * Line by line explanation
 * - Start in the bottom-left
 * - Draw a line towards the top-left to the start of our corner radius,
 *    use the top-left as the curve control point,
 *    and curve to the other end of our corner radius
 * - Draw a line to the left edge of our cutout
 * - Draw an elliptical arc with an equal x and y radius to create a circle,
 *     have 0 rotation on the x-axis,
 *     use the smaller arc (we could use either as they are equal),
 *     sweep the arc in a counter-clockwise direction,
 *     complete the arc on the right cutout point
 * - Draw a line towards the top-right to the start of our corner radius,
 *    use the top-right as the curve control point,
 *    and curve to the other end of our corner radius
 * - Draw a line to bottom-right
 * - Close the path
 */
const d = `
M0,${HEIGHT}
L0,${CORNER_RADIUS} Q0,0 ${CORNER_RADIUS},0
L${CUTOUT_LEFT_X},0
A${CUTOUT_RADIUS},${CUTOUT_RADIUS} 0 0 0 ${CUTOUT_RIGHT_X},0
L${WIDTH - CORNER_RADIUS},0 Q${WIDTH},0 ${WIDTH},${CORNER_RADIUS}
L${WIDTH},${HEIGHT}
Z
`

export default function Shape() {
  return (
    <svg width={WIDTH} height={HEIGHT}>
      <path d={d} />
    </svg>
  )
}