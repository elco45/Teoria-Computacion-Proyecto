function verifyRegex(){
    var str_regex = new RegExp($('#str_regex').val());
    var str_cadena = $('#str_cadena').val();
    if(str_regex.test(str_cadena)){
    	swal("Nice!", "Cadena Aceptada", "success");
    	$('#str_cadena').val('');
    }else{
    	swal("Opps", "Cadena Rechazada", "error");
    }

}

function regexToDFA(){
    
}

function regexToNFA(){
    
}