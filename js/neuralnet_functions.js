// Compute sigmoid functoon
// J = SIGMOID(z) computes the sigmoid of z.
function SigmoidArray(z)
{
	var g = [];
	for( var i = 0; i < z.length; i++ )
	{
		g[i] =  Sigmoid( z[i] );
	}
	return g;
}

function Sigmoid(z)
{
	g = 1.0 / ( 1.0 + Math.exp( -z ) );
	return g;
}

// This function predicts ONE layer of a neural network
// input is an array of our input
// theta is an array of nodes leading to the solution
// returns h_theta(x) = g( theta[i] * input[i] );
function Predict( input, theta )
{
	// Example
	// input is [1,0,0]
	// theta is [[-10,20,20]]
	// output is Sigmoid( (-10 * 1 ) + ( 20 * 0 ) + ( 20 * 0 ) ) which is ~ 0
	// or
	// input is [1,0,1]
	// theta is [[-10,20,20]]
	// output is Sigmoid( (-10 * 1 ) + ( 20 * 0 ) + ( 20 * 1 ) ) which is ~ 1
	// another example:
	// input is [1,0,0], theta is [[-30,20,20],[10,-20,-20]]
	// output is [Sigmoid( (-30*1) + (20*0) + (20*0) ), Sigmoid( (10*1) + (-20*0) + (-20*0) )] which is [0,1]

	var sum = [];
	for( var i = 0; i < theta.length; i++ )
	{
		sum[i] = 0;
		for( var j = 0; j < theta[i].length; j++ )
		{
			if( input.length != theta[i].length )
			{
				log("ERROR! Predict input length " + input.length + " does not equal theta["+i+"] length " + theta[i].length );
			}
			sum[i] += theta[i][j] * input[j];
		}
	}
	
	return SigmoidArray(sum);
}

// for each node
// h_theta = Predict( input, theta )
// cost function =

// input:
// theta is our theta values for each layer connections
// layers is the structure of our neural net
// y is the results for this training set

// layers is an array of the size of layers
// [4,5,3] is a neural net with 4 input, 5 hidden and 3 output
function CostFunction( input, theta, layers, Y )
{
	var numLayers = layers.length;
	var numOutput = layers[numLayers-1];
	
	var numFeatures = theta.length;
	
	var J = 0;
	var sum = 0;
	
	var layerTheta = [];
	for( var l = 0; l < numLayers; l++ )
	{
		var h_theta = Predict( input, theta );
	}

	// m = num training sets. Should be 1 for us.
	// - 1 / m *
	// for each output unit
	// y * Math.log( h_theta[i][j] ) + ( ( 1 - y ) * Math.log( 1 - h_theta[i][j] ) )
	
	
	/*
		var h_theta = sigmoid( theta[i][j] * layers[i][j] );
		
		for( var k = 0; k < numOutput, k++ )
		{
			var y = Y[i][k];
			sum = ( y * Math.log( h_theta ) ) + ( ( 1 - y ) * Math.log( 1 - h_theta ) );
		}
	*/
	
}
