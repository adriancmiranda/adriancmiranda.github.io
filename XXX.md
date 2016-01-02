Teorema de pitágoras:
=====================

	Cálculo da hipotenusa:
		Math.sqrt((a * a) + (b * b));
		ou
		Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));

	Cálculo dos catetos:
		a = Math.sqrt((hipotenusa * hipotenusa) - (b * b));
		b = Math.sqrt((hipotenusa * hipotenusa) - (a * a));
		ou
		a = Math.sqrt(Math.pow(hipotenusa, 2) - Math.pow(b, 2));
		b = Math.sqrt(Math.pow(hipotenusa, 2) - Math.pow(a, 2));


URL Absoluta (e.g. http://google.com)
=====================================

var patterns = ({
	// Thank's to John Gruber for `isAbsoluteURL` @see: http://daringfireball.net/2010/07/improved_regex_for_matching_urls
	isAbsoluteURL:/\b((?:[a-z][\w-]+\:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/i
});