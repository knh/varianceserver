module.exports = {
	'port': 8080,
	'forward': {
		'host': 'localhost',
		'port': 80
	},
	'variance': {
		'input':[{
			'pipeline':'cookie'
		}],
		'output':{
			'text/html':['./libs/insertjs', './libs/modwhitespace', './libs/htmlcomment']
		},
		'encrypt':{
			'input':'RC4',
			'output':'RC4'
		}
	}
};
