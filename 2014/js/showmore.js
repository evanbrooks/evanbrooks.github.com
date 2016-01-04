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

    var fig = function(converter) {
        return [
            {
              type    : 'lang',
              regex   : '(fig\\[)([^~]+?)(\\])',
              replace : function(match, prefix, content, suffix) {
                  parts = content.split('"');
                  img = parts[0].split(",");
                  var c = "";
                  for (var i = 0; i < img.length; i++){
                    c += "<img src='" + img[i] + "' />";
                  }

                  var caption = "";
                  if (parts.length > 1){
                    c += "<h5>" + parts[1] + "</h5>";
                  }

                  return '<figure>' + c + '</figure>';
              }
            }
        ];
    };

    var vid = function(converter) {
        return [
            {
              type    : 'lang',
              regex   : '(vid\\[)([^~]+?)(\\])',
              replace : function(match, prefix, content, suffix) {
                  parts = content.split('"');
                  src = parts[0].split(",");
                  var settings = 'loop autoplay="autoplay" webkit-playsinline';

                  var sources = "";
                  for (var i = 0; i < src.length; i++){
                    sources += "<source src='" + src[i] + "' />";
                  }

                  var caption = "";
                  if (parts.length > 1){
                    caption += "<h5>" + parts[1] + "</h5>";
                  }
                  return '<figure class="bleed"><video ' + settings + '>' + sources + '</video>' + caption + '</figure>';
              }
            }
        ];
    };


    // Client-side export
    if (typeof window !== 'undefined' && window.Showdown && window.Showdown.extensions) { window.Showdown.extensions.fig = fig; }
    if (typeof window !== 'undefined' && window.Showdown && window.Showdown.extensions) { window.Showdown.extensions.vid = vid; }
    if (typeof window !== 'undefined' && window.Showdown && window.Showdown.extensions) { window.Showdown.extensions.showmore = showmore; }

}());