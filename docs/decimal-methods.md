# Decimal Methods

> Note: the syntax of these functions/methods is `decimalObject.methodName(...parameters)`.
> For example, to add `number` to `decimalNumber` with `add()`:
>
> ```js
> decimalNumber = decimalNumber.add(number)
> ```
>
> Decimals can be created with `new Decimal(value)`.
> Above the normal number limit (`1.79e308`), `value` has to be a string, not a number, or else it will be interpreted as `Infinity`.

## Format Conversions

These methods that start with "from" can be used directly on the class, like so:

```js
decimalNumber = Decimal.fromMantissaExponent(4, 10) // 4e10
```

`fromComponents(sign, layer, mag)`, `fromMantissaExponent(mantissa, exponent)`
> Converts various components to decimals.

`fromComponents_noNormalize(sign, layer, mag)`, `fromMantissaExponent_noNormalize(mantissa, exponent)`
> Same as above, but does not normalize the output.

`fromDecimal(value)`, `fromNumber(value)`, `fromString(value)`
> Returns the value after converting it to a Decimal.

`fromValue(value)`
> Same as above, but accepts any input type.

`toNumber()`, `mantissaWithDecimalPlaces()`, `magnitudeWithDecimalPlaces()`, `toString()`, `toExponential()`, `toFixed()`, `toPrecision()`, `valueOf()`, `toJSON()`, `toStringWithDecimalPlaces()`
> Returns the converted decimal for the type/format above.

## Basic Math

`abs()`
> Absolute value for decimals.

`neg()`, `negate()`, `negated()`
> Reverses the decimals' sign (positive to negative and vise versa).

`sign()`, `sgn()`
> For positive input, returns 1. For negative, returns -1. For positive and negative zeros, returns itself.

`round()`, `floor()`, `ceil()`, `trunc()`
> Normal rounding, rounding down, rounding up, and truncation, respectively.

`add(value)`, `plus(value)`
> Addition for decimals.

`sub(value)`, `subtract(value)`, `minus(value)`
> Subtraction for decimals.

`mul(value)`, `multiply(value)`, `times(value)`
> Multiplication for decimals.

`div(value)`, `divide(value)`, `divideBy(value)`, `dividedBy(value)`
> Division for decimals.

`recip()`, `reciprocal()`, `reciprocate()`
> Find the reciprocal of the decimal.

## Comparators

`cmp(value)`, `compare(value)`
> Compares two values, and returns -1 for less than, 0 for equals, and 1 for greater than.

`cmpabs(value)`
> The same as `cmp()` and `compare()` but absolute values the numbers before calculating

`eq(value)`, `equals(value)`
> Returns true if the values are equal.

`neq(value)`, `notEquals(value)`
> Returns true if the values are not equal.

`lt(value)`, `gt(value)`
> Returns true if the value is less than or greater than, respectively.

`lte(value)`, `gte(value)`
> Returns true if the value is less than or equal to, or greater than or equal to, respectively.

`max(value)`, `min(value)`
> Returns the value that is bigger or smaller, respectively.

`maxabs(value)`, `minabs(value)`
> Returns the absolute value that is bigger or smaller, respectively.

`clamp(min, max)`
> Returns the value if it is between the minimum and maximum.

`clampMin(min)`, `clampMax(max)`
> The same as `clamp()` but only applies min or max, respectively.

`cmp_tolerance(value, tolerance)`, `compare_tolerance(value, tolerance)`, `eq_tolerance(value, tolerance)`, `equals_tolerance(value, tolerance)`
> Returns true if the values are equal, with a relative tolerance.

`neq_tolerance(value, tolerance)`, `notEquals_tolerance(value, tolerance)`
> Returns true if the values are not equal, with a relative tolerance.

`lt_tolerance(value, tolerance)`, `gt_tolerance(value, tolerance)`
> Returns true if the value is less than or greater than, respectively (with a relative tolerance).

`lte_tolerance(value, tolerance)`, `gte_tolerance(value, tolerance)`
> Returns true if the value is less than or equal to, or greater than or equal to, respectively (with a relative tolerance).

## Advanced Math

`log(value)`, `logarithm(value)`
> Takes the logarithm (with a base of your choosing) of the decimal.

`ln()`, `log2()`, `log10()`
> Takes the natural logarithm, base 2 logarithm, or base 10 logarithm of the decimal, respectively.

`absLog10()`
> The same as `log10()` but takes the absolute value of your input before calculating.

`pLog10()`
> The same as `log10()` but if you input a negative number, it returns 0.

`pow(value)`
> Raises the decimal to the power of a value of your choosing.

`exp()`, `sqr()`, `cube()`, `pow10()`
> Raises the decimal to the power of _e_ (the natural logarithm base), 2, 3, or 10, respectively.

`pow_base(value)`
> Raises a value of your choosing to the power of the decimal.

`root(value)`
> Takes the root (with a base of your choosing) of the decimal.

`sqrt()`, `cbrt()`
> Takes the square (base 2) root, or the cube (base 3) root of the decimal, respectively.

`factorial()`
> Takes the factorial of the decimal.

`gamma()`
> Takes the gamma function of the decimal.

`lngamma()`
> Literally just `gamma()` taken to the natural logarithm.

`tetrate(height = 2, payload = 1)`, `iteratedexp(height = 2, payload = 1)`
> Raises the decimal to the power of itself (height) times in a row.
>
> If the payload is not 1, then it is 'iterated exponentiation', the result of exping (payload) to base (decimal) (height) times.

`iteratedlog(base = 10, times = 1)`
> The result of applying log (base) 'times' times in a row.
>
> Equivalent to tetrating to a negative height.

`slog(base = 10)`
> Returns what height you'd have to get the decimal from tetrate (base).
>
> Note: base cannot be higher than 1.79e308.

`ssqrt()`
> The same as `slog()` but always has a base of 2.

`layeradd(diff, base)`
> Adds layers to the Decimal, even fractional layers (can also subtract if you enter a negative number), like adding `diff` to the number's slog (base) representation.
>
> Similar to `tetrate()` with base `base` and `iteratedlog()` with base `base`.

`layeradd10(diff)`
> The same as `layeradd()` but always has a base of 10.

`lambertw(value)`
> The Lambert W function, also called the omega function or product logarithm, is the solution `W(x) == x * e^x`.

`pentate(value, height = 2, payload = 1)`
> The result of tetrating `height` times in a row.

## Trigonometry

`sin()`, `asin()`
> Sine and inverse sine function for decimals.

`cos()`, `acos()`
> Cosine and inverse cosine function for decimals.

`tan()`, `atan()`
> Tangent and inverse tangent function for decimals.

`sinh()`, `asinh()`
> Hyperbolic sine and inverse hyperbolic sine function for decimals.

`cosh()`, `acosh()`
> Hyperbolic cosine and inverse hyperbolic cosine function for decimals.

`tanh()`, `atanh()`
> Hyperbolic tangent and inverse hyperbolic tangent function for decimals.

## Special Formulas

`affordGeometricSeries(resourcesAvailable, priceStart, priceRatio, currentOwned)`
> If you're willing to spend (resourcesAvailable), and you want to buy something with multiplicatively increasing cost each purchase, how much of it can you buy?
>
> Other parameters: priceStart = starting price, priceRatio = multiplying cost, currentOwned = amount already owned.

`sumGeometricSeries(numItems, priceStart, priceRatio, currentOwned)`
> How much resource would it cost to buy (numItems) items if you already have (currentOwned),
>
> the initial price is (priceStart), and it multiplies the cost by (priceRatio) each purchase?

`affordArithmeticSeries(resourcesAvailable, priceStart, priceAdd, currentOwned)`
> If you're willing to spend (resourcesAvailable), and you want to buy something with additively increasing cost each purchase, how much of it can you buy?
>
> Other parameters: priceStart = starting price, priceRatio = multiplying cost, currentOwned = amount already owned.

`sumArithmeticSeries(numItems, priceStart, priceAdd, currentOwned)`
> How much resource would it cost to buy (numItems) items if you already have (currentOwned),
>
> the initial price is (priceStart) and it adds (priceAdd) each to the cost purchase?

`efficiencyOfPurchase(cost, currentRpS, deltaRpS)`
> When comparing two purchases that cost (resource) and increase your resource/sec by (deltaRpS),
>
> the lowest efficiency score is the better one to purchase.
