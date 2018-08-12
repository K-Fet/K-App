function getCurrentSchoolYear() {
  const date = new Date();

  if (date.getMonth() < 7) {
    return date.getFullYear() - 1;
  }
  return date.getFullYear();
}

export const CURRENT_SCHOOL_YEAR = getCurrentSchoolYear();
