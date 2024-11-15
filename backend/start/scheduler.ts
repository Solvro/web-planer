//@ts-ignore
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

//@ts-ignore
const scrapData = async () => {
  console.log('Scraping departments')
  const departments = await scrapDepartments()
  if (!departments) return
  departments.forEach(async (department) => {
    await Department.updateOrCreate({ name: department.name }, { url: department.url })
  })
  console.log('Departments scraped')
  console.log('Scraping registrations')
  for (const department of departments) {
    const registrations = await scrapRegistrations(department.url)
    if (!registrations) return
    department.registrations = registrations
    for (const registration of registrations) {
      await Registration.updateOrCreate(
        { id: extractLastStringInBrackets(registration.name) ?? registration.name },
        {
          name: registration.name,
          departmentId: extractLastStringInBrackets(department.name) ?? department.name,
        }
      )
      const coursesUrls = await scrapCourses(registration.url)
      if (!coursesUrls) continue
      registration.courses = coursesUrls.map((courseUrl) => {
        return { url: courseUrl, courseCode: '', groups: [], name: '' }
      })
      console.log('Scraping courses')
      for (const course of registration.courses) {
        const courseCodeNameGroupsUrls = await scrapCourseNameGroupsUrls(course.url)
        if (!courseCodeNameGroupsUrls) continue
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
        for (const group of course.groups) {
          const detailsUrls = await scrapGroupsUrls(group.url)
          if (!detailsUrls) continue
          for (const url of detailsUrls) {
            const details = await scrapGroupDetails(url)
            if (!details) continue
            await Group.updateOrCreate(
              {
                id:
                  course.courseCode +
                  details.name +
                  details.startTime +
                  details.endTime +
                  details.day +
                  details.lecturer.trim().replace(/\s+/g, ' ') +
                  details.type +
                  details.group,
              },
              {
                name: details.name,
                startTime: details.startTime,
                endTime: details.endTime,
                group: details.group,
                lecturer: details.lecturer.trim().replace(/\s+/g, ' '),
                week: details.week,
                day: details.day,
                type: details.type,
                courseId: course.courseCode,
              }
            )
            group.groups.push(details)
          }
        }
      }
      console.log('Courses scraped')
    }
  }
  console.log('Registrations scraped')
}

function extractLastStringInBrackets(input: string): string | null {
  const regex = /\[([^\]]+)\]/g
  let match
  let lastMatch: string | null = null

  while ((match = regex.exec(input)) !== null) {
    lastMatch = match[1]
  }

  return lastMatch
}
//@ts-ignore
const scrapDataTest = async () => {
  console.log('Scraping departments')
  const departments = await scrapDepartments()
  if (!departments) return

  departments.forEach(async (department) => {
    const departmentId = extractLastStringInBrackets(department.name)
    await Department.updateOrCreate(
      { id: departmentId ?? department.name },
      { name: department.name, url: department.url }
    )
  })
  console.log('Departments scraped')
  const department = departments[0]
  console.log('Scraping registrations')

  const registrations = await scrapRegistrations(department.url)
  if (!registrations) return
  department.registrations = registrations
  for (const registration of registrations) {
    await Registration.updateOrCreate(
      { id: extractLastStringInBrackets(registration.name) ?? registration.name },
      {
        name: registration.name,
        departmentId: extractLastStringInBrackets(department.name) ?? department.name,
      }
    )
    const coursesUrls = await scrapCourses(registration.url)
    if (!coursesUrls) continue
    registration.courses = coursesUrls.map((courseUrl) => {
      return { url: courseUrl, courseCode: '', groups: [], name: '' }
    })
    console.log('Scraping courses')
    for (const course of registration.courses) {
      const courseCodeNameGroupsUrls = await scrapCourseNameGroupsUrls(course.url)
      if (!courseCodeNameGroupsUrls) continue
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
      for (const group of course.groups) {
        const detailsUrls = await scrapGroupsUrls(group.url)
        if (!detailsUrls) continue
        for (const url of detailsUrls) {
          const details = await scrapGroupDetails(url)
          if (!details) continue
          await Group.updateOrCreate(
            {
              id:
                course.courseCode +
                details.name +
                details.startTime +
                details.endTime +
                details.day +
                details.lecturer.trim().replace(/\s+/g, ' ') +
                details.type +
                details.group,
            },
            {
              name: details.name,
              startTime: details.startTime,
              endTime: details.endTime,
              group: details.group,
              lecturer: details.lecturer.trim().replace(/\s+/g, ' '),
              week: details.week,
              day: details.day,
              type: details.type,
              courseId: course.courseCode,
            }
          )
          group.groups.push(details)
        }
      }
    }
    console.log('Courses scraped')
  }

  console.log('Registrations scraped')
}
