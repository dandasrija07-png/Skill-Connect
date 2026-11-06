export class ApiResponse {
  constructor(statusCode, data = null, message = "Operation completed successfully", extra = {}) {
    this.success = statusCode < 400;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    if (extra && typeof extra === "object") {
      Object.assign(this, extra);
    }
    this.timestamp = new Date().toISOString();
  }

  static success(dataOrRes, messageOrCode = "Operation successful", maybeData = null, maybeMessage = "") {
    if (dataOrRes && typeof dataOrRes.status === "function") {
      const code = typeof messageOrCode === "number" ? messageOrCode : 200;
      return dataOrRes.status(code).json(new ApiResponse(code, maybeData, maybeMessage || "Operation successful"));
    }
    const message = typeof messageOrCode === "string" ? messageOrCode : "Operation successful";
    return new ApiResponse(200, dataOrRes, message);
  }

  static created(dataOrRes, messageOrCode = "Resource created successfully", maybeData = null) {
    if (dataOrRes && typeof dataOrRes.status === "function") {
      return dataOrRes.status(201).json(new ApiResponse(201, maybeData, typeof messageOrCode === "string" ? messageOrCode : "Resource created"));
    }
    const message = typeof messageOrCode === "string" ? messageOrCode : "Resource created successfully";
    return new ApiResponse(201, dataOrRes, message);
  }

  static paginated(data, page, limit, total, message = "Data retrieved successfully", extra = {}) {
    const totalPages = Math.ceil(total / (limit || 1)) || 1;
    return new ApiResponse(200, data, message, {
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: Number(total),
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      },
      ...extra
    });
  }
}
