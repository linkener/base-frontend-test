# base-frontend-test

Welcome to the test for front end developer.

In this test we will ask you to build a simple, but beautiful page that consumes and produces data using a RESTful API.

The page you will build displays and allows for the modification of data gathered from an imaginary device. The wireframe of what is expected is under specification/wireframe.pdf, essentially it is a table of the data and a graph. The fields value1 and value2 of the table should be editable and sent back to the backend.

To get the data you will need to:
1) understand the OpenAPI 3.0 specification of the RESTful service located under specification/api.yml
	hint: https://swagger.io/tools/swagger-ui/
2) run the backend service on your machine
	hint: 	if you have java 8 installed on your machine you can just run java -jar backend/server.jar
		please note that if port 8080 is busy on your machine you can change the server's port by setting the SERVER_PORT environment variable
 
Deliverables:
 
a git commit with the following two items in the solution folder
1) a working implementation of the wireframe using the backend service supplied and either angular, react or vue. use any library you see fit.
2) an md document describing how to run and test your solution, a description of your solution, a justification for any framework/library choice, any challenges you faced.

What we will evaluate:

1) usability
2) performance   
3) clarity of the code and the document

