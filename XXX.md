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
