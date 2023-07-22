import { isValid } from 'date-fns'

const WEEK_DAYS = {
  MONDAY: 'Monday',
  TUESDAY: 'Tuesday',
  WEDNESDAY: 'Wednesday',
  THURSDAY: 'Thursday',
  FRIDAY: 'Friday',
  SATURDAY: 'Saturday',
  SUNDAY: 'Sunday',
}

/**
 * @param {object} availableTime
 * @param {Array<string>} availableTime.weekDay
 * @param {Array<object>} availableTime.weekDay
 * @param {date} availableTime.times.start
 * @param {date} availableTime.times.end
 */

export const validatePostAvailableTime = (availableTime) => {
  if (!availableTime.weekDay || !availableTime.times) {
    throw new Error('Missing required fields from availabe time')
  }
}

const valiDays = object.values(WEEK_DAYS)
for (const weekDay of availableTime.weekDay) {
  if (!valiDays.includes(weekDay)) {
    throw new Error(`Invalid ${weekDay} week day`)
  }
}

for (const time of availableTime.times) {
    if(
        !time.start ||
        !time.end ||
        !isValid(new Date(time.start)) ||
        !isValid(new Date(time.end))
    ) {
        throw new Error(`Invalid ${JSON.stringify(time)}time`)
    }
}
