$(document).ready( function() {
    $("#load_DFA").on("click", function() {
        $("#container-body").load("VIEWS/DFA.html");
        $(document).ready( function() {
            $.getScript('JS/core/fsm.js', function () {          
                  startCanvas();  
            });
        });
    });        
});
$(document).ready( function() {
    $("#load_NFA").on("click", function() {
        $("#container-body").load("VIEWS/NFA.html");
        $(document).ready( function() {
            $.getScript('JS/core/fsm.js', function () {          
                  startCanvas();  
            });
        });
    });
});
$(document).ready( function() {
    $("#load_REGEX").on("click", function() {
        $("#container-body").load("VIEWS/REGEX.html");
    });
});
$(document).ready( function() {
    $("#load_CONVERTIR").on("click", function() {
        $("#container-body").load("VIEWS/CONVERTIR.html");
    });
});
$(document).ready( function() {
    $("#load_PDA").on("click", function() {
        $("#container-body").load("VIEWS/PDA.html");
    });
});
$(document).ready( function() {
    $("#load_CFG").on("click", function() {
        $("#container-body").load("VIEWS/CFG.html");
    });
});
$(document).ready( function() {
    $("#load_CFGtoCNF").on("click", function() {
        $("#container-body").load("VIEWS/CFGtoCNF.html");
    });
});
$(document).ready( function() {
    $("#load_TMACHINE").on("click", function() {
        $("#container-body").load("VIEWS/TMACHINE.html");
    });
});
$(document).ready( function() {
    $("#container-body").load("VIEWS/MainContent.html");
});


