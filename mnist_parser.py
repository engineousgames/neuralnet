#!/usr/bin/env python
from __future__ import print_function

#localized_filename = input('File to compare: ')
mnist_filename = "data/train.csv"
#print(localized_filename,end="\n");

file_mnist = open(mnist_filename)
lines_mnist = file_mnist.readlines()

targetTypes = ["[1,0,0,0,0,0,0,0,0,0]",
			   "[0,1,0,0,0,0,0,0,0,0]",
			   "[0,0,1,0,0,0,0,0,0,0]",
			   "[0,0,0,1,0,0,0,0,0,0]",
			   "[0,0,0,0,1,0,0,0,0,0]",
			   "[0,0,0,0,0,1,0,0,0,0]",
			   "[0,0,0,0,0,0,1,0,0,0]",
			   "[0,0,0,0,0,0,0,1,0,0]",
			   "[0,0,0,0,0,0,0,0,1,0]",
			   "[0,0,0,0,0,0,0,0,0,1]"]

target = "var pMNISTTrainingTargets = [\n"
output = "var pMNISTTrainingData = [\n"

counter = 0
for line_mnist in lines_mnist:
	#	print (line_mnist,end="")
	if counter > 0:
		number = line_mnist[0]
		target += targetTypes[int(number)] + ",\n"
		output += "[" + line_mnist[2:] + "],"
	counter = counter + 1

output = output[:-1] # remove trailing ,
target = target[:-1] # remove trailing ,

target += "\n];\n"
output += "\n];\n"

print (target)
print (output)
