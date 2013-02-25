(function(){

    var showmore = function(converter) {
        return [
            // aside syntax
            { type: 'output', filter: function(source){
                return source.replace(/<p>%aside<\/p>/gi, function(match, pre) {
                    return '<aside>';
                });
            }},
            { type: 'output', filter: function(source){
                return source.replace(/<p>%endaside<\/p>/gi, function(match, pre) {
                    return '</aside>';
                });
            }}
        ];
    };

    // Client-side export
    if (typeof window !== 'undefined' && window.Showdown && window.Showdown.extensions) { window.Showdown.extensions.showmore = showmore; }
    // Server-side export
    if (typeof module !== 'undefined') module.exports = showmore;

}());