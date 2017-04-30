// "use strict" // <- hide for iPhone

function ButtonClass()
{
	this.m_x = 0;
	this.m_y = 0;
	this.m_width = 0;
	this.m_height = 0;
	
	this.m_drawX = 0;
	this.m_drawY = 0;
	this.m_drawWidth = 0;
	this.m_drawHeight = 0;
	
	this.m_pText = [];
	this.m_selected = false;
	this.m_pFunction = null;
	
	this.Init = function( x, y, width, height, pText, pFunction )
	{
		this.m_x = x;
		this.m_y = y;
		this.m_width = width;
		this.m_height = height;
		this.m_pText = pText.split( "\n" );
		this.m_pFunction = pFunction;
		
		this.ResizeElements();
	}
	
	this.Animate = function()
	{
	}
	
	this.Draw = function( ctx )
	{
		ctx.textBaseline = 'middle';
		ctx.textAlign = 'center';
		
		if( this.m_pFunction == null )
		{
		}
		else
		{
			if( this.m_selected )
			{
				ctx.fillStyle = m_darkBlue;
				ctx.fillRect( this.m_drawX, this.m_drawY, this.m_drawWidth, this.m_drawHeight );
			}
			else
			{
				ctx.strokeStyle = m_darkBlue;
				ctx.strokeRect( this.m_drawX, this.m_drawY, this.m_drawWidth, this.m_drawHeight );
			}
		}
		
		ctx.fillStyle = m_darkBlue;
		if( this.m_selected )
		{
			ctx.fillStyle = m_backgroundColor;
		}
		
		var textY = this.m_drawY + ( this.m_drawHeight / ( this.m_pText.length+1 ) );
		for( var i = 0; i < this.m_pText.length; i++ )
		{
			ctx.fillText( this.m_pText[i], this.m_drawX  + ( this.m_drawWidth / 2 ), textY );
			
			textY += ( this.m_drawHeight / ( this.m_pText.length+1 ) );
		}

	}

	this.PassInput = function( event, x, y )
	{
		if( x > this.m_drawX && x < ( this.m_drawX + this.m_drawWidth ) )
		{
			if( y > this.m_drawY && y < ( this.m_drawY + this.m_drawHeight ) )
			{
				if( event == "mousedown" )
				{
					this.m_selected = true;
				}
				else if( event == "mouseup" )
				{
					this.m_pFunction( x, y );
					this.m_selected = false;
				}
				return true;
			}
		}
		this.m_selected = false;
		return false;
	}
	
	this.ResizeElements = function()
	{
		this.m_drawX = this.m_x * m_blockSize;
		this.m_drawY = this.m_y * m_blockSize;
		this.m_drawWidth = this.m_width * m_blockSize;
		this.m_drawHeight = this.m_height * m_blockSize;
	}
}
