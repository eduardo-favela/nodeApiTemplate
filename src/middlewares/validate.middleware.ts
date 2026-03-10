import { Request, Response, NextFunction, RequestHandler } from "express";
import { ObjectSchema } from "joi";

/**
 * Generic Express middleware to validate request structures using Joi schemas.
 *
 * @param schema - The compiled Joi schema
 * @param property - The req property to validate (body, params, query)
 * @returns Express middleware
 */
export const validate = (
  schema: ObjectSchema,
  property: "body" | "query" | "params" = "body",
): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
    });

    if (error) {
      // Format details into a clear array of issues
      const errMessages = error.details.map((detail) => detail.message);
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errMessages,
      });
      return;
    }

    // Assign the validated and safely casted values back to the request
    req[property] = value;
    next();
  };
};

export default validate;
