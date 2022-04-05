const parsing = input => {
    const string = JSON.parse(JSON.stringify(input));
    const hasMultiplication = string.indexOf("*") >= 0 ? true : false;
    const hasDivision = string.indexOf("%") >= 0 ? true : false;

    string
    .forEach(element => {
        const match = String(element).match(new RegExp(/\([0-9\+\-\*\%]+\)/));
        
        if(match) {
            const matched = match[0].replace("(", "").replace(")", "");
            
            string[string.indexOf(match[0])] = Number(
                parsing(
                    matched
                    .replace("(", "")
                    .split(" ")
                    .map(item => item.split(/(\d+)/).filter(Boolean))[0]
                    .map(item => !isNaN(Number(item)) ? Number(item) : item)
                )
            );
        };
    });

    string
    .get("X")
    .forEach(() => {
        const index = string.indexOf("X");
        string[index] = string[index - 1] * string[index + 1];
        
        string.splice(index - 1, 1);
        string.splice(index, 1);
    });

    string
    .get("/")
    .forEach(() => {
        const index = string.indexOf("/");

        string[index] = string[index - 1] / string[index + 1];
        
        string.splice(index - 1, 1);
        string.splice(index, 1);
    });

    for(let i = 1; i < string.length; i += 2) {
        if(i >= string.length) break;
        
        if(string[i] === "+") {
            string[i] = string[0] + string[i + 1];

            string.splice(i - 1, 1);
            string.splice(i, 1);
        };
        if(string[i] === "-") {
            string[i] = string[0] - string[i + 1];
        
            string.splice(i - 1, 1);
            string.splice(i, 1);
        };
    }

    if(string.length === 1) return string[0];

    return parsing(string);
};

const string = [];

const $ = (selector, flag) => !flag ? document.querySelector(selector) : document.querySelectorAll(selector);
const $preview = $("#preview > input[type=text]");
const $backInput = $("#back__input");
const $pad = $("#pad");

let index = 0;

$pad.addEventListener("click", ({ target }) => {
    if(target.is("#execute") || target.isChildOf("#execute")) {
        $preview.value = parsing(string);

        index = 0;
        string.length = 0;
        $backInput.value = "0";
    };
    if(target.is("#clear")) {
        string.length = 0;
        $backInput.value = "0";
        $preview.value = "0";
    };
    if(target.is("#backspace") || target.isChildOf("#backspace")) {
        const backInputValue = $backInput.value;
        const length = backInputValue.length;

        if(length === 0 && index > 0) {
            index--;
            
            string.length = index;

            index--;

            $backInput.value = string[index];
            $preview.value = $backInput.value;

            return;
        };
        if(length === 1) {
            if(index % 2 === 0) {
                if(index === 0) {
                    string[index] = "0";
                    $backInput.value = "0";
                    $preview.value = "0";

                    return;
                };

                string[index] = "";
                $backInput.value = string[index];
            };

            $preview.value = string.join("");

            return;
        };

        $backInput.value = backInputValue.slice(0, backInputValue.length - 1);
        string[index] = $backInput.value;
        $preview.value = string.join("");
    };
    if(target.has("number")) {
        if($backInput.value === "0") {
            $backInput.value = target.innerHTML;
            string[0] = $backInput.value;
            $preview.value = $backInput.value;

            return;
        };

        $backInput.value += target.innerHTML;
        string[index] = $backInput.value;
        $preview.value = string.join("");
    };
    if(target.has("operator")) {
        index++;

        string[index] = target.innerHTML;
        $preview.value = string.join("");
        $backInput.value = "";

        index++;
    };

    console.log(string);
});