var result = "";
var store = [];

/**
 *
 * loads stored equations and updates dialog
 *
 * */
function loadStore() {
    store = window.localStorage[0];
    if (store) {
        store = JSON.parse(store);
    } else {
        store = [];
    }
    $("#store").html("");
    $("#store").append("<table id='savedmath'><tr><th colspan='2'>Saved maths</th></tr></table>");
    for (var i = 0; i<store.length; i++) {
        var e = store[i];
        $("#store table").append("<tr><td><span class='load' data-name='" + e.name + "'>"+ e.name + "</span></td><td><a href='#' class='delete' data-name='" + e.name + "'>Delete</a></td></tr>");
    }

}
/**
 *
 * gets stored equation by the given name
 *
 * */
function getStore(name) {
    for (var i = 0; i<store.length; i++) {
        var e = store[i];
        if (e.name === name) {
            return e.result;
        }
    }
    return null;

}
/**
 *
 * save equations in storage
 *
 * */
function saveStore() {
    window.localStorage[0] = JSON.stringify(store);
}
/**
 *
 * delete equation with the given name from storage
 *
 * */
function deleteStore(name) {
    store = store.filter(function(e,i){
        if (e.name != name) {
            return true;
        }
    });
    saveStore();
}
/**
 * attach event listeners to buttons
 */
$(function(){
    loadStore();
    /**
     * load the stored equation
     */
    $("#store").on("click", ".load",  function(){
        result = getStore($(this).attr("data-name"));
        result = result + '=' + eval(result);
        $("#result").text(result);
    });
    /**
     * delete the stored equation
     */
    $("#store").on("click", ".delete", function(){
        deleteStore($(this).attr("data-name"));
        loadStore();
    });
    /**
     * process calculator buttons, eg 0-9, +,- ...
     */
    $(".calcbutton").on("click", function(){
        //if result contains = sign after loading the equation then reset it to avoid parsing errors
        if (result && result.search('=') > 0) {
            result = result.substr(0, result.search('='));
        }
        var action = $(this).attr("data-act");
        result = result + action.toString();
        $("#result").text(result);
    });
    /**
     * clear results
     */
    $("#btnCancel").on("click", function(){
        result = '';
        $("#result").text(result);
    });
    /**
     * calculate the equation
     */
    $("#equals").on("click", function(){
        try {
            //calculate the give equation with js eval function
            result = eval(result);
            $("#result").text(result);
        } catch (e) {
            //if an error occured then display it as the result
            $("#result").text(e.toString());
        }
    });
    /**
     * save
     */
    $("#btnSave").on("click", function(){
        if (result != "") {
            var name = prompt("Please enter the name"); 
            if (name != "") {
                var date = new Date();
                name = name + " / " + date.toLocaleDateString();
                store.push({
                    name: name,
                    result: result
                });
                saveStore();
                loadStore();
            }
        }
    });
});

