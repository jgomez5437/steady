export function isValidPatientDetails(name: string, dob: Date | null): boolean {
  return name.trim().length > 0 && dob !== null;
}
