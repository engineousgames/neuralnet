function Neuron()
{
	// Weights array.
	this._weights = [];
	this._bias = 1;
	
	// Variables for backpropagation.
	this._output = 0;
	this._deltas = [];
	this._gradient = 0;
	
	this.Init = function( numInputs )
	{
		log( "Init neuron " + numInputs );
		this.bias = ( Math.random() * 2 ) - 1; // random # from -1 to 1
		for( var i = 0; i < numInputs; i++ )
		{
			this._weights[i] = ( Math.random() * 2 ) - 1; // random # from -1 to 1
		}
	}

	this.Sigmoid = function( z )
	{
		g = 1.0 / ( 1.0 + Math.exp( -z ) );
		return g;
	}
	
	this.Parse = function( input )
	{
		var sum = 0;
		
		if( this._weights.length != input.length )
		{
			log( "wrong # of weights! weights length " + this._weights.length + " input length " + input.length );
		}
		
		// forward propagation is just the sum of all the inputs * the weights into this neuron
		for(var i = 0, len = input.length; i < len; i++) {
			sum += input[i] * this._weights[i];
		}
		
		// add the bias.
		sum += this._bias;

		// apply the sigmoid activation function
		return this._output = this.Sigmoid(sum);

	}
}

function Layer()
{
	this._neurons = []; // array of Neuron
	
	this.Parse = function( input )
	{
		var pResults = [];
		for( var i = 0; i < this._neurons.length; i++ )
		{
			pResults[i] = this._neurons[i].Parse( input );
		}
		return pResults;
	}
	
}

var logNet = false;

function NeuralNetwork()
{
	this._learningRate = 0.3;
	this._inputMultiplier = 100;
	
	this._layers = [];
	
	// create our neural network
	this.Create = function( numInputs, layers )
	{
		// cycle through all the layers.
		for(var i = 0, len = layers.length; i < len; i++) {
			
			// create a new layer
			this._layers[i] = new Layer();
			
			// popular the layer with new neurons.
			for( var j = 0; j < layers[i]; j++ )
			{
				var neuron = new Neuron();
				
				// initialize each neuron to accept the correct number of input weights
				// each layer's neurons needs to accept the # of weights as the preceeeding layer
				// the first layer's neurons need to accept as many weights as the input size
				var layerInputs = numInputs;
				if( i > 0 )
				{
					// each layer's neurons other than the first layer's need to accept the # of weights
					// as the previous layer size
					layerInputs = layers[i-1];
				}
				// initialize the neuron with the correct number of weights
				neuron.Init( layerInputs );

				// add the neuron to the layer
				this._layers[i]._neurons.push( neuron );
			}
		}
	}
	
	// forward propagation
	this.ForwardPropagation = function( input )
	{
		// clone the input so we can modify it as we propogate it through the array
		var result = input.slice();

		// we pass the input to the first layer, and then the result into each subsequent layer
		for(var i = 0, len = this._layers.length; i < len; i++)
		{
			result = this._layers[i].Parse(result);
		}
		
		// at the end result should be the output of our entire neural network
		// console.log(result);
		return result;
	}

	// we use this function train out neural network
	this.TrainNetwork = function( inputs, targets )
	{
		
		var loopCounter = 0;
		var index = 0;
		// cycle through our entire input / target pairs x amount of times
		while( loopCounter < ( inputs.length * this._inputMultiplier ) )
		{
			index++;
			index = index % inputs.length;
			// train the values from a specific input / target pair
			var error = this.PropagateInputTargetPair(inputs[index], targets[index]);

			// so we know it is working, print out the progress every once in a while
			if( loopCounter % 100 == 0 )
			{
				log( "loopCounter " + loopCounter );
			}
			loopCounter++;
		}
	}
	
	// train the network with this input / target pair
	this.PropagateInputTargetPair = function( input, target )
	{
		var totalError = 0; // how far was the result for this input from the target
		
		// run the input through the network to get the output based on it's current weights
		this.ForwardPropagation(input);
		
		
		// totalError tells us how far our result is from the target
		totalError = 0.0;
		
		// go backwards through the neural network
		for( var i = this._layers.length-1; i >= 0; i-- )
		{
			
			// the last layer will use the output of the forward propagation
			if(!this._layers[i+1])
			{
				// cycle through all the neurons in this layer
				for( var j = 0; j < this._layers[i]._neurons.length; j++ )
				{
					var neuron = this._layers[i]._neurons[j];
					var output = neuron._output;
					// calculate the gradient for each neuron, using the target value and the output from forward propagation
					neuron._gradient = output * (1 - output) * (target[j] - output);
					// add this neuron's error to the total error
					totalError += Math.pow( ( target[j] - output ), 2 );
				}
			}
			// each subsequent layer users the output from the previous layer
			else
			{
				// cycle through all the neurons in this layer
				for( var j = 0; j < this._layers[i]._neurons.length; j++ )
				{
					var neuron = this._layers[i]._neurons[j];
					var output = neuron._output; // the output calculate during forward propagation
					
					var error = 0.0;
					// our neuron's index is j, and it uses the weight of index j from the neuron it connects to
					// we need to add up all the deltas of the weights that are pointing away from our neuron to the neurons in the next layer
					for( var k = 0; k < this._layers[i+1]._neurons.length; k++ )
					{
						// add the next neuron's weight * gradient to the total error for this neuron
						var nextNeuron = this._layers[i+1]._neurons[k];
						error += nextNeuron._weights[j] * nextNeuron._gradient;
					}
					// use the error of all the weights we point to, to figure out this neuron's gradient
					neuron._gradient = output * (1 - output) * error;
				}
			}
		}
		// we now calculate the new weights all at once
		for( var i = 0; i < this._layers.length; i++ )
		{
			for( var j = 0; j < this._layers[i]._neurons.length; j++ )
			{
				var neuron = this._layers[i]._neurons[j];
				// modify this neuron's bias.
				neuron._bias += this._learningRate * neuron._gradient;
				// now modify the weights
				for( var k = 0; k < neuron._weights.length; k++ )
				{
					// Modify the weight by multiplying the weight by the
					// learning rate and the input of the neuron preceding.
					// If no preceding layer, then use the input layer.
					// now calculate the change in the weight using the learning rate, the gradient and the input into this neuron
					neuron._deltas[k] = this._learningRate * neuron._gradient * (this._layers[i-1] ? this._layers[i-1]._neurons[k]._output : input[k]);
					
					neuron._weights[k] += neuron._deltas[k];
				}
			}
		}
		
		return totalError;
	}

	// this function lets us print out the weights so we can save them and load them up later
	this.PrintOutWeights = function()
	{
		var pString = "var pNetworkWeights = [ ";
		for( var i = 0; i < this._layers.length; i++ )
		{
			for( var j = 0; j < this._layers[i]._neurons.length; j++)
			{
				neuron = this._layers[i]._neurons[j];
				
				pString += neuron._bias + ", ";
				for( var k = 0; k < neuron._weights.length; k++ )
				{
					pString += neuron._weights[k] + ", ";
				}
				
			}
		}
		pString += " ];";
		
		log( pString );
	}
	
	// load the weights we saved above
	this.LoadWeights = function( pWeights )
	{
		var index = 0;
		for( var i = 0; i < this._layers.length; i++ )
		{
			for( var j = 0; j < this._layers[i]._neurons.length; j++)
			{
				neuron = this._layers[i]._neurons[j];
				
				neuron._bias = pWeights[index]; index++;
				for( var k = 0; k < neuron._weights.length; k++ )
				{
					neuron._weights[k] = pWeights[index]; index++;
				}
				
			}
		}
	}

}

