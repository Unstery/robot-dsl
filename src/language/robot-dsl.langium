grammar RobotDsl

entry Robot:
	functions+=Func*;


Statement:
	Variable | Loop | Condition | Forward | Backward | Left | Right | RotateLeft | RotateRight | Rotate | FunctionCall | SetSpeed | VariableAssignment;

Expression:
	ArithmeticExpression | BooleanExpression;


AddSubOperator returns string:
    Add | Sub;

BooleanOperator returns string:
	EqualTo | Lower | Upper;

ArithmeticExpression:
	AddSubExpression;

BaseExpression:
	Value | EntityCall | GetSpeed | GetTime | GetDistance;

MulDivOperator returns string:
	Multiplication | Division;

Entity:
	Variable | Parameter;

Func:
	'let'
	(returnType=ReturnType)?
	name=ID
	'(' (parameters+=Parameter ( "," parameters+=Parameter)*)? ')'
	('{' body+=Statement* '}')?;

ReturnType:
	(type=Type | 'void');

Parameter:
	type=Type name=ID;

Variable:
	'var'
	type=Type
	name=ID
	'='
	expression=Expression;

Loop:
	'loop'
	condition=BooleanExpression
	'{'
		body+=Statement* 
	'}';

Condition:
	'if'
	condition=BooleanExpression
	'{'
		then+=Statement*
	'}'
	('else' '{' else+=Statement* '}' )?;

Forward:
	'Forward'
	distance=Expression
	unit=Unit;

Backward:
	'Backward'
	distance=Expression
	unit=Unit;

Left:
	'Left'
	distance=Expression
	unit=Unit;

Right:
	'Right'
	distance=Expression
	unit=Unit;

RotateLeft returns string:
	'RotateLeft';

RotateRight returns string:
	'RotateRight';

Rotate:
	'Rotate'
	angle=Expression;

FunctionCall:
	function=[Func:ID]
	'(' ( arguments+=Expression ( "," arguments+=Expression)*)? ')';

SetSpeed:
	'setSpeed'
	'('
		distance=Expression
		unit=Unit
	')';

VariableAssignment:
	variable=[Variable:ID]
	'='
	expression=Expression;


AddSubExpression:
	leftOperand=MulDivExpression (operator+=AddSubOperator rightOperand+=MulDivExpression)*;

BooleanExpression:
	leftOperand=ArithmeticExpression operator=BooleanOperator rightOperand=ArithmeticExpression;

MulDivExpression:
	leftOperand=BaseExpression (operator+=MulDivOperator rightOperand+=BaseExpression)*;

Value:
	value=INT;

EntityCall:
	variable=[Entity:ID];

GetSpeed returns string:
	'getSpeed()';

GetTime returns string:
	'getTime()';

GetDistance returns string:
	'getDistance()';

Multiplication returns string:
	'*';

Division returns string:
	'/';

Add returns string:
	'+';

Sub returns string:
	'-';

EqualTo returns string:
	'==';

Lower returns string:
	'<';

Upper returns string:
	'>';


Type returns string:
    'number' | 'text' | 'boolean';

Unit returns string:
    'mm' | 'cm';

hidden terminal WS: /\s+/;
terminal ID: /[_a-zA-Z][\w_]*/;
terminal INT returns number: /[0-9]+/;
terminal STRING: /"(\\.|[^"\\])*"|'(\\.|[^'\\])*'/;

hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;