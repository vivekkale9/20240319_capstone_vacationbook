const validateUser = (userData) => {
  const { userName, email, password, mobileNumber } = userData;

  // Validate username
  if (!userName || typeof userName !== "string" || userName.length < 3) {
    throw new Error("Username must be a string with at least 3 characters.");
  }

  // Validate email
  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Please provide a valid email address.");
    }
  }

  // Validate phone number
  if (mobileNumber) {
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone_number)) {
      throw new Error("Please provide a valid 10-digit phone number.");
    }
  }

  // Validate password
  if (!password || typeof password !== "string" || password.length < 8) {
    throw new Error("Password must be a string with at least 8 characters.");
  }

  // No validation errors
  return null;
};

module.exports = { validateUser };
