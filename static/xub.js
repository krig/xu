var entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;',
    "/": '&#x2F;'
};

function escapeHtml(string) {
    return String(string).replace(/[&<>"'\/]/g, function (s) {
        return entityMap[s];
    });
}

function getPerformer(item) {
    if ('performer' in item) {
        return item.performer;
    }
    return item.artist;
}

function trim(str) {
    return str.replace(/^\s*([\S\s]*?)\s*$/, '$1');
}

$.extend({
    getUrlVars: function(){
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for(var i = 0; i < hashes.length; i++)
        {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    },
    getUrlVar: function(name, orelse){
        var vars = $.getUrlVars();
        if (name in vars) {
            return vars[name];
        }
        if (orelse != undefined) {
            return orelse;
        }
        return "";
    }
});
