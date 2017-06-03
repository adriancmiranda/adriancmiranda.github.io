// http://eslint.org/docs/user-guide/configuring

const OFF = 0;
const WARN = 1;
const ERROR = 2;

const GSAPGlobals = {
  "TimelineLite": true,
  "TimelineMax": true,
  "TweenLite": true,
  "TweenMax": true,
  "Back": true,
  "Bounce": true,
  "Circ": true,
  "Cubic": true,
  "Ease": true,
  "EaseLookup": true,
  "Elastic": true,
  "Expo": true,
  "Linear": true,
  "Power0": true,
  "Power1": true,
  "Power2": true,
  "Power3": true,
  "Power3": true,
  "Power4": true,
  "Quad": true,
  "Quart": true,
  "Quint": true,
  "RoughEase": true,
  "Sine": true,
  "SlowMo": true,
  "SteppedEase": true,
  "Strong": true,
  "Draggable": true,
  "SplitText": true,
  "VelocityTracker": true,
  "CSSPlugin": true,
  "ThrowPropsPlugin": true,
  "BezierPlugin": true,
};

const ClientGlobals = {
	"Modernizr": true,
	"trace": true,
};

module.exports = {
	"root": true,
	"parser": "babel-eslint",
	"extends": "airbnb-base",
	"env": {
		"browser": true,
		"node": true,
	},
	"ecmaFeatures": {
		"modules": true,
	},
	"parserOptions": {
		"sourceType": "module",
	},
	"globals": Object.assign(GSAPGlobals, ClientGlobals),
	"plugins": [
		"html"
	],
	"settings": {
		"import/resolver": {
			"webpack": {
				"config": "@bin/index.js"
			}
		}
	},
	"rules": {
		"no-debugger": process.env.NODE_ENV === "production" ? ERROR : OFF,
		"no-console": OFF, // <- trace.js takes care from this
		"no-param-reassign": OFF,
		"no-tabs": OFF,
		"import/extensions": [ERROR, "always", {
			"js": "never",
		}],
		"import/no-extraneous-dependencies": [ERROR, {
			"optionalDependencies": ["@test/unit/index.js"]
		}],
		"indent": [ERROR, "tab", {
			"SwitchCase": 1
		}]
	}
};
