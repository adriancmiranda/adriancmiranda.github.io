// http://eslint.org/docs/user-guide/configuring

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

const CommonGlobals = {
	"Modernizr": true,
	"module": true,
	"process": true,
	"trace": true,
};

const TestGlobals = {
	"beforeEach": true,
	"describe": true,
	"request": true,
	"expect": true,
	"it": true
};

module.exports = {
	"root": true,
	"parser": "babel-eslint",
	"extends": "airbnb-base",
	"env": {
		"browser": true,
	},
	"ecmaFeatures": {
		"modules": true,
	},
	"parserOptions": {
		"sourceType": "module",
	},
	"globals": Object.assign(GSAPGlobals, CommonGlobals, TestGlobals),
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
		"no-debugger": process.env.NODE_ENV === "production" ? 2 : 0,
		"no-console": "off", // trace.js takes care from this
		"no-param-reassign": "off",
		"no-tabs": "off",
		"import/extensions": ["error", "always", {
			"vue": "never",
			"js": "never",
		}],
		"import/no-extraneous-dependencies": ["error", {
			"optionalDependencies": ["@test/unit/index.js"]
		}],
		"indent": [2, "tab", {
			"SwitchCase": 1
		}]
	}
};
