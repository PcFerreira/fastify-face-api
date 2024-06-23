import { PrismaClient } from '@prisma/client'

BigInt.prototype.toJSON = function () {
  return this.toString()
}

const prisma = new PrismaClient()

export default prisma
