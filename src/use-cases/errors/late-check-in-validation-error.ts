export class LateCheckInValidationError extends Error {
  constructor() {
    super('The check-in can be only validated ultil 20 minutes after created.')
  }
}
