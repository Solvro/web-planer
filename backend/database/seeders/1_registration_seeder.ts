import Registration from '#models/registration'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Registration.createMany([
      {
        name: 'W05-EBR-SI-3',
        departmentId: 'Wydział Elektryczny [W5]',
        round: 1,
      },
      {
        name: 'W13-HWDP-SI-3',
        departmentId: 'Wydział Matematyki [W13]',
        round: 2,
      },
      {
        name: 'W4-IST-SI-3',
        departmentId: 'Wydział Informatyki i Telekomunikacji [W4N]',
        round: 1,
      },
    ])
  }
}
