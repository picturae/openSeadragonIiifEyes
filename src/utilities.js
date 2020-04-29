/**
 * Test for values with which calculations can be done
 * @private
 * @param {arguments} anonymus - one or more values to test
 * @returns {boolean} is a useable number
 */
const isUsableNumber = function() {
    let isUsable = Boolean(arguments.length)
    Array.from(arguments).forEach(value => {
        isUsable =
            isUsable && typeof value === 'number' && Number.isFinite(value)
    })
    return isUsable
}

/**
 * Round at decimals
 * @private
 * @param {number} number - any number to round
 * @param {number} decimals - number of decimals to round at
 * @returns {number} the rounded number
 */
const roundAt = function(number, decimals) {
    if (number < 1 + 'e-' + decimals && number > -1 + 'e-' + decimals) {
        return 0
    }
    // https://www.jacklmoore.com/notes/rounding-in-javascript/
    return Number(Math.round(number + 'e' + decimals) + 'e-' + decimals)
}

export { isUsableNumber, roundAt }
