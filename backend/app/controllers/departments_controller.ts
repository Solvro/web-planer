import Department from '#models/department'
import { createDepartmentValidator } from '#validators/department'
import type { HttpContext } from '@adonisjs/core/http'

export default class DepartmentsController {
  /**
   * Display a list of resource
   */
  async index({}: HttpContext) {
    return Department.query()
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request }: HttpContext) {
    const payload = await request.validateUsing(createDepartmentValidator)
    const department = await Department.create(payload)
    return { message: 'Department created.', department }
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {
    return await Department.findOrFail(params.id)

  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {
    const payload = await request.validateUsing(createDepartmentValidator)
    const currentDepartment = await Department.findOrFail(params.id)
    currentDepartment.merge(payload)
    await currentDepartment.save()
    return { message: 'Department updated successfully.', currDepartment: currentDepartment }
  }

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {
    const department = await Department.findOrFail(params.id)
    await department.delete()
    return { message: 'Department successfully deleted.' }
  }
}
