var marked = require('marked');

var removeIndentation = require('presentation/util/remove-indentation');

marked.setOptions({
	renderer: new marked.Renderer(),
	gfm: true,
	tables: true,
	breaks: false,
	pedantic: false,
	sanitize: false,
	smartLists: false,
	smartypants: false,
	langPrefix: 'hljs lang-',
    highlight: require('../code-block').highlight,
});

exports.renderer = function(input, out) {
    var body = out.captureString(function () {
        input.renderBody(out);
    });

	body = removeIndentation(body);

    out.write(marked(body));

};
