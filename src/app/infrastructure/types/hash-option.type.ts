export type HashOptions = {
  /**
   * Salt to hash the password
   * @default env.PASSWORD_SALT || "123456"
   */
  salt?: string;
  /**
   * Number of iterations to hash the password
   * @default env.PASSWORD_ITERATIONS || 1
   */
  iterations?: number;
};
