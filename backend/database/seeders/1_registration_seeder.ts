import Registration from '#models/registration'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Registration.createMany([
      {
        id: '1',
        name: 'W05-EBR-SI-3',
        departmentId: 'W01-ABC-XY-1',
        round: 1,
      },
      {
        id: '2',
        name: 'W13-HWDP-SI-3',
        departmentId: 'W01-ABC-XY-1',
        round: 2,
      },
      {
        id: '3',
        name: 'W4-IST-SI-3',
        departmentId: 'W05-MNO-TS-5',
        round: 1,
      },
    ])
  }
}
