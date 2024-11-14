const SUCCESSFUL_REQUEST_CODE = 200; // The request was successful
const NEW_RESOURCE_CREATED_CODE = 201; //  The request was successful, and a resource was created
const INVALID_DATA_CODE = 400; // The server cannot process the request due to a client error
const UNAUTHORIZED_STATUS_CODE = 401; //The request lacks valid authentication credentials for the target resource.
const DATA_NOT_FOUND_CODE = 404; // The requested resource could not be found
const CONFLICT_ERROR_CODE = 409; // Conflict with the current state of a resource
const DEFAULT_ERROR_CODE = 500; // A generic error message indicating that something went wrong on the server.

module.exports = {
  SUCCESSFUL_REQUEST_CODE,
  NEW_RESOURCE_CREATED_CODE,
  INVALID_DATA_CODE,
  DATA_NOT_FOUND_CODE,
  DEFAULT_ERROR_CODE,
  UNAUTHORIZED_STATUS_CODE,
  CONFLICT_ERROR_CODE,
};
