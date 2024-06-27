import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase
describe('Fetch Nearby Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsUseCase(gymsRepository)
  })

  it('should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: 'Near Gym',
      description: null,
      phone: '',
      latitude: -3.0992088,
      longitude: -59.9956569,
    })

    await gymsRepository.create({
      title: 'Far Gym',
      description: null,
      phone: '',
      latitude: -3.016157,
      longitude: -59.912194,
    })

    // -3.016157,-59.912194

    const { gyms } = await sut.execute({
      userLatitude: -3.0992088,
      userLongitude: -59.9956569,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })])
  })
})
