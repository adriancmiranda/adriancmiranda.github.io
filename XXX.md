Teorema de pitágoras:

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


var reUrlMultiline = /(?xi)                // ???
\b(                                        // Capture 1: entire matched URL
	(?:                                    // ???
		[a-z][\w-]+\:                      // URL protocol and colon
		(?:                                // One or more:
			\/{1,3}                        // 1-3 slashes
			|                              // or
			[a-z0-9%]                      // Single letter or digit or '%' # (Trying not to match e.g. "URI::Escape")
		)
		|                                  // or
		www\d{0,3}[.]                      // "www.", "www1.", "www2." … "www999."
		|		                           // or
		[a-z0-9.\-]+[.][a-z]{2,4}\/        // looks like domain name followed by a slash
	)
	(?:                                    // One or more:
		[^\s()<>]+                         // Run of non-space, non-()<>
		|                                  // or
		\(([^\s()<>]+|(\([^\s()<>]+\)))*\) // balanced parens, up to 2 levels
	)+
	(?:                                    // One or more (End with):
		\(([^\s()<>]+|(\([^\s()<>]+\)))*\) // balanced parens, up to 2 levels
		|                                  // or
		[^\s`!()\[\]{};:'".,<>?«»“”‘’]     // not a space or one of these punct chars
	)
)/gi

var reUrlSingleline = /\b((?:[a-z][\w-]+\:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/i
var url = 'www.google.com';
reUrlSingleline.test(url);
