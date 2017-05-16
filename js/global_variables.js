// fonts
var m_fpsFontSize;
var m_gameFontSize1;
var m_gameFontSize2;

var m_challenge = false;


// our background color
//var m_backgroundColor = "#6bd8ff";
var m_backgroundColor = "#e8e8e8";
var m_darkColor = "#40302c";
var m_darkGreen = "#08923b";
var m_greenColor = "#80bc41";
var m_darkBlue = "#244892";
var m_lightBlue = "#12a8d8";
var m_lightGray = "#a0a0a0";

var m_useMNIST = false;

var m_numPixels = 20;
if( m_useMNIST )
{
	m_numPixels = 28;
}

var m_numBlocksWide = m_numPixels + 2;//22;
var m_numBlocksHigh = m_numBlocksWide * 2;//40;
var m_blockSize;

var m_gameOffsetX = 0;
var m_gameOffsetY = 0;

var m_gameTicks = 0;
var MAX_TICKS = 10;
var m_tickTime = 0;
var TICK_TIME = 1;
