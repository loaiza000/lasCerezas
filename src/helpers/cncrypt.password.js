import bcrypt from "bcrypt";

export const encryptPassword = async (password) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const passwordEcrypt = bcrypt.hashSync(password, salt);
    return passwordEcrypt;
  } catch (error) {
    console.log("Error al encryptar el password", error.message);
  }
};
