import vine from "@vinejs/vine";

export const getOtpValidator = vine.compile(
  vine.object({
    email: vine.string().email().endsWith("@student.pwr.edu.pl"),
  }),
);

export const verifyOtpValidator = vine.compile(
  vine.object({
    email: vine.string().email().endsWith("@student.pwr.edu.pl"),
    otp: vine.string().fixedLength(6),
  }),
);
