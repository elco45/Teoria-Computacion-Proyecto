function verifyRegex(){
    var str_regex = new RegExp($('#str_regex').val())
    var str_cadena = $('#str_cadena').val()
    alert(str_regex.test(str_cadena))
    $('#str_cadena').val('')
}

function regexToDFA(){
    
}

function regexToNFA(){
    
}