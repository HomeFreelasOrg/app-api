export const getAgeByBirth = (birth: Date): number => {
  const now = new Date()
  const nowYear = now.getFullYear()
  const nowMonth = now.getMonth()
  const birthYear = birth.getFullYear()
  const birthMonth = birth.getMonth()
  let age = nowYear - birthYear

  if (birthMonth > nowMonth) {
    age--
  } else if (birthMonth === nowMonth) {
    const nowDay = now.getDate()
    const birthDay = birth.getDate()

    if (birthDay > nowDay) {
      age--
    }
  }

  return age
}
