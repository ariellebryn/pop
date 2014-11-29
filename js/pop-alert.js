/* Pop! Alert
 * Arielle Chapin 2014
 */

/* closePop
* cover - the alert cover element
* pop - the alert
*/
function closePop(cover, pop) {
    "use strict";
    pop.classList.remove("down");
    cover.classList.remove("on");
    setTimeout(function(){document.getElementsByTagName('body')[0].removeChild(cover);}, 200);
}

/* popAlert
* type - "message", "error", "confirm", "success"
* title - the title message
* message - the sub message
* button_affirm - the affirmation button text, NULL if none (auto "CONTINUE")
*/
function setupSuccess(title, message, affirm_button, success_function) {
    "use strict";
    if (!title)
        title = "Success!";
    if (!message)
        message = "";
    if (!affirm_button)
        affirm_button = "CONTINUE";

    return {title: title, message: message, affirm_button: affirm_button, success_function: success_function};
}

/* popAlert
* type - "message", "error", "confirm", "success"
* title - the title message
* message - the sub message
* button_affirm - the affirmation button text, NULL if none (auto "OKAY")
* affirm_function - the function to occur on confirm
* button_dull - the dull button message, NULL if none
* dull_action - the function to occur on dull
*/
function popAlert (type, title, message, button_affirm, affirm_function, button_dull, dull_action) {
    "use strict";
    
    // Check for bad input
    if (type != "message" && type != "error" && type != "confirm" && type != "success") {
        console.error("initPop error: type " + type + " doesn't match the alert cases.");
        return null;
    }

    var cover = document.createElement('div');
    cover.className = "cover";

    var pop = document.createElement('div');
    pop.className = "pop";

    // Apply bar styles
    if (type != "message") {
       var bar = document.createElement('div');
       bar.classList.add("bar");
       bar.classList.add(type);
       pop.appendChild(bar);
    }

    // Add alert-content div
    var content = document.createElement('div');
    content.className = "pop-content";
    pop.appendChild(content);

    // Add title and message
    var sp_title = document.createElement('span');

    if (title) {
        sp_title.innerHTML = title;
    } else {
        sp_title.innerHTML = "Alert!";   
    }
    content.appendChild(sp_title);

    if (message) {
        var p_message = document.createElement('p');
        p_message.innerHTML = message;
        content.appendChild(p_message);
    }

    // Add buttons
    var b_row = document.createElement('div');
    b_row.className = "button-row";
    content.appendChild(b_row);

    if (button_dull) {
        var b_dull = document.createElement('button');
        b_dull.classList.add("button");
        b_dull.classList.add("dull");
        b_dull.innerHTML = button_dull;

        b_dull.addEventListener("click", function() {
            if (dull_action)
                dull_action;
            closePop(cover, pop);
        }); 

        b_row.appendChild(b_dull);
    }  

    var b_affirm = document.createElement('button');
    b_affirm.classList.add("button");
    b_affirm.classList.add(type);
    if (button_affirm) {
        b_affirm.innerHTML = button_affirm;
    } else {
        b_affirm.innerHTML = "OKAY";
    }

    b_affirm.addEventListener("click", function() {
        if (type == "confirm") {
            bar.style.height = "100%";
            bar.style.borderRadius = "9px";
            setTimeout(function(){
                bar.style.height = "15px";
                bar.style.borderRadius = "9px 9px 0 0";
                bar.classList.remove("confirm");
                bar.classList.add("success");
                var success = affirm_function;
                sp_title.innerHTML = success.title;
                p_message.innerHTML = success.message;
                if (button_dull) {
                    b_row.removeChild(b_dull);   
                }
                b_affirm.innerHTML = success.affirm_button;
                b_affirm.classList.remove("confirm");
                b_affirm.classList.add("success");

                // New function on success confirmation
                b_affirm.addEventListener("click", function() {
                    bar.style.height = "15px";
                    closePop(cover, pop);
                    success.success_function; 
                });
            }, 500);
        } else if (affirm_function) {
            closePop(cover, pop);
            affirm_function();
        } else
            closePop(cover, pop);
    });

    b_row.appendChild(b_affirm);


    // Add everything to DOM
    cover.appendChild(pop);
    document.getElementsByTagName('body')[0].appendChild(cover);

    // Transition
    setTimeout(function () {
        cover.classList.add("on");
        pop.classList.add("down");}, 100);

}