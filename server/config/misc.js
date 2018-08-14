function getCurrentSchoolYear() {
  const date = new Date();

  if (date.getMonth() < 7) {
    return date.getFullYear() - 1;
  }
  return date.getFullYear();
}

module.exports = {

  /**
   * Current school year.
   *
   * For school year 2017-2018, current year will be 2017
   */
  CURRENT_SCHOOL_YEAR: getCurrentSchoolYear(),

};
