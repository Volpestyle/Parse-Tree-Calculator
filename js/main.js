/**
 * UI control
 */
var result = document.getElementById("result");
var expressionField = document.getElementById("expression");
window.onload = function() {
    //Prevent typing in expression field
    expressionField.addEventListener("keydown", (event) => {
        event.preventDefault();
    }, false);

    //Add numbers and operators to input field at cursor
    var numBtns = document.querySelectorAll('.btn-nums, .btn-ops');
    for(var i = 0; i < numBtns.length; i++ ) {
        numBtns[i].addEventListener("click", function() {
            removeRipples();
            insertAtCaret(expressionField, this.innerHTML);
        }, false);
    }
    
    //delete at cursor
    var delBtn = document.getElementById('btn-backspace');
    delBtn.addEventListener("click", function(){
        removeAtCaret(expressionField);
    }, false);
    
    //clear input
    var clearBtn = document.getElementById('btn-clear');
    clearBtn.addEventListener("click", function(){
        if (expressionField.value === "") {
            result.innerHTML = "";
        }
        expressionField.value = "";
    }, false);

    //evaluate expression
    var eqBtn = document.querySelector('.btn-eq');
    eqBtn.addEventListener("click", function() {
        //console.log(tokenize(expressionField.value));
        //console.log(buildTree(tokenize(expressionField.value)));
        try {
            result.innerHTML = (evalTree(buildTree(tokenize(expressionField.value)).root)); 
        } catch (error) {
            console.log("Invalid Input: " + error)
        }

    }, false);

    /**
    * UI Effects
    */
    var allBtns = document.querySelectorAll('.btn-ops, .btn-nums, .btn-eq, .btn-del');
    Array.prototype.forEach.call(allBtns, (btn) => {
        btn.addEventListener('click', createRipple);
    }) 

    function createRipple(event) {
        var circle = document.createElement('div');
        this.appendChild(circle);
        var d = Math.max(this.clientWidth, this.clientHeight);
        circle.style.width = circle.style.height = d + 'px';
        var rect = this.getBoundingClientRect();
        circle.style.left = event.clientX - rect.left - d/2 + 'px';
        circle.style.top = event.clientY - rect.top - d/2 + 'px';
        circle.classList.add('ripple'); 
    }

    function removeRipples() {
        var children = document.querySelectorAll('.ripple')
        for (let c of children) {
            c.remove();
        }
    }
    
}   

/**
 * Build a parse tree from the given token array.
 * @param {*} tokens 
 */
function buildTree(tokens) {
    try {
        var parseTree = new ParseTree();
        for (var i = 0; i < tokens.length; i++) {
            if (tokens[i].type === "Literal") {
                parseTree.insertLiteral(tokens[i].value);
            }
            else if (tokens[i].type === "Operator") {
                parseTree.insertOperator(tokens[i].value);
            }
            else if (tokens[i].type === "Function") {
                parseTree.funcStack.push(tokens[i].value);
            }
            else if (tokens[i].type === "Right Parenthesis") {
                return [parseTree, i + 1]; 
            }
            else if (tokens[i].type === "Left Parenthesis") {     
                var subTree = buildTree(tokens.slice(i + 1, tokens.length));
                parseTree.insertLiteral(evalTree(subTree[0].root));
                i += subTree[1]; //Skip over what the subTree already accounted for
            }
        }
        return parseTree;
    } catch (err) {
        console.log("Failed to build tree: " + err)
    }
}

/**
 * Do a depth first search through the tree finding operators and evaluating their children.
 * Catch invald input.
 * @param {*} node 
 */
function evalTree(node) {
    try {
        if (node.left === null && node.right === null)
            //in case number has already be evaluated
            return (typeof node.value === "number") ? node.value : parseInt(node.value); 
        else {
            var left = node.left; 
            var right = node.right; 
        }
        var v = node.value;
        switch(v) {
            case '+':
                return evalTree(left) + evalTree(right);
            case '-':
                return evalTree(left) - evalTree(right);
            case '/':
                return evalTree(left) / evalTree(right);
            case '*':
                return evalTree(left) * evalTree(right);
            case '%':
                return evalTree(left) % evalTree(right);
            case null:
                return evalTree(left);    
        }
    }
    catch (err) {
        console.log("Failed to evaluate tree: " + err);
    }
}
 /**
  * Node Object.
  */
class Node { 
    constructor(value) { 
        this.value = value; 
        this.left = null; 
        this.right = null; 
    } 
} 

/**
 * Syntax/Parse Tree Object.
 */
class ParseTree { 
    constructor() { 
        this.funcStack = [],
        this.root = new Node(null); 
    } 
    /**
     * Insert literal value (number) into the next free child node. 
     * If there is a function in the funcStack, call that function on the value before insertion.
     * @param {*} value 
     */
    insertLiteral(value) {
        if (this.funcStack.length > 0)
            value = getMathFunction(this.funcStack.pop(), value);

        var newNode = new Node(value); 
        fillEmptyNode(this.root, newNode);        
        
        /**
         * Recursively look for available node.
         * @param {} node 
         * @param {*} newNode 
         */
        function fillEmptyNode(node, newNode) {
            if(node.left === null) 
                node.left = newNode;
            else if (node.right === null) 
                node.right = newNode;
            else 
                fillEmptyNode(node.right, newNode);
        }
        /**
         * Execute corresponding Math function on 'toEval'.
         * @param {*} func 
         * @param {*} toEval 
         */
        function getMathFunction(func, toEval){
            switch(func) {
                case 'sin':
                    return Math.sin(toEval);
                case 'cos':
                    return Math.cos(toEval);
                case 'tan':
                    return Math.tan(toEval);  
            }
        }
    };
    /**
     * Push operator to top of tree. If operator is mult/div rotate tree right.
     * @param {*} value 
     */  
    insertOperator(value) { 
        if (this.root.value != null) {
            var newNode = new Node(value);
            newNode.left = this.root;
            this.root = newNode;
            if ((newNode.value === '*' || newNode.value === '/' || newNode.value === '%') && 
                (newNode.left.value !=='*' && newNode.left.value !== '/' && newNode.left.value !== '%')) 
                this.root = rightRotate(newNode);
        }
        else 
            this.root.value = value;
        /**
         * Rotate right tree of max height 2
         * @param {} node 
         */
        function rightRotate(node) {
            var x = node.left; 
            var T2 = x.right; 
            // Perform rotation 
            x.right = node; 
            node.left = T2; 
            // Return new root 
            return x; 
        } 
    }; 
}

/**
 * Token Object
 */
class Token {
    constructor(type, value) {
    this.type = type;
    this.value = value
    }
}
 /**
  * Turn String (expression) into array of 'Tokens'
  * @param {} str 
  */
function tokenize(str) {
    //remove spaces
	str.replace(/\s+/g, "");
	str=str.split("");

	var result=[];
	var letterBuffer=[];
	var numberBuffer=[];

	str.forEach((char, idx) => {
		if(isDigit(char)) {
			numberBuffer.push(char);
		} else if(char==".") {
			numberBuffer.push(char);
		} else if (isLetter(char)) {
			letterBuffer.push(char);
		} else if (isOperator(char)) {
            if (char === '-') {
                if(!(numberBuffer.length)) 
                    result.push(new Token("Literal", "0"));
            }
			emptyNumberBufferAsLiteral();
            emptyLetterBufferAsVariables();
			result.push(new Token("Operator", char));
		} else if (isLeftParenthesis(char)) {
			if(letterBuffer.length) {
				result.push(new Token("Function", letterBuffer.join("")));
				letterBuffer=[];
			} else if(numberBuffer.length) {
				emptyNumberBufferAsLiteral();
				result.push(new Token("Operator", "*"));
			}
			result.push(new Token("Left Parenthesis", char));
		} else if (isRightParenthesis(char)) {
			emptyLetterBufferAsVariables();
			emptyNumberBufferAsLiteral();
			result.push(new Token("Right Parenthesis", char));
		} else if (isComma(char)) {
			emptyNumberBufferAsLiteral();
			emptyLetterBufferAsVariables();
			result.push(new Token("Function Argument Separator", char));
		}
	});
	if (numberBuffer.length) {
		emptyNumberBufferAsLiteral();
	}
	if(letterBuffer.length) {
		emptyLetterBufferAsVariables();
	}
    return result;

    /**
     * Helper method to letter empty buffer and put into result array
     */
    function emptyLetterBufferAsVariables() {
        var l = letterBuffer.length;
            for (var i = 0; i < l; i++) {
                result.push(new Token("Variable", letterBuffer[i]));
            if(i< l-1) { //there are more Variables left
                  result.push(new Token("Operator", "*"));
            }
        }
        letterBuffer = [];
    }
    
    /**
     * Helper method to number empty buffer and put into result array
     */
    function emptyNumberBufferAsLiteral() {
        if(numberBuffer.length) {
              result.push(new Token("Literal", numberBuffer.join("")));
              numberBuffer=[];
          }
    }
}

/**
 * Determine what type of value the character is
 * @param {*} ch 
 */
function isComma(ch) {
    return (ch === ",");
}
function isDigit(ch) {
    return /\d/.test(ch);
}
function isLetter(ch) {
    return /[a-z]/i.test(ch);
}
function isOperator(ch) {
    return /\+|-|%|\*|\/|\^/.test(ch);
}
function isLeftParenthesis(ch) {
    return (ch === "(");
}
function isRightParenthesis(ch) {
    return (ch == ")");
}

/**
 * Code I found online to insert text at the caret
 * @param {} txtarea 
 * @param {*} text 
 */
//http://web.archive.org/web/20110102112946/http://www.scottklarr.com/topic/425/how-to-insert-text-into-a-textarea-where-the-cursor-is/
function insertAtCaret(txtarea,text) {
    var scrollPos = txtarea.scrollTop;
    var strPos = 0;
    var br = ((txtarea.selectionStart || txtarea.selectionStart == '0') ? 
        "ff" : (document.selection ? "ie" : false ) );
    if (br == "ie") { 
        txtarea.focus();
        var range = document.selection.createRange();
        range.moveStart ('character', -txtarea.value.length);
        strPos = range.text.length;
    }
    else if (br == "ff") strPos = txtarea.selectionStart;
    
    var front = (txtarea.value).substring(0,strPos);  
    var back = (txtarea.value).substring(strPos,txtarea.value.length); 
    txtarea.value=front+text+back;
    strPos = strPos + text.length;
    if (br == "ie") { 
        txtarea.focus();
        var range = document.selection.createRange();
        range.moveStart ('character', -txtarea.value.length);
        range.moveStart ('character', strPos);
        range.moveEnd ('character', 0);
        range.select();
    }
    else if (br == "ff") {
        txtarea.selectionStart = strPos;
        txtarea.selectionEnd = strPos;
        txtarea.focus();
    }
    txtarea.scrollTop = scrollPos;
}

/**
 * My customized version of 'insert caret' to remove caret
 * @param {} txtarea 
 */
function removeAtCaret(txtarea) {
    var scrollPos = txtarea.scrollTop;
    var strPos = 0;
    var br = ((txtarea.selectionStart || txtarea.selectionStart == '0') ? 
        "ff" : (document.selection ? "ie" : false ) );
    if (br == "ie") { 
        txtarea.focus();
        var range = document.selection.createRange();
        range.moveStart ('character', -txtarea.value.length);
        strPos = range.text.length;
    }
    else if (br == "ff") strPos = txtarea.selectionStart;
    
    var front = (txtarea.value).substring(0,strPos - 1);  //YEAH baby
    var back = (txtarea.value).substring(strPos,txtarea.value.length); 
    txtarea.value=front+back;
    strPos -= 1; //LETS GO
    if (br == "ie") { 
        txtarea.focus();
        var range = document.selection.createRange();
        range.moveStart ('character', -txtarea.value.length);
        range.moveStart ('character', strPos);
        range.moveEnd ('character', 0);
        range.select();
    }
    else if (br == "ff") {
        txtarea.selectionStart = strPos;
        txtarea.selectionEnd = strPos;
        txtarea.focus();
    }
    txtarea.scrollTop = scrollPos;
}