const dataAndOperations = {
    setNumber: function(number){
        this.dataNumber = number;  
    },
    setNextNumber: function(nextNumber){
        this.dataNextNumber = nextNumber;
    },
    setOperator: function(operator){
        this.operator = operator;
    },
    performOperation: function(){
        if(this.dataNextNumber || this.dataNextNumber === 0){
            const operator = this.operator;
            if(operator === "+"){
                let result = this.dataNumber + this.dataNextNumber;
                dataAndOperations.result = result;
                this.clear();
                return result;
            } else if(operator === "-"){
                let result = this.dataNumber - this.dataNextNumber;
                dataAndOperations.result = result;
                this.clear();
                return result;
            } else if(operator === "×" || operator === "*"){
                let result = this.dataNumber * this.dataNextNumber;
                dataAndOperations.result = result;
                this.clear();
                return result;
            } else if(operator === "÷" || operator === "/"){
                if(dataAndOperations.dataNextNumber === 0){
                    let result = "Cannot Divide by Zero";
                    dataAndOperations.result = result;
                    this.clear();
                    console.log("dividing by zero");
                } else {
                    let result =  this.dataNumber / this.dataNextNumber;
                    dataAndOperations.result = result;
                    this.clear();
                }

            }
        }
    },
    clear: function(){
        this.dataNumber = "";
        this.dataNextNumber = "";
        this.operator = "";
    },
    clearAll:function(){
        this.dataNumber = "";
        this.dataNextNumber = "";
        this.operator = "";
        this.result = "";
    }
}

const UI = {
    DOMstrings: {
        numbers: ".number",
        operators: ".operator",
        display: ".display",
        equals: ".equals",
        clear: ".erase"
    },
    state: document.querySelector('.display'),
    getSelection: function(event){
        let selection = event.target.textContent;
        return selection;  
    },
    displayNumber: function(number){
        this.state.children[1].textContent += number;
        let displayedNumber = this.state.children[1].textContent;
        return displayedNumber;
    },
    displayOperator: function(operator){
        this.state.children[0].children[0].textContent = this.state.children[1].textContent;
        this.state.children[1].textContent = "";
        this.state.children[0].children[0].textContent += operator;
    },
    calculate: function(result){
        this.state.children[0].children[0].textContent = "";
        this.state.children[1].textContent = result;
    },
    clear: function(){
        this.state.children[0].children[0].textContent = "";
        this.state.children[1].textContent = "";
    }
}

const controller = {
    setEventListeners:function(){
        let DOM = UI.DOMstrings;

        //select number
        document.querySelectorAll(DOM.numbers).forEach(function(number){
            number.addEventListener("click", controller.selectNumber);
        });

        //select operator
        document.querySelectorAll(DOM.operators).forEach(function(operator){
            operator.addEventListener("click", controller.selectOperator);
        });

        //keybord input
        const keyCodeList = {48: 0, 49: 1, 50: 2, 51: 3,52:4,53:5,54:6,55:7,56:8,57:9};
        document.querySelector("body").addEventListener("keydown", function(event){
            for(var key in keyCodeList){
                if(parseInt(event.key) === keyCodeList[key]){
                    controller.selectNumber(keyCodeList[key]);
                }
            }
            switch(event.key){
                case "+":
                    controller.selectOperator(event.key);
                    break;
                case "-":
                    controller.selectOperator(event.key);
                    break;
                case "*":
                    controller.selectOperator(event.key);
                    break;
                case "/":
                    controller.selectOperator(event.key);
                    break;
                case "=":
                    controller.calculate();
                    break;
                case "Enter":
                    controller.calculate();
                    break;
                case "Escape":
                    controller.clear();
                    break;
                default:
                    //Do Nothing
                    break;
            }
        });

        //calculate result
        document.querySelector(DOM.equals).addEventListener("click", controller.calculate);

        //clear data and UI
        document.querySelector(DOM.clear).addEventListener("click", controller.clear);

    },
    selectNumber: function(event){
        if(typeof event !== "number"){
            const number = UI.getSelection(event);
            const displayedNumber = UI.displayNumber(number);
            if(!dataAndOperations.dataNumber || !dataAndOperations.operator){
                let parsedNumber = parseInt(displayedNumber);
                dataAndOperations.setNumber(parsedNumber);
            } else if(dataAndOperations.dataNumber || dataAndOperations.dataNumber !== 0){
                let parsedNumber = parseInt(displayedNumber);
                dataAndOperations.setNextNumber(parsedNumber);
            }              
        } else {
            const displayedNumber = UI.displayNumber(event);
            if((!dataAndOperations.dataNumber && dataAndOperations.dataNumber !== 0) || !dataAndOperations.operator){

                let parsedNumber = parseInt(displayedNumber);
                dataAndOperations.setNumber(parsedNumber);
            } else if(dataAndOperations.dataNumber || dataAndOperations.dataNumber === 0) {
                let parsedNumber = parseInt(displayedNumber);
                dataAndOperations.setNextNumber(parsedNumber);
            }  
        }
    },
    selectOperator: function(event){
        if(typeof event !== "string"){
            let operator = UI.getSelection(event);
            controller.chainOperations(operator);
        } else {
            controller.chainOperations(event);
        }
    },
    chainOperations: function(operator){
        if(!dataAndOperations.result && !dataAndOperations.dataNumber && !dataAndOperations.dataNextNumber){
            console.log("first number is zero automatically if a number isn't chosen but operator is clicked");
            const displayedNumber = UI.displayNumber("0");
            dataAndOperations.setNumber(0);
            UI.displayOperator(operator);
            dataAndOperations.setOperator(operator);
        } 
         else if(!dataAndOperations.result && (dataAndOperations.dataNumber || dataAndOperations.dataNumber === 0) && !dataAndOperations.dataNextNumber){
            console.log("normal condition: set operator after first number is chosen");
            UI.displayOperator(operator);
            dataAndOperations.setOperator(operator);
        } else if(dataAndOperations.result && !dataAndOperations.dataNumber && !dataAndOperations.dataNextNumber){
            console.log("result exists and both numbers are empty and operator is selected");
            UI.displayOperator(operator);
            dataAndOperations.setNumber(dataAndOperations.result);
            dataAndOperations.result = "";
            dataAndOperations.setOperator(operator);
        } else if(dataAndOperations.result && !dataAndOperations.dataNumber && dataAndOperations.dataNextNumber){
            console.log("result exists but first number is empty, 2nd exists");
            UI.displayOperator(operator);
            console.log("result:" + dataAndOperations.result);
            dataAndOperations.setNumber(dataAndOperations.result);
            dataAndOperations.result = "";
            controller.calculate();
            dataAndOperations.setOperator(operator);
            UI.displayOperator(operator);
        } else if(dataAndOperations.result && (dataAndOperations.dataNumber || dataAndOperations.dataNumber === 0) && !dataAndOperations.dataNextNumber){
            console.log("result exists but second number is empty, 1st exists");
            UI.displayOperator(operator);
            dataAndOperations.setNextNumber(dataAndOperations.result);
            dataAndOperations.result = "";
            controller.calculate();
            dataAndOperations.setOperator(operator);
            UI.displayOperator(operator);
        } else if((dataAndOperations.dataNumber || dataAndOperations.dataNumber === 0) && dataAndOperations.dataNextNumber){
            console.log("both numbers are selected and another operator is chosen.")
            UI.displayOperator(operator);
            controller.calculate();
            dataAndOperations.setOperator(operator);
            UI.displayOperator(operator);
        }
    },
    calculate: function(){
        if((dataAndOperations.dataNumber || dataAndOperations.dataNumber === 0)&& 
        (dataAndOperations.dataNextNumber || dataAndOperations.dataNextNumber === 0)
        && dataAndOperations.operator){
            dataAndOperations.performOperation();
            UI.calculate(dataAndOperations.result);
        } else if(dataAndOperations.result && dataAndOperations.dataNumber && !dataAndOperations.dataNextNumber){
           //result exists but second number is empty, 1st exists
            dataAndOperations.setNextNumber(dataAndOperations.result);
            dataAndOperations.result = "";
            dataAndOperations.performOperation();
            UI.calculate(dataAndOperations.result);
        }
    },
    clear: function(){
      dataAndOperations.clearAll();
      UI.clear();
    }
}

controller.setEventListeners();