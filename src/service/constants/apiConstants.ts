export const API_BASE_URL = "https://685945b9138a18086dfdca1a.mockapi.io";

export const API_ENDPOINTS = {
  PLAYERS: {
    LIST: "/players",
    DETAILS: "/players/:id",
  },
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

export const REQUEST_TIMEOUT = 10000; // 10 seconds
