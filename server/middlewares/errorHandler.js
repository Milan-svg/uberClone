import { ApiError } from "../utils/apiError.js";
const errorHandler = (err, req, res, next) => {
  //log error details
  console.error(`${req.method} ${req.originalUrl} - ${err.message}`);

  //Handle specific errors
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
  }
  //mongoDB/mongoose errors
  if (err.name === "CastError") {
    return res.status(404).json({
      success: false,
      error: "Resource not found",
    });
  }
  //mongoose validation errors
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors) // can have multiple errors, see notes below after the code.
      .map((val) => val.message)
      .join(", ");
    return res.status(400).json({
      success: false,
      error: message,
    });
  }
  //jwt errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      error: "Invalid token",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      error: "Token expired",
    });
  }
  return res.status(500).json({
    success: false,
    error:
      process.env.NODE_ENV === "production"
        ? "Internal Server Error"
        : err.message,
  });
};

export { errorHandler };

//mongoose errors
// const user = new User({
//   name: '',           // Fails: required & minlength
//   email: 'invalid',   // Fails: match pattern
//   age: 15            // Fails: min age
// });

// try {
//   await user.save();
// } catch (err) {
//   console.log(err.name); // "ValidationError"
//   console.log(err.errors);
// }

//WHAT err.errors CONTAINs->
// err.errors = {
//   name: {
//     message: 'Name is required',
//     kind: 'required',
//     path: 'name',
//     value: ''
//   },
//   email: {
//     message: 'Please enter a valid email',
//     kind: 'regexp',
//     path: 'email',
//     value: 'invalid'
//   },
//   age: {
//     message: 'Age must be at least 18',
//     kind: 'min',
//     path: 'age',
//     value: 15
//   }
// }
