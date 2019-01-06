// From http://www.redblobgames.com/making-of/line-drawing/
// Copyright 2017 Red Blob Games <redblobgames@gmail.com>
// License: Apache v2.0 <http://www.apache.org/licenses/LICENSE-2.0.html>

const scale = 22;

function setUpTangle () {

    var bitString = document.getElementById("bitstring")

    var tangle = new Tangle(bitString, {
        initialize: function() {
            this.bitLength = 0;
            this.numBitStrings = 0;
        },
        update: function() {
            if(this.bitLength > 0) this.numBitStrings = 2 ** this.bitLength;
            else this.numBitStrings = 0;
        }
    });

    var bitStringExample = document.getElementById("fixedSequenceExample")

    var tangle = new Tangle(bitStringExample, {
        initialize: function() {
            this.bitLength = 55;
            this.bitRemPre = 52;
            this.bitRemPost = 51;
            this.bitRem = 48;
        },
        update: function() {
            this.bitRemPre = this.bitLength-3;
            this.bitRemPost = this.bitLength-4;
            this.bitRem = this.bitLength-7;
        }
    });

    var bitString2 = document.getElementById("bitstring2")

    var tangle = new Tangle(bitString2, {
        initialize: function() {
            this.numBits = 8;
            this.numPreBits = "101";
            this.numPostBits = "110";
            this.numBitStrings = 0;
            this.numPreRemBits = 0;
            this.numPostRemBits = 0;
            this.numRemBits = 0;
            this.operation = "OR";
        },
        update: function() {
            var pre = this.numPreBits.toString(2).length;
            var post = this.numPostBits.toString(2).length;

            this.numPreRemBits = this.numBits - pre;
            this.numPostRemBits = this.numBits - post;
            this.numRemBits = this.numBits - (pre + post);

            var form = this.numPreBits.toString(2);
            for(var i=pre; i<this.numBits-post; i++) form += "X";
            form += this.numPostBits.toString(2);

            document.getElementById("form").innerHTML = form;

            if(this.operation == "OR"){
                document.getElementById("answer").innerHTML = "2<sup>"+this.numPreRemBits+"</sup> + 2<sup>"+this.numPostRemBits+"</sup> - 2<sup>"+this.numRemBits+"</sup>"
                this.numBitStrings = (2 ** this.numPreRemBits) + (2 ** this.numPostRemBits) - (2 ** this.numRemBits);
            }
            else{
                document.getElementById("answer").innerHTML = "2<sup>"+this.numRemBits;
                this.numBitStrings = (2 ** this.numRemBits);
            }
        }
    });

    //Quiz Shit

    var q1 = document.getElementById("q1")

    var tangle = new Tangle(q1, {
        initialize: function() {
            this.q1x = Math.floor(Math.random()*10)+1;
            this.answer = 0;
            this.correct = 2 ** this.q1x;
            this.q1Cheat = "Show Answer";
        },
        update: function() {
            if(this.answer == this.correct){
                document.getElementById("q1aFinal").innerHTML += " Correct!";
                document.getElementById("q1aBox").style.visibility = "hidden";
                document.getElementById("q1aFinal").style.visibility = "visible";
                document.getElementById("q1Correct").style.visibility = "visible";
                document.getElementById("q1Cheat").style.visibility = "hidden";
            }
            if(this.q1Cheat == "Showing Answer"){
                document.getElementById("q1aBox").style.visibility = "hidden";
                document.getElementById("q1aFinal").style.visibility = "visible";
                document.getElementById("q1Correct").style.visibility = "visible";
            }
        }
    });

    var q2 = document.getElementById("q2")

    var tangle = new Tangle(q2, {
        initialize: function() {
            this.q2x = Math.floor(Math.random()*10)+3;
            this.answer = 0;
            this.correct = 2 ** (this.q2x-3);
            this.q2Cheat = "Show Answer";
        },
        update: function() {
            if(this.answer == this.correct){
                document.getElementById("q2aFinal").innerHTML += " Correct!";
                document.getElementById("q2aBox").style.visibility = "hidden";
                document.getElementById("q2aFinal").style.visibility = "visible";
                document.getElementById("q2Correct").style.visibility = "visible";
                document.getElementById("q2Cheat").style.visibility = "hidden";
            }
            if(this.q2Cheat == "Showing Answer"){
                document.getElementById("q2aBox").style.visibility = "hidden";
                document.getElementById("q2aFinal").style.visibility = "visible";
                document.getElementById("q2Correct").style.visibility = "visible";
            }
        }
    });
}

const getAllSubstrings=(size)=> {
    let arrayOfBitStrings=[]

    for(let i=0; i< Math.pow(2,size); i++){
        arrayOfBitStrings.push(dec2bin(i))
    }

    return arrayOfBitStrings
  
}

const dec2bin=(dec)=>{
    return (dec >>> 0).toString(2);
}

//Custom definitions

Tangle.formats.binary = function(x){ return x.toString(2); }

Tangle.classes.TKBinaryField = {

    initialize: function (element, options, tangle, variable) {
        this.input = new Element("input", {
            type: "text",
            "class":"TKBinaryFieldInput",
            size: options.size || 6
        }).inject(element, "top");
            
        var inputChanged = (function () {
            if(this.getValue().match(/[2-9A-z]/g) || this.getValue().length > 4){
                this.input.value = this.input.value.toString().slice(0, -1);
            }
            var value = this.getValue();
            tangle.setValue(variable, value);
        }).bind(this);
            
        this.input.addEvent("keyup",  inputChanged);
        this.input.addEvent("blur",   inputChanged);
                this.input.addEvent("change", inputChanged);
    },
        
    getValue: function () {
        return this.input.get("value");
    },
        
    update: function (element, value) {
        var currentValue = this.getValue();
        if (value !== currentValue) { this.input.set("value", "" + value); }
    }
};

Tangle.classes.TKToggleAnd = {

    initialize: function (element, options, tangle, variable) {
        element.addEvent("click", function (event) {
            var isActive = tangle.getValue(variable);
            if(isActive == "OR") tangle.setValue(variable, "AND");
            else tangle.setValue(variable, "OR");
        });
    }
};

Tangle.classes.TKToggleCheat = {

    initialize: function (element, options, tangle, variable) {
        element.addEvent("click", function (event) {
            var isActive = tangle.getValue(variable);
            if(isActive == "Show Answer") tangle.setValue(variable, "Showing Answer");
        });
    }
};