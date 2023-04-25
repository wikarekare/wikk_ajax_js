all: www/wikarekare/js/wikk_ajax-min.js

www/wikarekare/js/wikk_ajax-min.js: www/wikarekare/js
	(cd www/wikarekare/js; minimise.rb wikk_ajax.js)
