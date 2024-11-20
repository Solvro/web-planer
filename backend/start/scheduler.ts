import scheduler from 'adonisjs-scheduler/services/main'
import {
  scrapDepartments,
  scrapRegistrations,
  scrapCourses,
  scrapCourseNameGroupsUrls,
  scrapGroupsUrls,
  scrapGroupDetails,
} from '../app/scrap-registrations/scrap_registrations.js'
import Department from '#models/department'
import Registration from '#models/registration'
import Course from '#models/course'
import Group from '#models/group'

function extractLastStringInBrackets(input: string): string | null {
  const regex = /\[([^\]]+)\]/g
  let match
  let lastMatch: string | null = null

  while ((match = regex.exec(input)) !== null) {
    lastMatch = match[1]
  }

  return lastMatch
}

const scrapData = async () => {
  console.log('Scraping departments')
  const departments = await scrapDepartments()
  if (!departments) return
  await Promise.all(
    departments.map((department) =>
      Department.updateOrCreate(
        { id: extractLastStringInBrackets(department.name) ?? department.name },
        { name: department.name, url: department.url }
      )
    )
  )
  console.log('Scraping registrations')
  const registrations = await Promise.all(
    departments.map(async (department) => {
      const regs = await scrapRegistrations(department.url)
      if (!regs) return []
      department.registrations = regs
      department.registrations.forEach(async (registration) => {
        await Registration.updateOrCreate(
          { id: extractLastStringInBrackets(registration.name) ?? registration.name },
          {
            name: registration.name,
            departmentId: extractLastStringInBrackets(department.name) ?? department.name,
          }
        )
      })
      return regs
    })
  ).then((results) => results.flat())
  console.log('Registrations scraped')
  console.log('Scraping courses urls')
  await Promise.all(
    registrations.map(async (registration) => {
      let urls
      try {
        urls = await scrapCourses(registration.url)
      } catch (e) {
        console.log(e)
      }
      if (!urls) return []
      registration.courses = urls.map((courseUrl) => {
        return { url: courseUrl, courseCode: '', groups: [], name: '' }
      })
    })
  )
  console.log('Courses urls scraped')
  console.log('Scraping courses details')
  for (const registration of registrations) {
    await Promise.all(
      registration.courses.map(async (course) => {
        const courseCodeNameGroupsUrls = await scrapCourseNameGroupsUrls(course.url)
        if (!courseCodeNameGroupsUrls) return
        const urls = courseCodeNameGroupsUrls.urls
        course.courseCode = courseCodeNameGroupsUrls.courseCode
        course.name = courseCodeNameGroupsUrls.courseName
        course.groups = urls.map((url) => {
          return { url, groups: [] }
        })
        await Course.updateOrCreate(
          { id: courseCodeNameGroupsUrls.courseCode },
          {
            name: course.name,
            registrationId: extractLastStringInBrackets(registration.name) ?? registration.name,
          }
        )
      })
    )
  }
  console.log('Courses details scraped')
  console.log('Scraping groups details')
  for (const registration of registrations) {
    for (const course of registration.courses) {
      const detailsUrls = (await Promise.all(
        course.groups.map(async (group) => {
          return await scrapGroupsUrls(group.url)
        })
      ).then((results) => results.flat())) as string[]
      if (!detailsUrls) return
      await Promise.all(
        detailsUrls.map(async (url) => {
          const details = await scrapGroupDetails(url)
          if (!details) return
          await Group.create({
            name: details.name.slice(0, 255),
            startTime: details.startTime.slice(0, 255),
            endTime: details.endTime.slice(0, 255),
            group: details.group.slice(0, 255),
            lecturer: details.lecturer.trim().replace(/\s+/g, ' ').slice(0, 255),
            week: details.week,
            day: details.day.slice(0, 255),
            type: details.type.slice(0, 255),
            courseId: course.courseCode.slice(0, 255),
            url: url.slice(0, 255),
          })
        })
      )
    }
  }
  console.log('Groups details scraped')
}

// scrapData()
// scheduler.call(scrapData).everyTwoHours()
