import scheduler from 'adonisjs-scheduler/services/main'
import {
  scrapDepartments,
  scrapRegistrations,
  scrapCourses,
  scrapCourseNameGroupsUrls,
  scrapGroupsUrls,
  scrapGroupDetails,
} from '../app/scrap-registrations/scrapRegistrations.js'
import Department from '#models/department'
import Registration from '#models/registration'
import Course from '#models/course'
import Group from '#models/group'

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
    if (!registrations) continue
    department.registrations = registrations
    for (const registration of registrations) {
      await Registration.updateOrCreate(
        { name: registration.name },
        { department: department.name }
      )
      const coursesUrls = await scrapCourses(registration.url)
      if (!coursesUrls) continue
      registration.courses
      registration.courses = coursesUrls.map((courseUrl) => {
        return { url: courseUrl, groups: [], name: '' }
      })
      console.log('Scraping courses')
      for (const course of registration.courses) {
        let courseName = ''
        let urls: string[] = []
        const courseNameGroupsUrls = await scrapCourseNameGroupsUrls(course.url)
        if (!courseNameGroupsUrls) continue
        urls = courseNameGroupsUrls.urls
        course.name = courseNameGroupsUrls.courseName
        course.groups = urls.map((url) => {
          return { url, groups: [] }
        })
        await Course.updateOrCreate(
          { id: course.url },
          { name: course.name, registrationId: registration.name }
        )
        for (const group of course.groups) {
          const detailsUrls = await scrapGroupsUrls(group.url)
          if (!detailsUrls) continue
          for (const url of detailsUrls) {
            const details = await scrapGroupDetails(url)
            if (!details) continue
            await Group.updateOrCreate(
              { name: details.name },
              {
                startTime: details.startTime,
                endTime: details.endTime,
                group: details.group,
                lecturer: details.lecturer,
                week: details.week,
                day: details.day,
                type: details.type,
                courseId: course.url,
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

function extractCourseCode(url: string): string | null {
  const regex = /[?&_]prz_kod=([^&]+)/
  const match = url.match(regex)

  return match ? match[1] : null
}

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
      return { url: courseUrl, groups: [], name: '' }
    })
    console.log('Scraping courses')
    for (const course of registration.courses) {
      const courseNameGroupsUrls = await scrapCourseNameGroupsUrls(course.url)
      if (!courseNameGroupsUrls) continue
      const urls = courseNameGroupsUrls.urls
      course.name = courseNameGroupsUrls.courseName
      course.groups = urls.map((url) => {
        return { url, groups: [] }
      })
      await Course.updateOrCreate(
        { id: extractCourseCode(course.url) ?? course.url },
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
            { name: details.name },
            {
              startTime: details.startTime,
              endTime: details.endTime,
              group: details.group,
              lecturer: details.lecturer.trim().replace(/\s+/g, ' '),
              week: details.week,
              day: details.day,
              type: details.type,
              courseId: extractCourseCode(course.url) ?? course.url,
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
scrapDataTest()
scheduler.call(scrapDataTest).everyTwoHours()

// scheduler
//   .call(async () => {
//     console.log('Scraping departments')
//     const departments = await scrapDepartments()
//     if (!departments) return
//     departments.forEach(async (department) => {
//       await Department.updateOrCreate({ name: department.name }, { url: department.url })
//     })
//     console.log('Departments scraped')
//     console.log('Scraping registrations')
//     for (const department of departments) {
//       const registrations = await scrapRegistrations(department.url)
//       if (!registrations) continue
//       department.registrations = registrations
//       for (const registration of registrations) {
//         await Registration.updateOrCreate(
//           { name: registration.name },
//           { department: department.name }
//         )
//         const coursesUrls = await scrapCourses(registration.url)
//         if (!coursesUrls) continue
//         registration.courses
//         registration.courses = coursesUrls.map((courseUrl) => {
//           return { url: courseUrl, groups: [], name: '' }
//         })
//         console.log('Scraping courses')
//         for (const course of registration.courses) {
//           let courseName = ''
//           let urls: string[] = []
//           const courseNameGroupsUrls = await scrapCourseNameGroupsUrls(course.url)
//           if (!courseNameGroupsUrls) continue
//           courseName = courseNameGroupsUrls.courseName
//           urls = courseNameGroupsUrls.urls
//           course.name = courseName
//           course.groups = urls.map((url) => {
//             return { url, groups: [] }
//           })
//           for (const group of course.groups) {
//             const detailsUrls = await scrapGroupsUrls(group.url)
//             if (!detailsUrls) continue
//             for (const url of detailsUrls) {
//               const details = await scrapGroupDetails(url)
//               if (!details) continue
//               group.groups.push(details)
//             }
//           }
//         }
//         console.log('Courses scraped')
//       }
//     }
//     console.log('Registrations scraped')
//   })
//   .everyMinute()
