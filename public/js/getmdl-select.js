{
    'use strict';
    window.onload = function () {
        getmdlSelect.init('.getmdl-select');
        document.addEventListener("DOMNodeInserted", function (ev) {
            if (ev.relatedNode.querySelectorAll(".getmdl-select").length > 0) {
                componentHandler.upgradeDom();
            }
        }, false);
    };

    var getmdlSelect = {
        defaultValue : {
            width: 300
        },
        addEventListeners: function (dropdown) {
            var input = dropdown.querySelector('input');
            var inputGetValue = input.nextSibling;
            var list = dropdown.querySelectorAll('li');
            var menu = dropdown.querySelector('.mdl-js-menu');

            //show menu on mouse down or mouse up
            input.onkeydown = function (event) {
                if (event.keyCode == 38 || event.keyCode == 40) {
                    menu['MaterialMenu'].show();
                }
            };

            //return focus to input
            menu.onkeydown = function (event) {
                if (event.keyCode == 13) {
                    input.focus();
                }
            };

            [].forEach.call(list, function (li) {
                li.onclick = function () {

                    if(li.dataset.val){
                        input.value = li.dataset.val;
                    }else{
                        input.value = li.textContent;
                    }

                    dropdown.MaterialTextfield.change(li.textContent); // handles css class changes
                    setTimeout( function() {
                        dropdown.MaterialTextfield.updateClasses_(); //update css class
                    }, 250 );

                    // update input with the "id" value
                    input.dataset.val = li.dataset.val || '';
                    inputGetValue.value = li.dataset.val;
                    if ("createEvent" in document) {
                        var evt = document.createEvent("HTMLEvents");
                        evt.initEvent("change", false, true);
                        input.dispatchEvent(evt);
                    } else {
                        input.fireEvent("onchange");
                    }
                };
            });
        },
        init: function (selector) {
            var dropdowns = document.querySelectorAll(selector);
            [].forEach.call(dropdowns, function (i) {
                getmdlSelect.addEventListeners(i);
            });
        }
    };
}
