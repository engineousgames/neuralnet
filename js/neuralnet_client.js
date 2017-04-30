var GameState = {
	"MAIN_MENU": 0,
};

document.ontouchstart = function(e){
	e.preventDefault();
}

window.requestAnimFrame = (function(){
						   return  window.requestAnimationFrame       ||
						   window.webkitRequestAnimationFrame ||
						   window.mozRequestAnimationFrame    ||
						   function( callback ){
						   window.setTimeout(callback, 1000 / 60);
						   };
						   })();

if( localStorage.volume == undefined )
{
	localStorage.volume = 100;
}

var m_pKeyboardImage;
var m_mobile = false;

var m_numPixels = 20;
var m_ppPixels = [];
var m_pPixelX = [];
var m_pPixelY = [];
var m_blocksPerPixel = 1;
var m_pInput = [];
var m_pResults = [];

var m_mouseDown = false;

function Init()
{
	FillRandomTable();
	
	var canvas = document.getElementById("canvas");
	//			var ctx = canvas.getContext("2d");

	if( !IsPhoneGap() )
	{
		canvas.addEventListener("mousedown", MouseHandler, false);
		canvas.addEventListener("mousemove", MouseHandler, false);
		//document.body.addEventListener("mousemove", MouseHandler, false);
		document.body.addEventListener("mouseup", MouseHandler, false);
		document.body.addEventListener("mousewheel", MouseHandler, false);
		document.body.addEventListener("DOMMouseScroll", MouseHandler, false);
	}

	m_canvasWidth = canvas.width;
	m_canvasHeight = canvas.height;
	
	m_touchEvents = false;
	
	m_pKeyboardImage = new Image();
	m_pKeyboardImage.onload = function()
	{
		log("image loaded");
	}
	m_pKeyboardImage.src = 'images/keyboard.png';

	
    // our background color (hidden behind the marble)
	
	m_startingScreenRatio = 0; // we set it to 0 so ResizeGame can set it to the correct starting screen ratio
	ResizeGame();
	
	InitButtons();
	
	m_gameState = GameState.MAIN_MENU;
	
	//! TEST
	//m_gameState = GameState.IN_GAME;
	InitGameObjects();
	ClearBoard();
	
	for( var i = 0; i < m_numPixels; i++ )
	{
		m_ppPixels[i] = [];
		for( var j = 0; j < m_numPixels; j++ )
		{
			m_ppPixels[i][j] = 0;
		}
	}
	
	InitNeuralNetwork();

	ResizeElements();
	
//	setInterval('draw()', 33);
//	setInterval('drawTest()', 33 );
	
	(function animloop(){
	 requestAnimFrame(animloop);
	 Animate();
	 Draw();
	 })();
}

var m_drawX = 0;
var m_drawy = 0;
var m_drawSize = m_numBlocksWide-2;
var m_pMainButtons = [];
var m_numberButtonIndex = 0;
function InitButtons()
{
	var midX = m_canvasWidth / 2;
	var midY = m_canvasHeight / 2;
	var buttonWidth = 9;
	var buttonHeight = 3;

	var buttonY = 1;
	buttonWidth = 4;
	
	var buttonIndex = 0;
	
	/*
	AddButton( m_pMainButtons,
			  1,
						   buttonY,
						   buttonWidth,
						   buttonHeight,
						   "Train", function() { m_gameState = GameState.MAIN_MENU; } );
	
	AddButton( m_pMainButtons,
			  ( m_numBlocksWide - 1 ) - buttonWidth,
						   buttonY,
						   buttonWidth,
						   buttonHeight,
						   "Test", function() { m_gameState = GameState.MAIN_MENU; } );
	 */
	AddButton( m_pMainButtons,
			  2 + buttonWidth,
						   buttonY,
						   ( m_numBlocksWide - 4 ) - ( 2 * buttonWidth ),
						   buttonHeight,
						   "Number recognition neural net", null );

	buttonY += 3;
	buttonWidth = 2;
	
	m_numberButtonIndex = m_pMainButtons.length;
	for( var i = 0; i < 10; i++ )
	{
		AddButton( m_pMainButtons,
				  1 + ( i * buttonWidth ),
				  buttonY,
				  buttonWidth,
				  buttonHeight,
				  "" + parseInt(i), function() {  } );
		
	}

	buttonY += buttonHeight + 2;

	AddButton( m_pMainButtons,
			  2 + buttonWidth,
			  buttonY,
			  ( m_numBlocksWide - 4 ) - ( 2 * buttonWidth ),
			  buttonHeight,
			  "Draw a number below and the neural net will guess what it is", null );
	
	buttonY+=3;
	
	m_drawX = 1;
	m_drawY = buttonY;
	
	/*
	buttonY = ( m_numBlocksWide - 1 ) + m_drawY;
	
	buttonWidth = 4;
	for( var i = 0; i < 5; i++ )
	{
		AddButton( m_pMainButtons,
				  1 + ( i * buttonWidth ),
				  buttonY,
				  buttonWidth,
				  buttonWidth,
				  "" + parseInt(i), function() { } );
		
	}
	buttonY += buttonWidth;
	for( var i = 0; i < 5; i++ )
	{
		AddButton( m_pMainButtons,
				  1 + ( i * buttonWidth ),
				  buttonY,
				  buttonWidth,
				  buttonWidth,
				  "" + parseInt(i+5), function() { } );
		
	}
	*/
}

function AddButton( pButtonArray, x, y, w, h, pText, pFunction )
{
	var arrayLength = pButtonArray.length;
	pButtonArray[arrayLength] = new ButtonClass();
	pButtonArray[arrayLength].Init( x, y, w, h, pText, pFunction );
}

function AddCityInfoItemButtons( pButtonArray, y, w, h, pText )
{
	AddButton( pButtonArray,
			  1,
									  y,
									  w,
									  h,
									  pText, null );
	
	AddButton( pButtonArray,
			  2 + w,
									  y,
									  4,
									  h,
									  "-", function() { } );
	AddButton( pButtonArray,
			  7 + w,
									  y,
									  4,
									  h,
									  "+", function() { } );
}

function StartNewGame()
{
	InitGameObjects();
	
	StartGame();
}

function ContinueGame()
{
	StartGame();
}

function StartGame()
{
//	m_gameState = GameState.IN_GAME;
}

function Alert( string )
{
	alert( string );
}


var m_phoneGap = false;
function IsPhoneGap()
{
	return m_phoneGap;
	/*
	 if( window.location.hostname == '' || window.location.hostname == '127.0.0.1' )
	 {
	 return true;
	 }
	 return false;
	 */
}

var m_levelChangeTIme = 0;

function InitGameObjects()
{
}

function ClearBoard()
{
	
}

function ResizeGame() {
	log( "ResizeGame() started! " + m_canvasWidth + ", " + m_canvasHeight );
	
	var gameArea = document.getElementById('gameArea');
	var newWidth = window.innerWidth;
	var newHeight = window.innerHeight;


	m_blockSize = Math.floor( newWidth / m_numBlocksWide );
	var blocksHigh = Math.floor( newHeight / m_blockSize );
	if( blocksHigh < m_numBlocksHigh )
	{
		m_blockSize = Math.floor( newHeight / m_numBlocksHigh );
	}

	var boardWidth = m_numBlocksWide * m_blockSize;
	var boardHeight = m_numBlocksHigh * m_blockSize;
	
	m_gameOffsetX = ( newWidth - boardWidth ) / 2;
	m_gameOffsetY = ( newHeight - boardHeight ) / 2;
	
	newWidth = boardWidth;
	newHeight = boardHeight;
	
	gameArea.style.width = newWidth + 'px';
	gameArea.style.height = newHeight + 'px';
	
	gameArea.style.marginTop = (-newHeight / 2) + 'px';
	gameArea.style.marginLeft = (-newWidth / 2) + 'px';
 
	var gameCanvas = document.getElementById('canvas');
	gameCanvas.width = newWidth;
	gameCanvas.height = newHeight;
	
	m_canvasWidth = gameCanvas.width;
	m_canvasHeight = gameCanvas.height;
	
	//  * window.devicePixelRatio
	m_fpsFontSize = Math.round( m_blockSize * 0.25 );
	m_gameFontSize1 = Math.round( m_blockSize * 0.75 ) + "px Arial";
	m_gameFontSize2 = Math.round( m_blockSize * m_blocksPerPixel ) + "px Arial";

	// shouldn't get called the first time?
    ResizeElements();
	
	log( "ResizeGame() finished! " + m_canvasWidth + ", " + m_canvasHeight );
}

function ResizeElements()
{
	log( "ResizeElements started! " + m_canvasWidth + ", " + m_canvasHeight );
	
	var canvas = document.getElementById("canvas");
	
	var ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;
	
	for( var i = 0; i < m_pMainButtons.length; i++ )
	{
		m_pMainButtons[i].ResizeElements();
	}

	log( "ResizeElements finished! " + m_canvasWidth + ", " + m_canvasHeight );
}

var m_nextLevelTimer = 0;
var m_nextLevelTimerCount = 2; // 2 sesconds
var g_now = new Date().getTime();
var m_lastDrawTime = g_now;

function Animate()
{
	var dt = 1/60.0;
	var now = new Date().getTime();
	dt = ((now-g_now) / 1000);
	g_now = Date.now();

	m_tickTime += dt;
	if( m_tickTime > TICK_TIME )
	{
		m_tickTime -= TICK_TIME;
		
		m_gameTicks++;
		if( m_gameTicks > MAX_TICKS )
		{
			m_gameTicks = 0;
		}
	}
	
	if( m_gameState == GameState.IN_GAME )
	{
	}
}

var m_addNewWordTimer = 0;
var NEW_WORD_TIMER = 2; // 2 seconds

var counter = 0;
function Draw()
{
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");

	if( m_textureLoadCount != m_prevTextureLoadCount )
    {
        ResizeElements();
        m_prevTextureLoadCount = m_textureLoadCount;
    }
	
	ctx.save();
	{
		if(window.devicePixelRatio == 2)
		{
			canvas.setAttribute('width', m_canvasWidth * 2);
			canvas.setAttribute('height', m_canvasHeight * 2);
			ctx.scale(2, 2);
		}
		
		ctx.clearRect(0, 0, m_canvasWidth, m_canvasHeight ); // clear canvas
		
		ctx.fillStyle = m_backgroundColor;
		ctx.fillRect( 0, 0, m_canvasWidth, m_canvasHeight );
		
		if( m_gameState == GameState.MAIN_MENU )
		{
			// find selected number
			var selectedNumber = -1;
			var largestNumber = 0;
			for( var i = 0; i < m_pResults.length; i++ )
			{
				if( m_pResults[i] > largestNumber )
				{
					selectedNumber = i;
					largestNumber = m_pResults[i];
				}
			}
			
			ctx.fillStyle = m_darkBlue;
			
			ctx.font = m_gameFontSize1;
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			
			for( var i = 0; i < m_pMainButtons.length; i++ )
			{
				var pButton = m_pMainButtons[i];

				if( i >= m_numberButtonIndex && i < ( m_numberButtonIndex+10 ) )
				{
					if( typeof( m_pResults[i - m_numberButtonIndex] ) !== "undefined" )
					{
						if( selectedNumber == i - m_numberButtonIndex )
						{
							//ctx.fillRect( pButton.m_drawX, pButton.m_drawY, pButton.m_drawWidth, pButton.m_drawHeight );
							pButton.m_selected = true;
						}
						else
						{
							pButton.m_selected = false;
						}
						ctx.fillStyle = m_darkBlue;
						var percentage = Math.floor( m_pResults[i - m_numberButtonIndex] * 100 ) + "%";
						ctx.fillText( percentage, pButton.m_drawX + pButton.m_drawWidth / 2, pButton.m_drawY + pButton.m_drawHeight * 1.25 );
					}
				}
				
				pButton.Draw( ctx );
			}
			
			
			for( var i = m_numberButtonIndex; i < 10; i++ )
			{
			}
			
			ctx.strokeStyle = m_darkBlue;
			ctx.strokeRect( m_drawX * m_blockSize, m_drawY * m_blockSize, m_drawSize * m_blockSize, m_drawSize * m_blockSize );
			
			ctx.fillStyle = m_lightGray;
			for( var i = 0; i < m_numPixels; i++ )
			{
				for( var j = 0; j < m_numPixels; j++ )
				{
					if( m_ppPixels[i][j] > 0 )
					{
						ctx.fillStyle = "rgba(160, 160, 160," + m_ppPixels[i][j] + ")";
						ctx.fillRect(	(m_drawX*m_blockSize) + ( i * m_blockSize * m_blocksPerPixel ),
										(m_drawY*m_blockSize) + ( j * m_blockSize * m_blocksPerPixel ),
										m_blockSize * m_blocksPerPixel,
										m_blockSize * m_blocksPerPixel );
					}
				}
			}
			
			var lineX = m_drawX * m_blockSize;
			var lineY = m_drawY * m_blockSize;
			var pixelSize = m_blockSize * m_blocksPerPixel;
			ctx.strokeStyle = m_lightGray;
			for( var i = 1; i < m_numPixels; i++ )
			{
				ctx.beginPath();
				ctx.moveTo( lineX + ( i * pixelSize ), lineY );
				ctx.lineTo( lineX + ( i * pixelSize ), lineY + ( m_drawSize * m_blockSize ) );
				ctx.closePath();
				ctx.stroke();
				
				ctx.beginPath();
				ctx.moveTo( lineX, lineY + ( i * pixelSize ) );
				ctx.lineTo( lineX + ( m_drawSize * m_blockSize ), lineY + ( i * pixelSize ) );
				ctx.closePath();
				ctx.stroke();
			}
			
			ctx.strokeStyle = m_darkBlue;
			if( m_pPixelX.length > 0 )
			{
				ctx.lineWidth = window.devicePixelRatio * 10;
				ctx.save();
				ctx.beginPath();
				ctx.moveTo( m_pPixelX[0], m_pPixelY[0] );
				for( var i = 0; i < m_pPixelX.length; i++ )
				{
					ctx.lineTo( m_pPixelX[i], m_pPixelY[i] );
				}
				ctx.stroke();
				ctx.restore();
			}
		}
		
		var d2 = new Date();
		frameTimer.EndTimer(d2.getTime());
		
		ctx.textAlign = 'left';
		ctx.textBaseline = 'bottom';
		//frameTimer.DrawFPS( ctx );
		
		var d1 = new Date();
		frameTimer.StartTimer(d1.getTime());
		
	}
	ctx.restore();
	
	counter++;
	if( counter > 3000 )
	{
		counter = 0;
	}
	
//	m_lastDrawTime = g_now;

    // this line below unlocks super fast framrate on browsers, but not on mobile which is why its commented out
	//window.requestAnimationFrame(draw, canvas); //???
}

// Call ReSize() when the screen size changes or the phone orientation changes:
window.addEventListener('resize', ResizeGame, false);
window.addEventListener('orientationchange', ResizeGame, false);

function HandleInput( event )
{
	var x = 0;
	var y = 0;
	
	g_lastInputTime = g_now;
	
	if( event.type!='touchmove' && event.type!='mousemove' )
	{
		//log("HandleInput( "+event.type+", "+pTouch+", "+touchIndex+" )");
	}
	
	// Get click position.
	if( m_touchEvents )
	{
		var touch = event.changedTouches[0];
		
		x = touch.pageX;
		y = touch.pageY;		
	}
	else
	{
		if( event.x == undefined )
		{
			x = event.clientX;
			y = event.clientY;
		}
		else
		{
			x = event.x;
			y = event.y;
		}
		
		var gameArea = document.getElementById('gameArea');
		
		x -= gameArea.offsetLeft;
		y -= gameArea.offsetTop;
	}
	
	if (event.type == "touchstart" || event.type == "mousedown" )
	{
		PassInput( "mousedown", touchIndex, x, y );
	}
	else if (event.type == "touchmove" || event.type == "mousemove" )
	{
		PassInput( "mousemove", touchIndex, x, y );
		
	}
	else if( ( event.type == "touchend" ) || ( event.type == "mouseup" ) )
	{
		PassInput( "mouseup", touchIndex, x, y );
	}
	else if( event.type == "touchcancel" )
	{
		PassInput( "mouseup", touchIndex, x, y );
	}
	else if( ( event.type == "mousewheel" ) || ( event.type == "DOMMouseScroll" ) )
	{
	}
	
}

function ClearNumber()
{
	for( var i = 0; i < m_numPixels; i++ )
	{
		for( var j = 0; j < m_numPixels; j++ )
		{
			m_ppPixels[i][j] = 0;
		}
	}
	
	m_pPixelX.length = 0;
	m_pPixelY.length = 0;
}

function DrawNumber( x, y )
{
	if( m_mouseDown )
	{
		x -= m_drawX * m_blockSize;
		y -= m_drawY * m_blockSize;
		var pixelX = Math.floor( x / ( m_blockSize * m_blocksPerPixel ) );
		var pixelY = Math.floor( y / ( m_blockSize * m_blocksPerPixel ) );
		
		//log( "DrawNumber(" + x + "," + y + ") pixelX " + pixelX + " pixelY " + pixelY );
		
		if( ( pixelX >= 0 && pixelX < m_numPixels ) &&
		   ( pixelY >= 0 && pixelY < m_numPixels ) )
		{
			m_pPixelX.push(x + ( m_drawX * m_blockSize ) );
			m_pPixelY.push(y + ( m_drawY * m_blockSize ) );
			
			//m_ppPixels[pixelX][pixelY] = 1;
		}
	}
}

function CalculateNumberSquares()
{
	if( m_pPixelX.length > 0 )
	{
		// grab bounds
		var minX, minY, maxX, maxY;
		minX = maxX = m_pPixelX[0];
		minY = maxY = m_pPixelY[0];
		for( var i = 1; i < m_pPixelX.length; i++ )
		{
			if( m_pPixelX[i] < minX )
			{
				minX = m_pPixelX[i];
			}
			if( m_pPixelX[i] > maxX )
			{
				maxX = m_pPixelX[i];
			}
			if( m_pPixelY[i] < minY )
			{
				minY = m_pPixelY[i];
			}
			if( m_pPixelY[i] > maxY )
			{
				maxY = m_pPixelY[i];
			}
		}
	}

	var diffX = ( maxX - minX );
	var diffY = ( maxY - minY );

	var drawSize = ( ( m_numBlocksWide - 2 ) * m_blockSize );
	
	var size = diffX;
	
	if( diffY > diffX )
	{
		size = diffY;
	}
	
	var offsetX = Math.floor( ( ( size - diffX ) * m_numPixels ) / ( 2 * size ) );
	var offsetY = Math.floor( ( ( size - diffY ) * m_numPixels ) / ( 2 * size ) );
	
	// now calculate squares
	var squareX, squareY;
	var drawXBlockSize = ( m_drawX * m_blockSize );
	var drawYBlockSize = ( m_drawY * m_blockSize );
	var blockSize = ( m_blockSize * m_blocksPerPixel );
	for( var i = 0; i < m_pPixelX.length; i++ )
	{
		var pixelX = m_pPixelX[i] - minX;
		var pixelY = m_pPixelY[i] - minY;
		
		squareX = Math.floor( ( pixelX / size ) * m_numPixels ) + offsetX;
		squareY = Math.floor( ( pixelY / size ) * m_numPixels ) + offsetY;

		if( squareX > m_numPixels-1 )
		{
			squareX = m_numPixels-1;
		}
		if( squareY > m_numPixels-1 )
		{
			squareY = m_numPixels-1;
		}
		
		AddPixel( squareX, squareY, 1 );

		AddPixel( squareX+1, squareY, 0.4 );
		AddPixel( squareX-1, squareY, 0.4 );
		AddPixel( squareX, squareY+1, 0.4 );
		AddPixel( squareX, squareY-1, 0.4 );

		AddPixel( squareX+1, squareY+1, 0.25 );
		AddPixel( squareX-1, squareY-1, 0.25 );
		AddPixel( squareX-1, squareY+1, 0.25 );
		AddPixel( squareX+1, squareY-1, 0.25 );
	}
	
	m_pInput.length = 0;
	var pString = "[";
	for( var i = 0; i < m_numPixels; i++ )
	{
		for( var j = 0; j < m_numPixels; j++ )
		{
			if( m_ppPixels[i][j] > 1 )
			{
				m_ppPixels[i][j] = 1;
			}
			if(!( i == 0 && j == 0 ))
			{
				pString += ", ";
			}
			pString += m_ppPixels[i][j];
			m_pInput.push(m_ppPixels[i][j]);
		}
	}
	pString += "],";
	log ( pString );
}

function AddPixel( x, y, value )
{
	if( ( x >= 0 && x < m_numPixels ) &&
		( y >= 0 && y <= m_numPixels ) )
	{
		m_ppPixels[x][y] += value;
	}
}

function KeyInput( event )
{
	var c = event.keyCode;
	
	var x = 0, y = 0;
	
	PassInput( event.type, c, x, y );
}

// Returns true if the key was just pressed this loop.
function KeyHit( key )
{
	if( g_keyHit[key] )
	{
		g_keyHit[key] = 0;
		return true;
	}
	else
	{
		return false;
	}
}

var g_keyDown = [];
var g_keyHit = [];
var g_mouseHit = [false, false];
var g_mouseDown = [false, false];
var g_mouseX = [0, 0];
var g_mouseY = [0, 0];
var g_mousePrevX = [0, 0];
var g_mousePrevY = [0, 0];
var g_mouseOldX = [[0], [0]];
var g_mouseOldY = [[0], [0]];
var g_mouseStartX = [0, 0];
var g_mouseStartY = [0, 0];
function PassInput( event, key, x, y )
{
	// check how long is has been since this menu first showed up on the screen
	// if its less than 250ms, then ignore the input because the user hasn't had time to look
	// at what they are pressing
	if( g_now - m_lastDrawTime < 250 ) // number in milliseconds
	{
		return;
	}
	
	if( m_gameState == GameState.MAIN_MENU )
	{
		for( var i = 0; i < m_pMainButtons.length; i++ )
		{
			m_pMainButtons[i].PassInput( event, x, y );
		}

		// Track input
		if( event == "keydown" )
		{
			if( !g_keyDown[key] )
			{
				g_keyDown[key] = true;
				if( g_keyHit[key] === false || g_keyHit[key] === undefined )
				{
					g_keyHit[key] = true;
				}
				else
				{
					g_keyHit[key] = 0;
				}
			}
		}
		else if( event == "keyup" )
		{
			g_keyDown[key] = false;
			g_keyHit[key] = false;
		}
		else if( event == "mousedown" )
		{
			g_mouseDown[key] = true;
			g_mouseStartX[key] = x;
			g_mouseStartY[key] = y;
			if( g_mouseHit[key] === false || g_mouseHit[key] === undefined )
			{
				g_mouseHit[key] = true;
			}
			else
			{
				g_mouseHit[key] = 0;
			}
			
			m_mouseDown = true;
			ClearNumber();
			DrawNumber( x, y );
		}
		else if( event == "mouseup" )
		{
			m_mouseDown = false;
			g_mouseDown[key] = false;
			g_mouseHit[key] = false;
			
			CalculateNumberSquares();
			
			if( !m_train )
			{
				m_pResults = nn.ForwardPropagation( m_pInput );
				log( m_pResults );
			}
			
		}
		else if( event == "mousemove" )
		{
			DrawNumber( x, y );
		}
		
		if( event == "mouseup" || event == "mousemove" || event == "mousedown" )
		{
			g_mousePrevX[key] = g_mouseX[key];
			g_mousePrevY[key] = g_mouseY[key];
			g_mouseX[key] = x;
			g_mouseY[key] = y;
		}
	}
}

var m_score = 0;

window.addEventListener("keydown", KeyInput, false);
window.addEventListener("keyup", KeyInput, false);

function MouseHandler( event )
{
	if( !m_touchEvents )
	{
		HandleInput( event );
	}
}


var m_canvasWidth;
var m_canvasHeight;

var m_startingScreenRatio;

var frameTimer = new TimerClass();

var m_gameBoard = [];

// it takes time for our textures to load. We use m_textureLoadCount and m_prevTextureLoadCount to determine if a new texture has been loaded.
var m_textureLoadCount = 0;
var m_prevTextureLoadCount = 0;

// variable to determine whether we are using touch events or mouse clicks
var m_touchEvents;

var m_gameState;
var m_challengeScore = 0;


var m_drag; // mouse/finger drag

var nn;
function Test()
{
	nn = new NeuralNetwork();
	nn.Create( 2, [2,2] );
	var output;
	
	var input = [[0,0], [0,1], [1,0], [1,1]];
	var ideals = [[1,1], [1,0], [0,1], [0,0]];
	
	nn.TrainNetwork( input, ideals );
	
	log( nn.ForwardPropagation( [0,0] ) );
	log( nn.ForwardPropagation( [0,1] ) );
	log( nn.ForwardPropagation( [1,0] ) );
	log( nn.ForwardPropagation( [1,1] ) );

	var stop = 0;
}

var m_train = false;
function InitNeuralNetwork()
{
	nn = new NeuralNetwork();
	nn.Create( 400, [50,25,10] );
	var output;
	
	var input = [];
	var ideals = [];
	
	for( var i = 0; i < 100; i++ )
	{
		for( var j = 0; j < 10; j++ )
		{
			input.push( pTrainingNumbers[j][i] );
		}
		
		ideals.push( [1,0,0,0,0,0,0,0,0,0] );
		ideals.push( [0,1,0,0,0,0,0,0,0,0] );
		ideals.push( [0,0,1,0,0,0,0,0,0,0] );
		ideals.push( [0,0,0,1,0,0,0,0,0,0] );
		ideals.push( [0,0,0,0,1,0,0,0,0,0] );
		ideals.push( [0,0,0,0,0,1,0,0,0,0] );
		ideals.push( [0,0,0,0,0,0,1,0,0,0] );
		ideals.push( [0,0,0,0,0,0,0,1,0,0] );
		ideals.push( [0,0,0,0,0,0,0,0,1,0] );
		ideals.push( [0,0,0,0,0,0,0,0,0,1] );
	}
	
	if( m_train )
	{
		nn.TrainNetwork( input, ideals );
	}
	else
	{
		nn.LoadWeights( pNetworkWeights );
//		nn.LoadWeights( pNetworkWeights2 );
	}
	
	for( var j = 0; j < 10; j++ )
	{
		var counter = 0;
		for( var i = 0; i < pTrainingNumbers[j].length; i++ )
		{
			var result = nn.ForwardPropagation( pTrainingNumbers[j][i] );
			if( result[j] > 0.75 )
			{
				counter++;
			}
		}
		log( Math.floor( ( counter / pTrainingNumbers[j].length ) * 10000 ) / 100 );
	}

	var stop = 0;

}

////////

if( 0 )
{
	window.log = function(){};
}
else
{
	if (Function.prototype.bind) {
		window.log = Function.prototype.bind.call(console.log, console);
	}
	else {
		window.log = function() {
			Function.prototype.apply.call(console.log, console, arguments);
		};
	}
}

