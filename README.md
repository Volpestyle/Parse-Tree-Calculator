# Parse-Tree-Calculator
A basic scientific calculator.

## Usage
This calculator can perform all expected operations:
- Basic Arithmetic
- Decimals
- Parenthesis to organize priority
- Basic trigonometry (sin, cos, tan)
#### Additonal Information
- There is implied multiplication between opening parenthesis. <br /> (e.g. 5(2+3) will evaluate to 5*(2+3))
- When using trig functions, there is no implied multiplication, and you must place a '*' sign in between expressions. <br />
(e.g., 5*sin(3) **not** 5sin(3))
- You can input negative numbers by simply placing a '-' before the number.
- If there is data in the input field, the 'C' button will clear only input, otherwise it will clear the result field.

## Implementation Details
#### Parse Tree Formation
This calculator uses a parse tree to implement order of operations. Heres how it is built: <br />
Expression: 5+2*6
Input token: '5':