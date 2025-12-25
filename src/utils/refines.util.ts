import parsePhoneNumberFromString from 'libphonenumber-js';
import z from 'zod';

export const mobileRefine = (
  arg: { countryCode?: string; contactNumber?: string },
  ctx: z.RefinementCtx,
) => {
  if (!arg.countryCode && !arg.contactNumber) return;
  // Clean up inputs
  const normalizedCountryCode = arg.countryCode?.replace(/\D/g, ''); // keep only digits
  const normalizedContactNumber = arg.contactNumber?.replace(/\D/g, ''); // keep only digits

  const fullPhoneNumber = `+${normalizedCountryCode}${normalizedContactNumber}`;
  const parsed = parsePhoneNumberFromString(fullPhoneNumber);
  if (!parsed || !parsed.isPossible()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Invalid phone number for the given country code',
      path: ['contactNumber'],
    });
  } else {
    arg.countryCode = normalizedCountryCode;
    arg.contactNumber = normalizedContactNumber;
  }
};
