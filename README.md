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
#### Tokenizing
Before an expression is evaluated, it must be tokenzed first so 'buildTree()' knows how to build the tree. 
Each component of the expression is typed as either a "Literal", "Operator, "Left Parenthesis", "Right Parenthesis, or "Function", and assigned a value. <br />
Here's an example of the token array of '5(sin(5)+2)':
![token-array](doc-images/token-array.png?raw=true)

#### Parse Tree Formation
This calculator uses a parse tree to implement order of operations. <br />
Expression: 5+2*6 <br />
![parse-tree](doc-images/parse-tree.jpg?raw=true)
![parse-tree](doc-images/parse-tree%20(1).jpg?raw=true)
![parse-tree](doc-images/parse-tree%20(2).jpg?raw=true)
![parse-tree](doc-images/parse-tree%20(3).jpg?raw=true)
![parse-tree](doc-images/parse-tree%20(4).jpg?raw=true)
![parse-tree](doc-images/parse-tree%20(5).jpg?raw=true)
